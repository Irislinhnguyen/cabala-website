// Check current database state
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Checking current database state...');
    
    // Check courses
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        moodleCourseId: true,
        thumbnail: true,
        isVisible: true
      }
    });
    
    console.log(`\n📚 Found ${courses.length} courses in database:`);
    
    courses.forEach((course, index) => {
      console.log(`\n${index + 1}. ${course.title}`);
      console.log(`   Moodle ID: ${course.moodleCourseId}`);
      console.log(`   Thumbnail: ${course.thumbnail ? 'YES' : 'NO'}`);
      console.log(`   Visible: ${course.isVisible}`);
      
      if (course.thumbnail) {
        console.log(`   Image: ${course.thumbnail.substring(0, 80)}...`);
      }
    });
    
    // Check categories
    const categories = await prisma.category.findMany();
    console.log(`\n📁 Found ${categories.length} categories:`);
    categories.forEach(cat => {
      console.log(`   - ${cat.name} (${cat.slug})`);
    });
    
  } catch (error) {
    console.error('❌ Database check failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();