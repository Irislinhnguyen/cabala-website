// Test enrollment process directly
const { PrismaClient } = require('@prisma/client');
const { createMoodleClient } = require('./src/lib/moodle/client.js');
const { generateCabalaUsername } = require('./src/lib/jwt.js');

const prisma = new PrismaClient();

async function testEnrollment() {
  try {
    console.log('🧪 Testing enrollment process...\n');
    
    const email = 'linhnt.ftu52@gmail.com';
    const courseId = 2;
    
    // Get user
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:', {
      email: user.email,
      moodleUserId: user.moodleUserId,
      moodleUsername: user.moodleUsername,
    });
    
    // Get course
    let course = await prisma.course.findUnique({
      where: { moodleCourseId: courseId },
    });
    
    console.log('✅ Course found:', course?.title || 'Not found in DB');
    
    // Test Moodle client
    const moodleClient = createMoodleClient();
    const connectionOk = await moodleClient.testConnection();
    console.log('✅ Moodle connection:', connectionOk ? 'OK' : 'Failed');
    
    if (!user.moodleUserId) {
      console.log('\\n🆕 Creating new Cabala Moodle account...');
      
      // Generate Cabala username and unique email
      const username = generateCabalaUsername(user.email);
      const moodlePassword = `Moodle${user.email.split('@')[0]}2024!`;
      const websiteEmail = `${user.email.split('@')[0]}_website@cabala.com.vn`;
      
      console.log('Account details:', {
        username,
        email: websiteEmail,
        originalEmail: user.email,
      });
      
      try {
        const moodleUser = await moodleClient.createUser({
          username,
          email: websiteEmail,
          firstname: user.firstName || 'User',
          lastname: user.lastName || 'Student',
          password: moodlePassword,
        });
        
        console.log('✅ Moodle user created:', {
          id: moodleUser.id,
          username: moodleUser.username,
          email: moodleUser.email,
        });
        
        // Update database
        await prisma.user.update({
          where: { id: user.id },
          data: { 
            moodleUserId: moodleUser.id,
            moodleUsername: moodleUser.username,
            moodlePassword: moodlePassword,
          },
        });
        
        console.log('✅ Database updated with Moodle credentials');
        
      } catch (error) {
        console.error('❌ Error creating Moodle user:', error.message);
        return;
      }
    } else {
      console.log('✅ User already has Moodle account');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testEnrollment();