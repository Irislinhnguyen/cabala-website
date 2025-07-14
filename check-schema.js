// Check what fields actually exist in the database
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkSchema() {
  try {
    console.log('🔍 Checking database schema...');
    
    // Try to describe a course with all possible fields
    const course = await prisma.course.findFirst({
      select: {
        id: true,
        title: true,
        thumbnail: true,
        description: true,
        // Try to see if moodleImageUrl exists
      }
    });
    
    console.log('Sample course data:', course);
    
  } catch (error) {
    console.error('Schema check failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkSchema();