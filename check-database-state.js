// Check current database state
const { PrismaClient } = require('@prisma/client');

async function checkDatabaseState() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Checking database state...');
    
    // Get course counts
    const courses = await prisma.course.findMany({
      select: {
        moodleCourseId: true,
        title: true,
        isVisible: true,
        localImagePath: true,
        moodleImageUrl: true,
      },
      orderBy: { moodleCourseId: 'asc' }
    });
    
    console.log(`\nFound ${courses.length} courses in database:`);
    
    let visibleCount = 0;
    let hiddenCount = 0;
    let withLocalImages = 0;
    let withMoodleUrls = 0;
    
    courses.forEach(course => {
      const visibility = course.isVisible ? 'VISIBLE' : 'HIDDEN';
      const localImg = course.localImagePath ? 'LOCAL' : '';
      const moodleImg = course.moodleImageUrl ? 'MOODLE' : '';
      const imgStatus = [localImg, moodleImg].filter(Boolean).join(',') || 'NONE';
      
      console.log(`  ${course.moodleCourseId}: ${course.title.substring(0, 40)}... [${visibility}] [${imgStatus}]`);
      
      if (course.isVisible) visibleCount++;
      else hiddenCount++;
      if (course.localImagePath) withLocalImages++;
      if (course.moodleImageUrl) withMoodleUrls++;
    });
    
    console.log(`\nSummary:
      - Total courses: ${courses.length}
      - Visible: ${visibleCount}
      - Hidden: ${hiddenCount}
      - With local images: ${withLocalImages}
      - With Moodle URLs: ${withMoodleUrls}
    `);
    
    const moodleIds = courses.map(c => c.moodleCourseId).sort((a, b) => a - b);
    console.log('\nMoodle IDs in database:', moodleIds.join(', '));
    
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseState();