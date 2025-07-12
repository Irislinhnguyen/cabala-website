import { NextResponse } from 'next/server';

const MOODLE_URL = process.env.MOODLE_URL;
const MOODLE_TOKEN = process.env.MOODLE_TOKEN;

export async function GET() {
  try {
    if (!MOODLE_URL || !MOODLE_TOKEN) {
      throw new Error('Moodle configuration missing');
    }

    // Fetch courses from Moodle
    const url = `${MOODLE_URL}/webservice/rest/server.php`;
    const params = new URLSearchParams({
      wstoken: MOODLE_TOKEN,
      wsfunction: 'core_course_get_courses',
      moodlewsrestformat: 'json',
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    const courses = await response.json();

    if (courses.exception) {
      throw new Error(`Moodle Error: ${courses.message}`);
    }

    // Filter out the site course and transform data
    const transformedCourses = courses
      .filter((course: { id: number }) => course.id !== 1) // Remove site course
      .map((course: { 
        id: number; 
        fullname: string; 
        shortname: string; 
        summary?: string; 
        categoryid: number;
        visible: number;
        startdate: number;
        enddate: number;
        format: string;
        courseimage?: string;
      }) => ({
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
        // Add default pricing (will be set by admin later)
        price: 0,
        currency: 'VND',
        level: 'Beginner',
        instructor: 'Teacher Linh Nguyen', // From our Moodle site info
        rating: 4.8,
        students: Math.floor(Math.random() * 100) + 10, // Random for now
        duration: '8 tuần',
        thumbnail: course.courseimage || `/api/placeholder/400/300?text=${encodeURIComponent(course.shortname)}`,
      }));

    return NextResponse.json({
      success: true,
      courses: transformedCourses,
      total: transformedCourses.length,
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch courses',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}