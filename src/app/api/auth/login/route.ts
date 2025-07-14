import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { generateToken } from '@/lib/auth';
import { 
  checkRateLimit, 
  rateLimitResponse, 
  validateEmail, 
  validateRequestBody,
  addSecurityHeaders,
  sanitizeEmail,
  RATE_LIMIT_CONFIG 
} from '@/lib/validation';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Login API: Request received');
    
    // Apply rate limiting for login attempts
    const rateLimitCheck = checkRateLimit(request, RATE_LIMIT_CONFIG.MAX_REQUESTS.LOGIN);
    if (!rateLimitCheck.allowed) {
      console.log('🔍 Login API: Rate limit exceeded');
      return rateLimitResponse();
    }

    const body = await request.json();
    console.log('🔍 Login API: Request body received for email:', body.email);

    // Validate request structure
    const bodyValidation = validateRequestBody(body, ['email', 'password']);
    if (!bodyValidation.valid) {
      return addSecurityHeaders(NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      ));
    }

    const { email, password } = body;

    // Validate and sanitize email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return addSecurityHeaders(NextResponse.json(
        { error: 'Email không hợp lệ' },
        { status: 400 }
      ));
    }

    // Basic password validation (don't validate complexity for login)
    if (!password || typeof password !== 'string' || password.length === 0) {
      return addSecurityHeaders(NextResponse.json(
        { error: 'Mật khẩu là bắt buộc' },
        { status: 400 }
      ));
    }

    const sanitizedEmail = sanitizeEmail(email);

    // Find user by email
    console.log('🔍 Login API: Looking for user with email:', sanitizedEmail);
    const user = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    });
    
    console.log('🔍 Login API: User found:', user ? 'Yes' : 'No');
    console.log('🔍 Login API: User has password:', user?.password ? 'Yes' : 'No');

    if (!user || !user.password) {
      console.log('🔍 Login API: User not found or no password');
      return addSecurityHeaders(NextResponse.json(
        { error: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      ));
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return addSecurityHeaders(NextResponse.json(
        { error: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      ));
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      role: user.role,
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    return addSecurityHeaders(NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        role: user.role,
      },
    }));

  } catch (error) {
    console.error('🔍 Login API: Detailed error:', error);
    return addSecurityHeaders(NextResponse.json(
      { 
        error: 'Đã xảy ra lỗi trong quá trình đăng nhập',
        debug: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    ));
  }
}