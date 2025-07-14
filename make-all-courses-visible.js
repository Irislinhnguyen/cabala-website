// Make all courses visible
const { PrismaClient } = require('@prisma/client');

async function makeAllCoursesVisible() {
  const prisma = new PrismaClient();
  
  try {
    console.log('👁️ Making all courses visible...');
    
    const result = await prisma.course.updateMany({
      where: { isVisible: false },
      data: { isVisible: true }
    });
    
    console.log(`✅ Updated ${result.count} courses to visible`);
    
    // Check new status
    const visibleCount = await prisma.course.count({ where: { isVisible: true } });
    const totalCount = await prisma.course.count();
    
    console.log(`Now showing ${visibleCount} out of ${totalCount} courses`);
    
  } catch (error) {
    console.error('❌ Failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

makeAllCoursesVisible();