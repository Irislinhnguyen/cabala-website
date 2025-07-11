import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Get auth token
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token xác thực không hợp lệ' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json(
        { error: 'Token xác thực không hợp lệ' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const courseId = formData.get('courseId') as string;
    const amount = parseFloat(formData.get('amount') as string);
    const receiptFile = formData.get('receipt') as File;

    if (!courseId || !amount || !receiptFile) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      );
    }

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(receiptFile.type)) {
      return NextResponse.json(
        { error: 'Định dạng file không được hỗ trợ. Chỉ chấp nhận JPG, PNG, PDF' },
        { status: 400 }
      );
    }

    if (receiptFile.size > maxSize) {
      return NextResponse.json(
        { error: 'File quá lớn. Vui lòng chọn file nhỏ hơn 5MB' },
        { status: 400 }
      );
    }

    // Check if course exists (from our API)
    const coursesResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/courses`);
    const coursesData = await coursesResponse.json();
    
    if (!coursesData.success) {
      return NextResponse.json(
        { error: 'Không thể xác thực khóa học' },
        { status: 400 }
      );
    }

    const course = coursesData.courses.find((c: { id: number }) => c.id.toString() === courseId);
    if (!course) {
      return NextResponse.json(
        { error: 'Khóa học không tồn tại' },
        { status: 404 }
      );
    }

    // Check if user already has a pending payment for this course
    const existingPayment = await prisma.payment.findFirst({
      where: {
        userId: user.userId,
        courseId: courseId,
        status: {
          in: ['PENDING', 'PAID', 'VERIFIED']
        }
      }
    });

    if (existingPayment) {
      return NextResponse.json(
        { error: 'Bạn đã có đơn thanh toán cho khóa học này' },
        { status: 409 }
      );
    }

    // For now, we'll store the file info as a placeholder
    // In production, you'd upload to a cloud storage service
    const receiptUrl = `/uploads/receipts/${Date.now()}-${receiptFile.name}`;

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId: user.userId,
        courseId: courseId,
        amount: amount,
        currency: 'VND',
        paymentMethod: 'BANK_TRANSFER',
        bankName: 'VIB',
        bankAccountNumber: '0287040600051592',
        transactionId: `CABALA-${Date.now()}`,
        receiptUrl: receiptUrl,
        receiptUploadedAt: new Date(),
        status: 'PENDING',
        notes: `Payment for course: ${course.title}`,
        metadata: {
          courseName: course.title,
          submittedAt: new Date().toISOString(),
          fileType: receiptFile.type,
          fileSize: receiptFile.size
        }
      }
    });

    // Create enrollment record with PENDING status
    await prisma.enrollment.create({
      data: {
        userId: user.userId,
        courseId: courseId,
        status: 'PENDING',
        progress: 0
      }
    });

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      message: 'Thanh toán đã được gửi thành công. Chúng tôi sẽ xác nhận trong vòng 24 giờ.',
      estimatedApprovalTime: '24 giờ'
    });

  } catch (error) {
    console.error('Payment submission error:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi trong quá trình xử lý thanh toán' },
      { status: 500 }
    );
  }
}