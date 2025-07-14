// Fix image URLs to use our proxy service
const { PrismaClient } = require('@prisma/client');

async function fixImageUrls() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔧 Fixing Moodle image URLs to use proxy service...');
    
    // Get all courses with real Moodle images
    const coursesWithImages = await prisma.course.findMany({
      where: {
        moodleImageUrl: {
          not: null,
          contains: 'learn.cabala.com.vn'
        }
      },
      select: {
        id: true,
        title: true,
        moodleImageUrl: true,
        overviewFiles: true
      }
    });
    
    console.log(`\n📊 Found ${coursesWithImages.length} courses with Moodle images to fix:`);
    
    let fixedCount = 0;
    
    for (const course of coursesWithImages) {
      console.log(`\n🔨 Fixing: ${course.title}`);
      console.log(`   Original URL: ${course.moodleImageUrl}`);
      
      try {
        // Parse the Moodle URL to extract components
        const url = new URL(course.moodleImageUrl);
        const pathParts = url.pathname.split('/');
        
        // Extract course ID and filename from the path
        // Path format: /webservice/pluginfile.php/{courseId}/course/overviewfiles/{filename}
        const courseIdIndex = pathParts.indexOf('pluginfile.php') + 1;
        const courseId = pathParts[courseIdIndex];
        const filename = pathParts.slice(courseIdIndex + 3).join('/'); // Skip course/overviewfiles
        
        if (!courseId || !filename) {
          console.log('   ⚠️  Could not parse URL components');
          continue;
        }
        
        // Create the proxy URL
        const proxyUrl = `/api/moodle/image/${courseId}/${filename}`;
        console.log(`   New proxy URL: ${proxyUrl}`);
        
        // Update the database
        await prisma.course.update({
          where: { id: course.id },
          data: {
            moodleImageUrl: proxyUrl,
            thumbnail: proxyUrl // Also update thumbnail to use proxy
          }
        });
        
        console.log('   ✅ Updated successfully');
        fixedCount++;
        
      } catch (error) {
        console.log(`   ❌ Failed to fix URL: ${error.message}`);
      }
    }
    
    console.log(`\n🎉 Fixed ${fixedCount} out of ${coursesWithImages.length} course image URLs`);
    console.log('✅ All courses now use the proxy service for images');
    
  } catch (error) {
    console.error('❌ Fix failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixImageUrls();