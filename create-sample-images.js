// Create sample images for courses
const fs = require('fs');
const path = require('path');

async function createSampleImage(courseId, courseName) {
  try {
    // Create a simple SVG image as a sample
    const svgContent = `
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad${courseId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#E55A2B;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2C3E50;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#grad${courseId})" />
  <text x="200" y="150" font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
        text-anchor="middle" fill="white" dominant-baseline="middle">
    ${courseName}
  </text>
  <text x="200" y="180" font-family="Arial, sans-serif" font-size="14" 
        text-anchor="middle" fill="white" dominant-baseline="middle" opacity="0.8">
    Course ID: ${courseId}
  </text>
</svg>`;

    const filename = `course-${courseId}-sample.svg`;
    const relativePath = `course-images/${filename}`;
    const fullPath = path.join(process.cwd(), 'public', relativePath);
    
    // Ensure directory exists
    await fs.promises.mkdir(path.dirname(fullPath), { recursive: true });
    
    // Save SVG file
    await fs.promises.writeFile(fullPath, svgContent);
    
    console.log(`✅ Created: ${relativePath}`);
    
    return {
      localPath: `/${relativePath}`,
      mimeType: 'image/svg+xml',
      fileSize: svgContent.length,
    };
    
  } catch (error) {
    console.error(`❌ Error creating image for course ${courseId}:`, error.message);
    return null;
  }
}

async function createAllSampleImages() {
  console.log('🎨 Creating sample course images...');
  
  // The 9 courses that need images (based on our database analysis)
  const coursesNeedingImages = [
    { id: 5, name: 'Meta Model Level 1 + Level 2' },
    { id: 9, name: 'Meta Model Level 2' },
    { id: 10, name: 'Meta Model Foundation' },
    { id: 11, name: 'Sống lớn' },
    { id: 12, name: 'Thí nghiệm trù phú' },
    { id: 13, name: 'Unstop Yourself' },
    { id: 14, name: '7 ngày làm bạn với tâm trí' },
    { id: 17, name: 'Tư duy phản biện' },
    { id: 18, name: 'Chemistry Session' },
  ];
  
  const createdImages = [];
  
  for (const course of coursesNeedingImages) {
    const imageData = await createSampleImage(course.id, course.name);
    if (imageData) {
      createdImages.push({
        courseId: course.id,
        ...imageData
      });
    }
  }
  
  console.log(`\n🎉 Created ${createdImages.length} sample images`);
  
  // Generate SQL update statements
  console.log('\n📋 SQL update statements to run:');
  console.log('-- Copy and paste these into your database console --\n');
  
  createdImages.forEach(img => {
    const sql = `UPDATE courses SET 
      "localImagePath" = '${img.localPath}',
      "imageMimeType" = '${img.mimeType}',
      "imageFileSize" = ${img.fileSize},
      "imageLastModified" = NOW()
    WHERE "moodleCourseId" = ${img.courseId};`;
    
    console.log(sql);
  });
  
  console.log('\n-- End of SQL statements --');
  
  return createdImages;
}

createAllSampleImages().then((images) => {
  console.log(`\n✅ Process completed! Created ${images.length} sample images`);
  console.log('\nNext steps:');
  console.log('1. Run the SQL statements shown above in your database');
  console.log('2. Restart your development server');  
  console.log('3. Check the courses page - images should now display!');
}).catch(error => {
  console.error('❌ Process failed:', error);
});