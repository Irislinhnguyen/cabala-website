// Reset user password for testing
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function resetPassword() {
  try {
    console.log('🔧 Resetting password for testing...\n');
    
    const email = 'linhnt.ftu52@gmail.com';
    const newPassword = '123456';
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Update user password
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });
    
    console.log('✅ Password reset to:', newPassword);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetPassword();