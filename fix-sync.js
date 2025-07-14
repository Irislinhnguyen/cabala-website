// Fix sync issues and test real image fetching
const { PrismaClient } = require('@prisma/client');

async function fixSyncIssues() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔧 Investigating sync issues...');
    
    // Check current courses
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        moodleCourseId: true,
        moodleImageUrl: true,
        thumbnail: true
      }
    });
    
    console.log(`\\n📚 Found ${courses.length} courses in database:`);
    courses.forEach((course, index) => {
      console.log(`${index + 1}. ${course.title}`);
      console.log(`   Slug: ${course.slug}`);
      console.log(`   Moodle ID: ${course.moodleCourseId}`);
      console.log(`   Moodle Image: ${course.moodleImageUrl || 'None'}`);
      console.log(`   Thumbnail: ${course.thumbnail ? 'YES' : 'None'}`);
      console.log('');
    });
    
    // Check for duplicate slugs
    const slugCounts = {};
    courses.forEach(course => {
      slugCounts[course.slug] = (slugCounts[course.slug] || 0) + 1;
    });
    
    const duplicateSlugs = Object.entries(slugCounts)
      .filter(([slug, count]) => count > 1)
      .map(([slug]) => slug);
    
    if (duplicateSlugs.length > 0) {
      console.log('⚠️  Found duplicate slugs:', duplicateSlugs);
      
      // Fix duplicate slugs
      for (const duplicateSlug of duplicateSlugs) {
        const duplicateCourses = courses.filter(c => c.slug === duplicateSlug);
        console.log(`\\n🔨 Fixing duplicate slug "${duplicateSlug}":`);
        
        for (let i = 1; i < duplicateCourses.length; i++) {
          const course = duplicateCourses[i];
          const newSlug = `${duplicateSlug}-${i}`;
          console.log(`   Updating "${course.title}" slug to "${newSlug}"`);
          
          await prisma.course.update({
            where: { id: course.id },
            data: { slug: newSlug }
          });
        }
      }
      console.log('✅ Duplicate slugs fixed');
    } else {
      console.log('✅ No duplicate slugs found');
    }
    
  } catch (error) {
    console.error('❌ Fix failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixSyncIssues();