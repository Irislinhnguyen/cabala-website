// Check current user status
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUserStatus() {
  try {
    console.log('🔍 Checking user status...\n');
    
    const email = 'linhnt.ftu52@gmail.com';
    
    // Check user in database
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        moodleUserId: true,
        moodleUsername: true,
        moodlePassword: true,
      }
    });
    
    console.log('Database User:', user);
    
    // Check enrollments
    const enrollments = await prisma.enrollment.findMany({
      where: { 
        user: { email }
      },
      include: {
        course: {
          select: {
            id: true,
            moodleCourseId: true,
            title: true
          }
        }
      }
    });
    
    console.log('\nUser Enrollments:', enrollments);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserStatus();