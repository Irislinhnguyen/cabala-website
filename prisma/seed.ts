import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const categories = [
    {
      name: 'Công nghệ',
      slug: 'cong-nghe',
      description: 'Các khóa học về lập trình, phát triển web, mobile',
      icon: '💻',
      color: '#E55A2B',
    },
    {
      name: 'Kinh doanh',
      slug: 'kinh-doanh',
      description: 'Marketing, quản lý, khởi nghiệp',
      icon: '📈',
      color: '#5B9BD5',
    },
    {
      name: 'Thiết kế',
      slug: 'thiet-ke',
      description: 'UI/UX, Graphic Design, Thiết kế web',
      icon: '🎨',
      color: '#2C3E50',
    },
    {
      name: 'Ngôn ngữ',
      slug: 'ngon-ngu',
      description: 'Tiếng Anh, Tiếng Nhật, Tiếng Hàn',
      icon: '🗣️',
      color: '#A8D5E5',
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  // Create admin user with password
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  await prisma.user.upsert({
    where: { email: 'admin@cabala.edu.vn' },
    update: {},
    create: {
      email: 'admin@cabala.edu.vn',
      name: 'Admin Cabala',
      password: adminPassword,
      role: 'ADMIN',
      isActive: true,
    },
  });

  // Create test student user
  const studentPassword = await bcrypt.hash('Student123!', 10);
  await prisma.user.upsert({
    where: { email: 'test@cabala.edu.vn' },
    update: {},
    create: {
      email: 'test@cabala.edu.vn',
      name: 'Test Student',
      firstName: 'Test',
      lastName: 'Student',
      password: studentPassword,
      role: 'STUDENT',
      isActive: true,
    },
  });

  // Create system settings
  const settings = [
    { key: 'site_name', value: 'Cabala' },
    { key: 'site_description', value: 'Nền tảng học trực tuyến hàng đầu Việt Nam' },
    { key: 'contact_email', value: 'contact@cabala.edu.vn' },
    { key: 'support_email', value: 'support@cabala.edu.vn' },
    { key: 'bank_name', value: 'Vietcombank' },
    { key: 'bank_account_number', value: '0123456789' },
    { key: 'bank_account_name', value: 'CONG TY CABALA' },
    { key: 'currency', value: 'VND' },
    { key: 'timezone', value: 'Asia/Ho_Chi_Minh' },
    { key: 'language', value: 'vi' },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });