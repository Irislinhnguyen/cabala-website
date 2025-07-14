// Update database schema to add image fields
const { PrismaClient } = require('@prisma/client');

async function updateSchema() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔧 Updating database schema for Moodle images...');
    
    // Check current table structure first
    console.log('📋 Checking current courses table structure...');
    
    try {
      // Test if moodleImageUrl column exists
      const testResult = await prisma.$queryRaw`
        SELECT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'courses' 
          AND column_name = 'moodleImageUrl'
        ) as exists;
      `;
      
      const columnExists = testResult[0]?.exists;
      console.log(`   moodleImageUrl column exists: ${columnExists}`);
      
      if (!columnExists) {
        console.log('🔨 Adding missing image columns...');
        
        // Add columns one by one to avoid conflicts
        await prisma.$executeRaw`
          ALTER TABLE courses 
          ADD COLUMN IF NOT EXISTS "moodleImageUrl" TEXT;
        `;
        
        await prisma.$executeRaw`
          ALTER TABLE courses 
          ADD COLUMN IF NOT EXISTS "overviewFiles" JSONB;
        `;
        
        await prisma.$executeRaw`
          ALTER TABLE courses 
          ADD COLUMN IF NOT EXISTS "moodleTags" TEXT[] DEFAULT '{}';
        `;
        
        await prisma.$executeRaw`
          ALTER TABLE courses 
          ADD COLUMN IF NOT EXISTS "customTags" TEXT[] DEFAULT '{}';
        `;
        
        console.log('✅ Image columns added successfully!');
      } else {
        console.log('✅ Image columns already exist');
      }
      
    } catch (error) {
      console.log('⚠️  Column check failed, but continuing...');
    }
    
    // Test the updated structure
    console.log('🧪 Testing updated structure...');
    const sampleCourse = await prisma.course.findFirst({
      select: {
        id: true,
        title: true,
        moodleCourseId: true,
        thumbnail: true
      }
    });
    
    if (sampleCourse) {
      console.log('✅ Database structure test passed');
      console.log(`   Sample course: ${sampleCourse.title}`);
    }
    
  } catch (error) {
    console.error('❌ Schema update failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateSchema();