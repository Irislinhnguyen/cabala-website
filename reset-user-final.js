// Final reset for testing
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function resetUserFinal() {
  try {
    console.log('🔧 Final user reset for testing...\n');
    
    const email = 'linhnt.ftu52@gmail.com';
    
    // Reset user completely
    await prisma.user.update({
      where: { email },
      data: {
        moodleUserId: null,
        moodleUsername: null,
        moodlePassword: null,
      }
    });
    
    // Remove enrollments
    await prisma.enrollment.deleteMany({
      where: { 
        user: { email }
      }
    });
    
    console.log('✅ User reset for testing');
    console.log('Next: Test enrollment to create new Cabala account');
    
  } catch (error) {
    console.error('❌ Reset failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetUserFinal();