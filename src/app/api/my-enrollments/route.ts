import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';
import { createMoodleClient } from '@/lib/moodle/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
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

    // Get user enrollments from database with course details
    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: decoded.userId,
      },
      include: {
        course: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Create Moodle client to get additional course data
    const moodleClient = createMoodleClient();
    const allMoodleCourses = await moodleClient.getAllCourses();

    // Transform enrollments to include Moodle course data
    const enrichedEnrollments = enrollments.map(enrollment => {
      const moodleCourseId = enrollment.course?.moodleCourseId;
      const moodleCourse = moodleCourseId ? allMoodleCourses.find(c => c.id === moodleCourseId) : null;
      
      return {
        id: enrollment.id,
        status: enrollment.status,
        progress: enrollment.progress,
        enrolledAt: enrollment.createdAt,
        course: {
          id: moodleCourseId || 0,
          title: moodleCourse?.fullname || enrollment.course?.title || 'Unknown Course',
          shortName: moodleCourse?.shortname || 'unknown',
          description: moodleCourse?.summary || enrollment.course?.description || 'No description available',
          category: moodleCourse?.categoryid || 0,
          visible: moodleCourse?.visible === 1,
          startDate: moodleCourse?.startdate || 0,
          endDate: moodleCourse?.enddate || 0,
          format: moodleCourse?.format || 'topics',
          courseImage: moodleCourse?.courseimage || null,
          price: Number(enrollment.course?.price || 0), // Convert Decimal to number
          currency: enrollment.course?.currency || 'VND',
          level: enrollment.course?.level || 'Beginner',
          instructor: enrollment.course?.instructorName || 'Teacher Linh Nguyen',
          rating: 4.8,
          students: enrollment.course?.enrollmentCount || 10,
          duration: '8 tuần',
          thumbnail: moodleCourse?.courseimage || `/api/placeholder/400/300?text=${encodeURIComponent(moodleCourse?.shortname || 'course')}`,
        }
      };
    });

    return NextResponse.json({
      success: true,
      enrollments: enrichedEnrollments,
      total: enrichedEnrollments.length,
    });

  } catch (error) {
    console.error('Error fetching user enrollments:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch enrollments',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}