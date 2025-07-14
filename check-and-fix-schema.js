// Check what fields exist and add missing ones
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAndFixSchema() {
  try {
    console.log('🔍 Checking database schema and adding missing fields...');
    
    // Check what columns exist in the courses table
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'courses' 
      AND table_schema = 'public'
      ORDER BY column_name;
    `;
    
    console.log('\nExisting columns in courses table:');
    const existingColumns = result.map(row => row.column_name);
    existingColumns.forEach(col => console.log(`  - ${col}`));
    
    // Check which new fields are missing
    const requiredFields = {
      'localImagePath': 'TEXT',
      'imageMimeType': 'TEXT', 
      'imageLastModified': 'TIMESTAMP(3)',
      'imageFileSize': 'INTEGER'
    };
    
    console.log('\n🔧 Adding missing fields...');
    
    for (const [fieldName, dataType] of Object.entries(requiredFields)) {
      if (!existingColumns.includes(fieldName)) {
        console.log(`Adding missing field: ${fieldName}`);
        try {
          await prisma.$executeRawUnsafe(`ALTER TABLE courses ADD COLUMN "${fieldName}" ${dataType}`);
          console.log(`✅ Added ${fieldName}`);
        } catch (error) {
          console.error(`❌ Failed to add ${fieldName}:`, error.message);
        }
      } else {
        console.log(`⏭️ Field ${fieldName} already exists`);
      }
    }
    
    console.log('\n🧪 Testing field access...');
    
    // Test accessing the new fields
    try {
      const testQuery = await prisma.course.findFirst({
        select: {
          id: true,
          title: true,
          localImagePath: true,
          imageMimeType: true,
          imageLastModified: true,
          imageFileSize: true,
        }
      });
      
      console.log('✅ All new fields are accessible');
      if (testQuery) {
        console.log('Sample course:', JSON.stringify(testQuery, null, 2));
      }
      
    } catch (error) {
      console.error('❌ Error accessing new fields:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Schema check failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndFixSchema();