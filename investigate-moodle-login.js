// Investigate Moodle Login Issues
const { PrismaClient } = require('@prisma/client');

async function investigateLogin() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Investigating Moodle Login Issues\n');
    
    // Get user data
    const user = await prisma.user.findUnique({
      where: { email: 'linhnt.ftu52@gmail.com' },
    });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('📊 CURRENT USER DATA:');
    console.log('   User ID:', user.id);
    console.log('   Email:', user.email);
    console.log('   Name:', user.name);
    console.log('   First Name:', user.firstName);
    console.log('   Last Name:', user.lastName);
    console.log('   Moodle User ID:', user.moodleUserId);
    console.log('   Moodle Username:', user.moodleUsername);
    console.log('   Stored Password Length:', user.moodlePassword?.length || 0);
    
    // Analyze username generation pattern
    const emailPrefix = user.email.split('@')[0]; // "linhnt.ftu52"
    const expectedPassword = `Moodle${emailPrefix}2024!`; // "Moodlelinhnt.ftu522024!"
    
    console.log('\n🔍 USERNAME ANALYSIS:');
    console.log('   Email Prefix:', emailPrefix);
    console.log('   Stored Username:', user.moodleUsername);
    console.log('   Expected Password:', expectedPassword);
    console.log('   Stored Password:', user.moodlePassword);
    console.log('   Passwords Match:', user.moodlePassword === expectedPassword ? '✅ YES' : '❌ NO');
    
    // Check username generation logic from enrollment code
    console.log('\n🧮 USERNAME GENERATION ANALYSIS:');
    console.log('   From enrollment code, username is generated as:');
    console.log('   `${user.email.split("@")[0]}_${timestamp}`.toLowerCase()');
    console.log('   But stored username is:', user.moodleUsername);
    console.log('   This suggests the username was manually set or generated differently.');
    
    // The critical issue identified
    if (user.moodleUsername === 'irislinhnguyen' && emailPrefix === 'linhnt.ftu52') {
      console.log('\n🚨 CRITICAL ISSUE IDENTIFIED:');
      console.log('   The stored username "irislinhnguyen" does NOT match the email pattern!');
      console.log('   Email prefix "linhnt.ftu52" should generate username like "linhnt.ftu52_[timestamp]"');
      console.log('   This suggests:');
      console.log('   1. Username was manually set instead of auto-generated');
      console.log('   2. There may be a mismatch between Moodle account and our database');
      console.log('   3. The Moodle account might exist under a different username');
    }
    
    console.log('\n💡 NEXT STEPS:');
    console.log('   1. Test if Moodle account exists with email lookup');
    console.log('   2. Check if username "irislinhnguyen" exists in Moodle');
    console.log('   3. Verify password format and test login');
    
  } catch (error) {
    console.error('❌ Investigation failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

investigateLogin();