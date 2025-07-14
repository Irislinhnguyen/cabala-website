// Apply database migration for local image storage
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function applyMigration() {
  try {
    console.log('📋 Applying database migration for local image storage...');
    
    // Read the migration SQL
    const migrationPath = path.join(__dirname, 'add-local-image-fields.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Split into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`Executing statement ${i + 1}: ${statement.substring(0, 50)}...`);
      
      try {
        await prisma.$executeRawUnsafe(statement);
        console.log(`✅ Statement ${i + 1} executed successfully`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`⏭️ Statement ${i + 1} skipped (column already exists)`);
        } else {
          throw error;
        }
      }
    }
    
    console.log('✅ Migration completed successfully');
    
    // Test the new fields
    console.log('\n🔍 Testing new fields...');
    const sampleCourse = await prisma.course.findFirst({
      select: {
        id: true,
        title: true,
        localImagePath: true,
        imageMimeType: true,
        imageLastModified: true,
        imageFileSize: true,
      }
    });
    
    if (sampleCourse) {
      console.log('Sample course with new fields:');
      console.log(JSON.stringify(sampleCourse, null, 2));
    } else {
      console.log('No courses found in database');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

applyMigration().then(() => {
  console.log('\n✅ Migration script completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Migration script failed:', error);
  process.exit(1);
});