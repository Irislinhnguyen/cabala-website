import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const courseId = parseInt(id);
    
    if (isNaN(courseId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid course ID' },
        { status: 400 }
      );
    }

    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Find course in database by Moodle course ID
    const course = await prisma.course.findUnique({
      where: { moodleCourseId: courseId },
    });

    if (!course) {
      return NextResponse.json({
        success: true,
        enrolled: false,
        enrollmentStatus: null,
        enrolledAt: null,
        progress: 0,
      });
    }

    // Check enrollment status
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: decoded.userId,
          courseId: course.id,
        },
      },
    });

    return NextResponse.json({
      success: true,
      enrolled: !!enrollment,
      enrollmentStatus: enrollment?.status || null,
      enrolledAt: enrollment?.createdAt || null,
      progress: enrollment?.progress || 0,
    });

  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check enrollment status',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}