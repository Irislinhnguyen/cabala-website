import { NextResponse } from 'next/server';
import { createMoodleClient } from '@/lib/moodle/client';

export async function GET() {
  try {
    const moodleClient = createMoodleClient();
    let courses;
    let usingImages = false;

    // Try to fetch courses with images first, fallback to basic course fetching
    try {
      console.log('🔍 Attempting to fetch courses with images...');
      courses = await moodleClient.getAllCoursesWithImages();
      usingImages = true;
      console.log('✅ Successfully fetched courses with image support');
    } catch (imageError) {
      console.warn('⚠️ Image-enabled course fetching failed, falling back to basic method:', imageError);
      try {
        courses = await moodleClient.getAllCourses();
        usingImages = false;
        console.log('✅ Successfully fetched courses using basic method');
      } catch (basicError) {
        console.error('❌ Both image and basic course fetching failed:', basicError);
        throw basicError;
      }
    }

    // Filter out the site course and transform data
    const transformedCourses = courses
      .filter((course) => course.id !== 1) // Remove site course
      .map((course) => {
        let courseImage = null;
        let overviewFiles = null;

        // Process course images only if we successfully fetched them
        if (usingImages && course.overviewfiles) {
          const imageData = moodleClient.processOverviewFiles(course.overviewfiles);
          courseImage = imageData.primaryImage;
          overviewFiles = imageData.metadata;
        }
        
        return {
          id: course.id,
          title: course.fullname,
          shortName: course.shortname,
          description: course.summary || 'Mô tả khóa học sẽ được cập nhật sớm',
          category: course.categoryid,
          visible: course.visible === 1,
          startDate: course.startdate,
          endDate: course.enddate,
          format: course.format,
          // Use Moodle image if available, otherwise fallback to basic courseimage or placeholder
          courseImage: courseImage || course.courseimage || null,
          overviewFiles: overviewFiles,
          // Add default pricing (will be set by admin later)
          price: 0,
          currency: 'VND',
          level: 'Beginner',
          instructor: 'Teacher Linh Nguyen',
          rating: 4.8,
          students: Math.floor(Math.random() * 100) + 10, // Random for now
          duration: '8 tuần',
          language: course.lang || 'vi',
          // Use best available image with fallback to placeholder
          thumbnail: courseImage || course.courseimage || `/api/placeholder/400/300?text=${encodeURIComponent(course.shortname)}`,
        };
      });

    return NextResponse.json({
      success: true,
      courses: transformedCourses,
      total: transformedCourses.length,
      imageSupport: usingImages, // Indicate whether images are working
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