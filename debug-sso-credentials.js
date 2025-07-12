// Debug SSO Credentials Investigation
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugSSO() {
  try {
    console.log('🔍 SSO Credentials Debug Analysis\n');
    
    // Get the exact user data
    const user = await prisma.user.findUnique({
      where: { email: 'linhnt.ftu52@gmail.com' },
      select: {
        id: true,
        email: true,
        name: true,
        moodleUserId: true,
        moodleUsername: true,
        moodlePassword: true,
      },
    });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('📊 CURRENT USER DATA:');
    console.log('   Email:', user.email);
    console.log('   Name:', user.name);
    console.log('   Moodle User ID:', user.moodleUserId);
    console.log('   Moodle Username:', user.moodleUsername);
    console.log('   Stored Password:', user.moodlePassword);
    console.log('   Password Length:', user.moodlePassword?.length || 0);
    
    // Generate the expected password using our formula
    const emailPrefix = user.email.split('@')[0]; // Should be "linhnt.ftu52"
    const expectedPassword = `Moodle${emailPrefix}2024!`;
    
    console.log('\n🧮 PASSWORD ANALYSIS:');
    console.log('   Email Prefix:', emailPrefix);
    console.log('   Expected Password:', expectedPassword);
    console.log('   Expected Length:', expectedPassword.length);
    console.log('   Stored Password:', user.moodlePassword);
    console.log('   Passwords Match:', user.moodlePassword === expectedPassword ? '✅ YES' : '❌ NO');
    
    if (user.moodlePassword !== expectedPassword) {
      console.log('\n🚨 PASSWORD MISMATCH DETECTED!');
      console.log('   This explains why SSO login fails.');
      console.log('   Stored:  "' + user.moodlePassword + '"');
      console.log('   Expected:"' + expectedPassword + '"');
      
      // Character-by-character comparison
      const stored = user.moodlePassword || '';
      const expected = expectedPassword;
      console.log('\n🔬 CHARACTER COMPARISON:');
      for (let i = 0; i < Math.max(stored.length, expected.length); i++) {
        const s = stored[i] || '(missing)';
        const e = expected[i] || '(missing)';
        const match = s === e ? '✅' : '❌';
        console.log(`   Position ${i}: stored="${s}" expected="${e}" ${match}`);
      }
    } else {
      console.log('\n✅ Password matches expected pattern!');
      console.log('   The issue may be elsewhere (Moodle account, form submission, etc.)');
    }
    
    // Check if this follows the pattern used in enrollment
    console.log('\n📝 ENROLLMENT CODE ANALYSIS:');
    console.log('   The enrollment code uses this pattern:');
    console.log('   const moodlePassword = `Moodle${user.email.split("@")[0]}2024!`;');
    console.log('   For this user that would generate:', `Moodle${user.email.split('@')[0]}2024!`);
    
    console.log('\n💡 RECOMMENDATIONS:');
    if (user.moodlePassword !== expectedPassword) {
      console.log('   1. Update stored password to match the expected pattern');
      console.log('   2. Ensure Moodle account password is also updated');
      console.log('   3. Test SSO login after synchronization');
    } else {
      console.log('   1. Verify Moodle account exists and is active');
      console.log('   2. Test manual login to Moodle with these credentials');
      console.log('   3. Check form submission format and field names');
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

debugSSO();