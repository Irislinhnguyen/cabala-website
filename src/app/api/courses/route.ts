import { NextResponse } from 'next/server';
import { createMoodleClient } from '@/lib/moodle/client';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔍 Fetching courses from database...');
    
    // First try to get courses from database
    const dbCourses = await prisma.course.findMany({
      where: { isVisible: true },
      select: {
        id: true,
        moodleCourseId: true,
        title: true,
        slug: true,
        description: true,
        thumbnail: true,
        moodleImageUrl: true, // Add real Moodle image field
        overviewFiles: true, // Add overview files metadata
        // Local image storage fields
        localImagePath: true,
        imageMimeType: true,
        imageLastModified: true,
        imageFileSize: true,
        price: true,
        currency: true,
        level: true,
        instructorName: true,
        averageRating: true,
        enrollmentCount: true,
        language: true,
        isVisible: true,
        category: {
          select: {
            name: true
          }
        }
      }
    });
    
    console.log(`Found ${dbCourses.length} courses in database`);
    
    // If we have courses in database, use them
    if (dbCourses.length > 0) {
      console.log('✅ Using database courses');
      
      const transformedCourses = dbCourses.map((course) => {
        // Image priority: custom > local > moodle > placeholder
        let courseImage = null;
        let imageSource = 'placeholder';
        
        if (course.localImagePath) {
          // Use locally stored image from sync
          courseImage = course.localImagePath;
          imageSource = 'local';
        } else if (course.moodleImageUrl) {
          // Use moodle image URL (lowest priority)
          courseImage = course.moodleImageUrl;
          imageSource = 'moodle';
        }
        // No proxy fallback - if no image, show placeholder
        
        const thumbnailImage = courseImage || `/api/placeholder/400/300?text=${encodeURIComponent(course.title)}`;
        
        return {
          id: course.moodleCourseId || course.id,
          title: course.title,
          shortName: course.slug,
          description: course.description || 'Mô tả khóa học sẽ được cập nhật sớm',
          category: course.category?.name || 'General',
          visible: course.isVisible,
          // Use prioritized image
          courseImage: courseImage,
          price: Number(course.price),
          currency: course.currency,
          level: course.level,
          instructor: course.instructorName || 'Teacher Linh Nguyen',
          rating: course.averageRating || 4.8,
          students: course.enrollmentCount || 10,
          duration: '8 tuần',
          language: course.language,
          thumbnail: thumbnailImage,
          // Add metadata about image source
          hasRealImage: imageSource !== 'placeholder',
          hasLocalImage: imageSource === 'local',
          imageSource: imageSource,
          overviewFiles: course.overviewFiles,
        };
      });
      
      const coursesWithLocalImages = transformedCourses.filter(c => c.hasLocalImage).length;
      const coursesWithRealImages = transformedCourses.filter(c => c.hasRealImage).length;
      const placeholderCount = transformedCourses.length - coursesWithRealImages;
      
      return NextResponse.json({
        success: true,
        courses: transformedCourses,
        total: transformedCourses.length,
        source: 'database',
        imageSupport: true,
        localImagesCount: coursesWithLocalImages,
        realImagesCount: coursesWithRealImages,
        placeholderCount: placeholderCount,
      });
    }
    
    // Fallback to Moodle if no database courses
    console.log('📡 No database courses found, fetching from Moodle...');
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
        const courseImage = null;
        let overviewFiles = null;

        // Store overview files for future sync but don't use images yet
        if (usingImages && course.overviewfiles) {
          const imageData = moodleClient.processOverviewFiles(course.overviewfiles);
          overviewFiles = imageData.metadata;
          // Don't set courseImage - only local images will be used
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
          // No images from Moodle fallback - only local images will be used
          courseImage,
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
          // Use placeholder for Moodle fallback until images are synced
          thumbnail: `/api/placeholder/400/300?text=${encodeURIComponent(course.shortname)}`,
        };
      });

    return NextResponse.json({
      success: true,
      courses: transformedCourses,
      total: transformedCourses.length,
      source: 'moodle',
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