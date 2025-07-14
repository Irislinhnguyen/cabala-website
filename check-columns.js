// Check what columns actually exist in courses table
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkColumns() {
  try {
    // Use raw SQL to check table structure
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'courses' 
      ORDER BY ordinal_position;
    `;
    
    console.log('📋 Courses table columns:');
    result.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type}`);
    });
    
  } catch (error) {
    console.error('❌ Failed to check columns:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkColumns();