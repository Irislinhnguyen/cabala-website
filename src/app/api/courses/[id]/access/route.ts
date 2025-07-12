import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';
import { createMoodleClient } from '@/lib/moodle/client';

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

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Find course in database by Moodle course ID
    const course = await prisma.course.findUnique({
      where: { moodleCourseId: courseId },
    });

    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    // Check if user is enrolled
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { success: false, error: 'User not enrolled in this course' },
        { status: 403 }
      );
    }

    // Check if user has Moodle account
    if (!user.moodleUserId) {
      return NextResponse.json(
        { success: false, error: 'Moodle account not found' },
        { status: 404 }
      );
    }

    // Generate Moodle course URL
    const moodleUrl = process.env.MOODLE_URL;
    if (!moodleUrl) {
      return NextResponse.json(
        { success: false, error: 'Moodle configuration missing' },
        { status: 500 }
      );
    }

    // For now, return direct course URL
    // In a full SSO implementation, you'd generate a login token here
    const courseUrl = `${moodleUrl}/course/view.php?id=${courseId}`;
    
    // For basic SSO, we can use autologin with username
    // This requires Moodle to be configured for external authentication
    const loginUrl = user.moodleUsername 
      ? `${moodleUrl}/login/index.php?username=${user.moodleUsername}&redirect=${encodeURIComponent(courseUrl)}`
      : courseUrl;

    return NextResponse.json({
      success: true,
      moodleUrl: loginUrl,
      courseUrl,
      message: 'Course access granted',
    });

  } catch (error) {
    console.error('Course access error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate course access',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}