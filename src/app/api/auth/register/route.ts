import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from '@prisma/client/runtime/library';

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password } = await request.json();

    // Comprehensive input validation
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'Tất cả các trường là bắt buộc' },
        { status: 400 }
      );
    }

    // Validate and sanitize inputs
    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanEmail = email.trim().toLowerCase();
    
    if (cleanFirstName.length < 1 || cleanLastName.length < 1) {
      return NextResponse.json(
        { error: 'Tên và họ không được để trống' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { error: 'Email không hợp lệ' },
        { status: 400 }
      );
    }

    // Enhanced password validation
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Mật khẩu phải có ít nhất 6 ký tự' },
        { status: 400 }
      );
    }
    
    if (password.length > 100) {
      return NextResponse.json(
        { error: 'Mật khẩu quá dài' },
        { status: 400 }
      );
    }

    // Check if user already exists with retry logic
    let existingUser;
    try {
      existingUser = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });
    } catch (error) {
      // If connection error, retry once
      if (error instanceof PrismaClientUnknownRequestError) {
        console.log('Retrying user lookup due to connection error...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        try {
          existingUser = await prisma.user.findUnique({
            where: { email: cleanEmail },
          });
        } catch (retryError) {
          console.error('User lookup retry failed:', retryError);
          return NextResponse.json(
            { error: 'Lỗi kết nối cơ sở dữ liệu. Vui lòng thử lại.' },
            { status: 503 }
          );
        }
      } else {
        throw error;
      }
    }

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email đã được sử dụng' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with comprehensive error handling
    let user;
    try {
      user = await prisma.user.create({
        data: {
          firstName: cleanFirstName,
          lastName: cleanLastName,
          name: `${cleanFirstName} ${cleanLastName}`,
          email: cleanEmail,
          password: hashedPassword,
          role: 'STUDENT',
          isActive: true,
        },
      });
    } catch (error) {
      // Handle specific Prisma errors
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return NextResponse.json(
            { error: 'Email đã được sử dụng' },
            { status: 409 }
          );
        }
      }
      
      // If connection error, retry once
      if (error instanceof PrismaClientUnknownRequestError) {
        console.log('Retrying user creation due to connection error...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        try {
          user = await prisma.user.create({
            data: {
              firstName: cleanFirstName,
              lastName: cleanLastName,
              name: `${cleanFirstName} ${cleanLastName}`,
              email: cleanEmail,
              password: hashedPassword,
              role: 'STUDENT',
              isActive: true,
            },
          });
        } catch (retryError) {
          console.error('User creation retry failed:', retryError);
          return NextResponse.json(
            { error: 'Lỗi kết nối cơ sở dữ liệu. Vui lòng thử lại.' },
            { status: 503 }
          );
        }
      } else {
        throw error;
      }
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      name: user.name || `${firstName} ${lastName}`,
      role: user.role,
    });

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.name || `${firstName} ${lastName}`,
        role: user.role,
      },
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific error types
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'Email đã được sử dụng' },
          { status: 409 }
        );
      }
      if (error.code === 'P2022') {
        return NextResponse.json(
          { error: 'Lỗi cấu trúc cơ sở dữ liệu. Vui lòng liên hệ quản trị viên.' },
          { status: 503 }
        );
      }
    }
    
    if (error instanceof PrismaClientUnknownRequestError) {
      return NextResponse.json(
        { error: 'Lỗi kết nối cơ sở dữ liệu. Vui lòng thử lại sau.' },
        { status: 503 }
      );
    }
    
    // Generic error
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi trong quá trình đăng ký. Vui lòng thử lại.' },
      { status: 500 }
    );
  }
}