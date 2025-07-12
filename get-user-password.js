// Get user password for testing
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function getUserInfo() {
  try {
    console.log('🔍 Getting user info...\n');
    
    const email = 'linhnt.ftu52@gmail.com';
    
    // Check user password
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
      }
    });
    
    if (user) {
      console.log('User found:', user.email);
      console.log('Password hash:', user.password);
      
      // Test common passwords
      const testPasswords = ['123456', 'password', 'admin', 'linh123'];
      
      for (const testPwd of testPasswords) {
        const isMatch = await bcrypt.compare(testPwd, user.password);
        console.log(`Testing '${testPwd}': ${isMatch ? '✅ MATCH' : '❌ No match'}`);
        if (isMatch) break;
      }
    } else {
      console.log('User not found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getUserInfo();