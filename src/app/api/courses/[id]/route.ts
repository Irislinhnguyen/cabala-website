import { NextRequest, NextResponse } from 'next/server';
import { createMoodleClient } from '@/lib/moodle/client';

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

    // Create Moodle client
    const moodleClient = createMoodleClient();
    
    // Fetch all courses and find the specific one
    const courses = await moodleClient.getAllCourses();
    const course = courses.find(c => c.id === courseId);
    
    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    // Transform course data for frontend
    const transformedCourse = {
      id: course.id,
      title: course.fullname,
      shortName: course.shortname,
      description: course.summary || 'Mô tả khóa học sẽ được cập nhật sớm',
      category: course.categoryid,
      visible: course.visible === 1,
      startDate: course.startdate,
      endDate: course.enddate,
      format: course.format,
      courseImage: course.courseimage || null,
      
      // Add default pricing and metadata (these will be managed by admin later)
      price: 0,
      currency: 'VND',
      level: 'Beginner',
      instructor: 'Teacher Linh Nguyen',
      rating: 4.8,
      students: Math.floor(Math.random() * 100) + 10,
      duration: '8 tuần',
      
      // Additional details for course page
      language: course.lang || 'vi',
      enrollmentMethods: course.enrollmentmethods || [],
      
      // Placeholder for future enhancements
      modules: [],
      prerequisites: [],
      learningOutcomes: [],
    };

    return NextResponse.json({
      success: true,
      course: transformedCourse,
    });
  } catch (error) {
    console.error('Error fetching course details:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch course details',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}