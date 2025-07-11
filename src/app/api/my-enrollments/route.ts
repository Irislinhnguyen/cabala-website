import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
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

    // Fetch user's enrollments with course and payment information
    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: user.userId,
      },
      include: {
        // Note: Since we don't have course data in DB yet, we'll fetch from Moodle API
        // For now, we'll return enrollment data and fetch course details separately
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get course details from Moodle API
    const coursesResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/courses`);
    const coursesData = await coursesResponse.json();
    
    if (!coursesData.success) {
      return NextResponse.json(
        { error: 'Không thể tải thông tin khóa học' },
        { status: 500 }
      );
    }

    // Get payment information for each enrollment
    const enrichedEnrollments = await Promise.all(
      enrollments.map(async (enrollment) => {
        // Find course details from Moodle API
        const course = coursesData.courses.find((c: { id: number }) => c.id.toString() === enrollment.courseId);
        
        // Get payment information
        const payment = await prisma.payment.findFirst({
          where: {
            userId: user.userId,
            courseId: enrollment.courseId,
          },
          orderBy: {
            createdAt: 'desc'
          }
        });

        return {
          id: enrollment.id,
          status: enrollment.status,
          progress: enrollment.progress,
          createdAt: enrollment.createdAt,
          updatedAt: enrollment.updatedAt,
          course: course ? {
            id: course.id.toString(),
            title: course.title,
            description: course.description || 'Mô tả khóa học',
            level: course.level || 'Beginner',
            duration: course.duration || '8 tuần',
            instructor: course.instructor || 'Giảng viên Cabala',
          } : {
            id: enrollment.courseId,
            title: 'Khóa học không tìm thấy',
            description: 'Thông tin khóa học không khả dụng',
            level: 'Unknown',
            duration: 'Unknown',
            instructor: 'Unknown',
          },
          payment: payment ? {
            id: payment.id,
            status: payment.status,
            amount: parseFloat(payment.amount.toString()),
            createdAt: payment.createdAt,
            paidAt: payment.paidAt,
            verifiedAt: payment.verifiedAt,
          } : null,
        };
      })
    );

    return NextResponse.json({
      success: true,
      enrollments: enrichedEnrollments,
      total: enrichedEnrollments.length,
    });

  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi khi tải danh sách khóa học' },
      { status: 500 }
    );
  }
}