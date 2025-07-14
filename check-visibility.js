// Check course visibility settings
const { PrismaClient } = require('@prisma/client');

async function checkVisibility() {
  const prisma = new PrismaClient();
  
  try {
    console.log('👁️  Checking course visibility...');
    
    // Check all courses with their visibility status
    const allCourses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        moodleCourseId: true,
        isVisible: true,
        moodleImageUrl: true
      },
      orderBy: {
        moodleCourseId: 'asc'
      }
    });
    
    console.log(`\\n📚 All ${allCourses.length} courses in database:`);
    
    let visibleCount = 0;
    let invisibleCount = 0;
    let realImageCount = 0;
    
    allCourses.forEach((course, index) => {
      const status = course.isVisible ? '✅ VISIBLE' : '❌ HIDDEN';
      const hasImage = course.moodleImageUrl ? '🖼️  HAS IMAGE' : '📋 NO IMAGE';
      
      console.log(`${index + 1}. ${course.title}`);
      console.log(`   Status: ${status}`);
      console.log(`   Image: ${hasImage}`);
      console.log(`   Moodle ID: ${course.moodleCourseId}`);
      console.log('');
      
      if (course.isVisible) visibleCount++;
      else invisibleCount++;
      
      if (course.moodleImageUrl) realImageCount++;
    });
    
    console.log('📊 Summary:');
    console.log(`   Visible courses: ${visibleCount}`);
    console.log(`   Hidden courses: ${invisibleCount}`);
    console.log(`   Courses with real images: ${realImageCount}`);
    
    // Check if any courses with real images are hidden
    const hiddenWithImages = allCourses.filter(c => !c.isVisible && c.moodleImageUrl);
    if (hiddenWithImages.length > 0) {
      console.log(`\\n⚠️  Found ${hiddenWithImages.length} courses with real images that are HIDDEN:`);
      hiddenWithImages.forEach(course => {
        console.log(`   - ${course.title}`);
      });
      
      console.log('\\n🔧 Making courses with real images visible...');
      for (const course of hiddenWithImages) {
        await prisma.course.update({
          where: { id: course.id },
          data: { isVisible: true }
        });
        console.log(`   ✅ Made "${course.title}" visible`);
      }
    }
    
  } catch (error) {
    console.error('❌ Check failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkVisibility();