import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';
import { createMoodleClient } from '@/lib/moodle/client';

const prisma = new PrismaClient();

export async function POST(
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

    // Ensure course exists in database
    let course = await prisma.course.findUnique({
      where: { moodleCourseId: courseId },
    });

    if (!course) {
      // Create course record if it doesn't exist
      const moodleClient = createMoodleClient();
      const allMoodleCourses = await moodleClient.getAllCourses();
      const moodleCourse = allMoodleCourses.find(c => c.id === courseId);
      
      if (!moodleCourse) {
        return NextResponse.json(
          { success: false, error: 'Course not found in Moodle' },
          { status: 404 }
        );
      }

      course = await prisma.course.create({
        data: {
          moodleCourseId: courseId,
          title: moodleCourse.fullname,
          slug: moodleCourse.shortname.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          description: moodleCourse.summary || null,
          instructorName: 'Teacher Linh Nguyen',
          price: 0, // Free for now
        },
      });
    }

    // Check if user is already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json({
        success: true,
        message: 'User already enrolled',
        enrollment: existingEnrollment,
      });
    }

    // Create Moodle client
    const moodleClient = createMoodleClient();

    let moodleUserId = user.moodleUserId;

    // Create Moodle user if doesn't exist
    if (!moodleUserId) {
      try {
        // Check if user exists in Moodle by email
        let moodleUser;
        try {
          moodleUser = await moodleClient.getUserByEmail(user.email);
        } catch (error) {
          // User doesn't exist, create new one
          const username = user.email.split('@')[0] + '_' + Date.now();
          const tempPassword = Math.random().toString(36).slice(-8) + 'A1!';
          
          moodleUser = await moodleClient.createUser({
            username,
            email: user.email,
            firstname: user.firstName || user.name?.split(' ')[0] || 'User',
            lastname: user.lastName || user.name?.split(' ').slice(1).join(' ') || '',
            password: tempPassword,
          });
        }

        // Update user with Moodle ID
        await prisma.user.update({
          where: { id: user.id },
          data: { 
            moodleUserId: moodleUser.id,
            moodleUsername: moodleUser.username,
          },
        });

        moodleUserId = moodleUser.id;
      } catch (error) {
        console.error('Error creating Moodle user:', error);
        return NextResponse.json(
          { success: false, error: 'Failed to create Moodle account' },
          { status: 500 }
        );
      }
    }

    // Enroll user in Moodle course
    try {
      await moodleClient.enrollUser(courseId, moodleUserId);
    } catch (error) {
      console.error('Error enrolling user in Moodle:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to enroll in course' },
        { status: 500 }
      );
    }

    // Create enrollment record in database
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId: course.id,
        status: 'ACTIVE',
        moodleEnrollmentId: null, // We could fetch this from Moodle if needed
      },
    });

    // Update course enrollment count
    await prisma.course.update({
      where: { id: course.id },
      data: {
        enrollmentCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully enrolled in course',
      enrollment,
      moodleUserId,
    });

  } catch (error) {
    console.error('Enrollment error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to enroll in course',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}