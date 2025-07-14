// Add missing columns one by one with error handling
const { PrismaClient } = require('@prisma/client');

async function addMissingColumns() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔧 Adding missing database columns...');
    
    const columns = [
      { name: 'localImagePath', type: 'TEXT' },
      { name: 'imageMimeType', type: 'TEXT' }, 
      { name: 'imageLastModified', type: 'TIMESTAMP(3)' },
      { name: 'imageFileSize', type: 'INTEGER' }
    ];
    
    for (const column of columns) {
      try {
        console.log(`Adding column: ${column.name}`);
        await prisma.$executeRawUnsafe(`ALTER TABLE courses ADD COLUMN IF NOT EXISTS "${column.name}" ${column.type}`);
        console.log(`✅ Added ${column.name}`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`⏭️ Column ${column.name} already exists`);
        } else {
          console.error(`❌ Failed to add ${column.name}:`, error.message);
        }
      }
    }
    
    // Test the columns
    console.log('\n🧪 Testing new columns...');
    const testCourse = await prisma.course.findFirst({
      select: {
        id: true,
        title: true,
        localImagePath: true,
        imageMimeType: true,
        imageLastModified: true,
        imageFileSize: true,
      }
    });
    
    console.log('✅ All columns accessible');
    console.log('Sample course:', JSON.stringify(testCourse, null, 2));
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

addMissingColumns();