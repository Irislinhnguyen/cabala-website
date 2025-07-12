import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateJWTToken, generateSSOUrl, generateCabalaUsername, generateMoodleEmail } from '@/lib/jwt';
import { createMoodleClient } from '@/lib/moodle/client';

// Helper function to create new Moodle account
async function createNewMoodleAccount(user: any, needsUniqueEmail: boolean) {
  const moodleClient = createMoodleClient();
  
  const username = generateCabalaUsername(user.email);
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
    
    let token = null;
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (tokenParam) {
      token = tokenParam;
    } else {
      return new NextResponse('Authentication required', { status: 401 });
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      return new NextResponse('Invalid token', { status: 401 });
    }

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
        } catch (error) {
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
              description: moodleCourse.summary || '',
              moodleCourseId: courseId,
              price: 0,
              currency: 'VND',
              level: 'Beginner',
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

    // STEP 3: Generate JWT token for SSO
    console.log('🔍 Step 3: Generating SSO token...');
    console.log('🔍 Using email for JWT:', finalMoodleEmail);
    console.log('🔍 Using username for JWT:', finalMoodleUsername);
    const jwtToken = generateJWTToken({
      email: finalMoodleEmail, // Use the correct Moodle email
      username: finalMoodleUsername, // Use the actual Moodle username
      firstName: user.firstName,
      lastName: user.lastName
    });

    // Create redirect URL to course after SSO login
    const moodleUrl = process.env.MOODLE_URL;
    const courseUrl = `${moodleUrl}/course/view.php?id=${courseId}`;
    
    // Generate SSO URL with JWT token
    const ssoUrl = generateSSOUrl(jwtToken, courseUrl);
    
    console.log('✅ SSO process completed successfully:', {
      finalMoodleUserId,
      finalMoodleUsername,
      finalMoodleEmail,
      courseId,
      ssoUrl
    });

    // Create redirect HTML page
    const redirectHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>Redirecting to Course...</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .container {
            text-align: center;
            background: rgba(255, 255, 255, 0.1);
            padding: 2rem;
            border-radius: 10px;
            backdrop-filter: blur(10px);
        }
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 20px auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Đang đăng nhập vào Moodle...</h2>
        <div class="spinner"></div>
        <p>Bạn sẽ được chuyển hướng đến khóa học trong giây lát.</p>
    </div>

    <script>
        // Redirect to SSO URL immediately
        window.location.href = '${ssoUrl}';
        
        // Debug info for development
        console.log('SSO URL:', '${ssoUrl}');
        console.log('Course URL:', '${courseUrl}');
    </script>
</body>
</html>`;

    return new NextResponse(redirectHtml, {
      headers: {
        'Content-Type': 'text/html',
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
<html>
<head>
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
        'Content-Type': 'text/html',
      },
    });
  }
}