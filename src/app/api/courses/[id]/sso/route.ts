import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateCabalaUsername, generateMoodleEmail } from '@/lib/jwt';
import { createMoodleClient } from '@/lib/moodle/client';

interface DatabaseUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  moodleUserId: number | null;
  moodleUsername: string | null;
}

// Helper function to create new Moodle account
async function createNewMoodleAccount(user: DatabaseUser, needsUniqueEmail: boolean) {
  const moodleClient = createMoodleClient();
  
  const username = generateCabalaUsername();
  const moodleEmail = generateMoodleEmail(user.email, needsUniqueEmail);
  
  // Generate a simpler password that meets Moodle requirements
  const emailPrefix = user.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
  const password = `Cabala${emailPrefix}2024!`;
  
  // Validate and clean user data for Moodle
  const firstname = (user.firstName || 'User').trim();
  const lastname = (user.lastName || 'Student').trim();
  
  // Ensure names don't contain special characters that might cause issues
  const cleanFirstname = firstname.replace(/[<>'"&]/g, '');
  const cleanLastname = lastname.replace(/[<>'"&]/g, '');
  
  console.log('🔍 Creating new Moodle account:', {
    username,
    email: moodleEmail,
    originalEmail: user.email,
    firstname: cleanFirstname,
    lastname: cleanLastname,
    needsUniqueEmail,
    passwordLength: password.length
  });
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(moodleEmail)) {
    throw new Error(`Invalid email format: ${moodleEmail}`);
  }
  
  // Validate username format
  if (username.length < 2 || username.length > 100) {
    throw new Error(`Invalid username length: ${username.length}`);
  }
  
  const moodleUser = await moodleClient.createUser({
    username,
    email: moodleEmail,
    firstname: cleanFirstname,
    lastname: cleanLastname,
    password
  });
  
  console.log('✅ Moodle account created successfully:', {
    id: moodleUser.id,
    username: moodleUser.username,
    email: moodleUser.email
  });
  
  // Update our database
  await prisma.user.update({
    where: { id: user.id },
    data: { 
      moodleUserId: moodleUser.id,
      moodleUsername: moodleUser.username,
      moodlePassword: password
    }
  });
  
  console.log('✅ Database updated with new Moodle credentials');
  
  return moodleUser;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const courseId = parseInt(id);
    
    if (isNaN(courseId)) {
      return new NextResponse('Invalid course ID', { status: 400 });
    }

    // Verify authentication - check both header and query parameter
    const authHeader = request.headers.get('authorization');
    const { searchParams } = new URL(request.url);
    const tokenParam = searchParams.get('token');
    
    console.log('🔍 Authentication check:', {
      hasAuthHeader: !!authHeader,
      hasTokenParam: !!tokenParam,
      authHeaderPrefix: authHeader?.substring(0, 10),
      tokenParamPrefix: tokenParam?.substring(0, 10)
    });
    
    let token = null;
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
      console.log('✅ Using Bearer token from header');
    } else if (tokenParam) {
      token = tokenParam;
      console.log('✅ Using token from query parameter');
    } else {
      console.log('❌ No authentication found - redirecting to login');
      // Redirect to login with course redirect
      const loginUrl = `/login?redirect=${encodeURIComponent(`/courses/${courseId}`)}`;
      return NextResponse.redirect(new URL(loginUrl, request.url));
    }
    
    console.log('🔍 Verifying token...');
    const decoded = verifyToken(token);
    if (!decoded) {
      console.log('❌ Token verification failed - redirecting to login');
      // Redirect to login with course redirect
      const loginUrl = `/login?redirect=${encodeURIComponent(`/courses/${courseId}`)}`;
      return NextResponse.redirect(new URL(loginUrl, request.url));
    }
    
    console.log('✅ Authentication successful for user:', decoded.userId);

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    console.log('🔍 Starting SSO process for user:', {
      email: user.email,
      moodleUserId: user.moodleUserId,
      moodleUsername: user.moodleUsername,
      courseId
    });

    // Initialize Moodle client
    const moodleClient = createMoodleClient();
    let finalMoodleUserId = user.moodleUserId;
    let finalMoodleUsername = user.moodleUsername;
    let finalMoodleEmail = user.email; // Track the actual email to use in JWT

    // STEP 1: Email verification in Moodle
    console.log('🔍 Step 1: Checking if email exists in Moodle...');
    const existingMoodleUser = await moodleClient.getUserByEmail(user.email);
    
    if (existingMoodleUser) {
      console.log('✅ Email found in Moodle:', {
        id: existingMoodleUser.id,
        username: existingMoodleUser.username,
        email: existingMoodleUser.email
      });
      
      // Email found in Moodle - check username match
      if (user.moodleUsername === existingMoodleUser.username) {
        console.log('✅ Perfect match - using existing account');
        finalMoodleUserId = existingMoodleUser.id;
        finalMoodleUsername = existingMoodleUser.username;
        finalMoodleEmail = existingMoodleUser.email; // Use existing account email
      } else {
        console.log('⚠️ Email exists but username mismatch - creating new account with unique email');
        // Email exists but username doesn't match in our DB
        // Treat as NEW account - create with different email
        const newMoodleUser = await createNewMoodleAccount(user, true);
        finalMoodleUserId = newMoodleUser.id;
        finalMoodleUsername = newMoodleUser.username;
        finalMoodleEmail = newMoodleUser.email; // Use new account email
      }
    } else {
      console.log('❌ Email not found in Moodle');
      
      // Email not found in Moodle
      if (!user.moodleUsername) {
        console.log('🆕 No username in our DB either - creating new account with original email');
        // No username in our DB either - create new account with original email
        const newMoodleUser = await createNewMoodleAccount(user, false);
        finalMoodleUserId = newMoodleUser.id;
        finalMoodleUsername = newMoodleUser.username;
        finalMoodleEmail = newMoodleUser.email; // Use new account email
      } else {
        console.log('🔍 We have username but Moodle doesn\'t have email - verifying account exists');
        // We have username but Moodle doesn't have email - verify account exists
        try {
          const moodleUserById = await moodleClient.getUserById(finalMoodleUserId!);
          if (!moodleUserById) {
            throw new Error('Account not found');
          }
          console.log('✅ Account verified by ID - proceeding with existing account');
          finalMoodleEmail = moodleUserById.email; // Use existing account email
        } catch {
          console.log('❌ Account doesn\'t exist - creating new one');
          // Account doesn't exist - create new one
          const newMoodleUser = await createNewMoodleAccount(user, false);
          finalMoodleUserId = newMoodleUser.id;
          finalMoodleUsername = newMoodleUser.username;
          finalMoodleEmail = newMoodleUser.email; // Use new account email
        }
      }
    }

    // STEP 2: Check enrollment and enroll if needed
    console.log('🔍 Step 2: Checking course enrollment...');
    const isEnrolled = await moodleClient.checkUserEnrollment(courseId, finalMoodleUserId!);
    
    if (!isEnrolled) {
      console.log('🎓 User not enrolled - enrolling now...');
      await moodleClient.enrollUser(courseId, finalMoodleUserId!);
      
      // Create local enrollment record
      const existingEnrollment = await prisma.enrollment.findFirst({
        where: {
          userId: user.id,
          course: {
            moodleCourseId: courseId
          }
        }
      });
      
      if (!existingEnrollment) {
        // Find or create local course record
        let dbCourse = await prisma.course.findFirst({
          where: { moodleCourseId: courseId }
        });
        
        if (!dbCourse) {
          // Create basic course record
          const moodleCourse = await moodleClient.getCourseById(courseId);
          dbCourse = await prisma.course.create({
            data: {
              title: moodleCourse.fullname,
              slug: `course-${courseId}`,
              description: moodleCourse.summary || '',
              moodleCourseId: courseId,
              price: 0,
              currency: 'VND',
              level: 'BEGINNER',
              instructorName: 'Teacher Linh Nguyen',
              enrollmentCount: 0
            }
          });
        }
        
        await prisma.enrollment.create({
          data: {
            userId: user.id,
            courseId: dbCourse.id,
            status: 'ACTIVE',
            progress: 0
          }
        });
        
        console.log('✅ Local enrollment record created');
      }
    } else {
      console.log('✅ User already enrolled in course');
    }

    // STEP 3: Create manual login with prefilled credentials
    console.log('🔍 Step 3: Creating manual login redirect...');
    console.log('🔍 Using username:', finalMoodleUsername);
    console.log('🔍 Using password from database');
    
    // Get stored password for this user
    const userWithPassword = await prisma.user.findUnique({
      where: { id: user.id },
      select: { moodlePassword: true }
    });
    
    const moodlePassword = userWithPassword?.moodlePassword;
    if (!moodlePassword) {
      throw new Error('Moodle password not found for user');
    }

    // Create redirect URL to course after login
    const moodleUrl = process.env.MOODLE_URL;
    const courseUrl = `${moodleUrl}/course/view.php?id=${courseId}`;
    
    console.log('🔍 Will redirect to course:', courseUrl);
    
    console.log('✅ Manual login process completed successfully:', {
      finalMoodleUserId,
      finalMoodleUsername,
      finalMoodleEmail,
      courseId,
      courseUrl
    });

    // Create credentials popup page that opens course in new tab
    console.log('🔍 Creating credentials popup and opening course page');

    const credentialsPopupHtml = `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thông tin đăng nhập Moodle</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.1);
            padding: 2rem;
            border-radius: 15px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        .header {
            text-align: center;
            margin-bottom: 2rem;
        }
        .credential-box {
            background: rgba(255, 255, 255, 0.2);
            padding: 1.5rem;
            border-radius: 10px;
            margin: 1rem 0;
        }
        .credential-item {
            margin: 1.5rem 0;
        }
        .credential-label {
            font-weight: bold;
            margin-bottom: 0.5rem;
            font-size: 1.1rem;
        }
        .credential-value {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .credential-text {
            flex: 1;
            padding: 12px 15px;
            background: rgba(255, 255, 255, 0.9);
            color: #333;
            border-radius: 6px;
            font-family: monospace;
            font-size: 1rem;
            border: none;
            outline: none;
        }
        .copy-btn {
            background: #28a745;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
        }
        .copy-btn:hover {
            background: #218838;
            transform: translateY(-2px);
        }
        .copy-btn.copied {
            background: #17a2b8;
        }
        .instructions {
            background: rgba(255, 255, 255, 0.15);
            padding: 1.5rem;
            border-radius: 10px;
            margin: 2rem 0;
        }
        .step {
            display: flex;
            align-items: center;
            margin: 1rem 0;
            font-size: 1.1rem;
        }
        .step-number {
            background: #ffc107;
            color: #333;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            margin-right: 1rem;
            flex-shrink: 0;
        }
        .status {
            text-align: center;
            font-size: 1.2rem;
            margin: 1rem 0;
        }
        .success {
            color: #28a745;
        }
        .info-box {
            background: rgba(255, 193, 7, 0.2);
            border: 2px solid #ffc107;
            padding: 1rem;
            border-radius: 8px;
            margin: 1rem 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎓 Thông tin đăng nhập khóa học</h1>
            <div class="status success">✅ Tài khoản đã sẵn sàng!</div>
        </div>

        <div class="credential-box">
            <div class="credential-item">
                <div class="credential-label">👤 Tên đăng nhập:</div>
                <div class="credential-value">
                    <input type="text" class="credential-text" value="${finalMoodleUsername}" readonly id="username">
                    <button class="copy-btn" onclick="copyToClipboard('username', this)">📋 Copy</button>
                </div>
            </div>
            
            <div class="credential-item">
                <div class="credential-label">🔐 Mật khẩu:</div>
                <div class="credential-value">
                    <input type="text" class="credential-text" value="${moodlePassword}" readonly id="password">
                    <button class="copy-btn" onclick="copyToClipboard('password', this)">📋 Copy</button>
                </div>
            </div>
        </div>

        <div class="instructions">
            <h3>📝 Hướng dẫn đăng nhập:</h3>
            <div class="step">
                <div class="step-number">1</div>
                <div>Đọc và ghi nhớ thông tin đăng nhập ở trên</div>
            </div>
            <div class="step">
                <div class="step-number">2</div>
                <div>Copy tên đăng nhập và mật khẩu (hoặc ghi nhớ)</div>
            </div>
            <div class="step">
                <div class="step-number">3</div>
                <div>Nhấn nút "Mở trang đăng nhập Moodle" bên dưới</div>
            </div>
            <div class="step">
                <div class="step-number">4</div>
                <div>Dán thông tin vào form đăng nhập Moodle</div>
            </div>
            <div class="step">
                <div class="step-number">5</div>
                <div>Sau khi đăng nhập, bạn sẽ ở ngay trang khóa học!</div>
            </div>
        </div>

        <button class="login-button" onclick="openMoodleLogin()" id="moodleBtn">
            🚀 Mở trang đăng nhập Moodle
        </button>

        <div class="info-box">
            <strong>💡 Lưu ý:</strong> Giữ trang này mở để có thể copy thông tin khi cần.
            Trang Moodle sẽ mở trong tab mới.
        </div>
    </div>

    <script>
        const courseUrl = '${courseUrl}';
        
        function openMoodleLogin() {
            const moodleBtn = document.getElementById('moodleBtn');
            moodleBtn.innerHTML = '🔄 Đang mở trang Moodle...';
            moodleBtn.disabled = true;
            
            // Open course page in new tab
            window.open(courseUrl, '_blank');
            
            setTimeout(() => {
                moodleBtn.innerHTML = '✅ Đã mở! Chuyển sang tab Moodle để đăng nhập';
                moodleBtn.style.background = '#17a2b8';
            }, 1000);
        }

        function copyToClipboard(elementId, button) {
            const element = document.getElementById(elementId);
            element.select();
            element.setSelectionRange(0, 99999); // For mobile devices
            
            try {
                document.execCommand('copy');
                const originalText = button.innerHTML;
                button.innerHTML = '✅ Copied!';
                button.classList.add('copied');
                
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy: ', err);
                // Fallback for modern browsers
                navigator.clipboard.writeText(element.value).then(() => {
                    button.innerHTML = '✅ Copied!';
                    button.classList.add('copied');
                    setTimeout(() => {
                        button.innerHTML = '📋 Copy';
                        button.classList.remove('copied');
                    }, 2000);
                });
            }
        }
    </script>
</body>
</html>`;

    return new NextResponse(credentialsPopupHtml, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });

  } catch (error) {
    console.error('❌ SSO error:', error);
    
    // Comprehensive error handling with Vietnamese messages
    let errorMessage = 'Đã xảy ra lỗi trong quá trình đăng ký khóa học';
    let statusCode = 500;
    
    if (error instanceof Error) {
      if (error.message.includes('Invalid parameter value detected')) {
        errorMessage = 'Lỗi tham số không hợp lệ khi tạo tài khoản Moodle. Vui lòng thử lại.';
        statusCode = 400;
      } else if (error.message.includes('User not found')) {
        errorMessage = 'Không tìm thấy tài khoản người dùng.';
        statusCode = 404;
      } else if (error.message.includes('Course not found')) {
        errorMessage = 'Không tìm thấy khóa học.';
        statusCode = 404;
      } else if (error.message.includes('Enrollment failed')) {
        errorMessage = 'Lỗi khi đăng ký khóa học. Vui lòng thử lại.';
        statusCode = 500;
      } else if (error.message.includes('Failed to create user')) {
        errorMessage = 'Không thể tạo tài khoản Moodle. Vui lòng liên hệ hỗ trợ.';
        statusCode = 500;
      }
    }
    
    // Return error page with Vietnamese message
    const errorHtml = `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lỗi đăng ký khóa học</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
            color: white;
        }
        .container {
            text-align: center;
            background: rgba(255, 255, 255, 0.1);
            padding: 2rem;
            border-radius: 10px;
            backdrop-filter: blur(10px);
            max-width: 500px;
        }
        .error-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
        }
        .back-button {
            background: white;
            color: #ee5a24;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            margin-top: 1rem;
            text-decoration: none;
            display: inline-block;
        }
        .back-button:hover {
            background: #f8f9fa;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="error-icon">⚠️</div>
        <h2>Lỗi đăng ký khóa học</h2>
        <p>${errorMessage}</p>
        <p>Vui lòng thử lại sau hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp diễn.</p>
        <a href="/courses" class="back-button">Quay lại danh sách khóa học</a>
    </div>

    <script>
        // Log error for debugging
        console.error('SSO Error Details:', ${JSON.stringify(error instanceof Error ? error.message : 'Unknown error')});
        
        // Auto redirect after 10 seconds
        setTimeout(() => {
            window.location.href = '/courses';
        }, 10000);
    </script>
</body>
</html>`;

    return new NextResponse(errorHtml, {
      status: statusCode,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  }
}