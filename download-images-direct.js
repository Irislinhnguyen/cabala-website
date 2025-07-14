// Direct image download script
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Environment variables - manually get from .env file

// Read .env file
let MOODLE_URL = 'https://learn.cabala.com.vn';
let MOODLE_TOKEN = null;

// Read from both .env and .env.local files
const envFiles = ['.env', '.env.local'];

envFiles.forEach(filename => {
  try {
    const envPath = path.join(process.cwd(), filename);
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    envContent.split('\n').forEach(line => {
      if (line.includes('MOODLE_URL=')) {
        MOODLE_URL = line.split('=')[1].trim().replace(/['"]/g, '');
      }
      if (line.includes('MOODLE_TOKEN=')) {
        MOODLE_TOKEN = line.split('=')[1].trim().replace(/['"]/g, '');
      }
    });
  } catch (error) {
    // File doesn't exist, continue
  }
});

async function downloadImage(imageUrl, courseId, filename) {
  try {
    console.log(`📥 Downloading: ${filename} for course ${courseId}`);
    
    // Add token to URL if available
    let fetchUrl = imageUrl;
    if (MOODLE_TOKEN && !imageUrl.includes('token=')) {
      fetchUrl = imageUrl.includes('?') 
        ? `${imageUrl}&token=${MOODLE_TOKEN}` 
        : `${imageUrl}?token=${MOODLE_TOKEN}`;
    }
    
    // Fetch the image
    const response = await fetch(fetchUrl, {
      headers: {
        'User-Agent': 'Cabala-Website/1.0',
        'Accept': 'image/*,*/*;q=0.8',
      },
    });
    
    if (!response.ok) {
      console.log(`❌ Failed to download: ${response.status} ${response.statusText}`);
      return null;
    }
    
    // Get image data
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    // Generate safe filename
    const ext = getFileExtension(filename, contentType);
    const safeFilename = `course-${courseId}-${Date.now()}${ext}`;
    const relativePath = `course-images/${safeFilename}`;
    const fullPath = path.join(process.cwd(), 'public', relativePath);
    
    // Ensure directory exists
    await fs.promises.mkdir(path.dirname(fullPath), { recursive: true });
    
    // Save the file
    await fs.promises.writeFile(fullPath, Buffer.from(imageBuffer));
    
    console.log(`✅ Saved: ${relativePath} (${imageBuffer.byteLength} bytes)`);
    
    return {
      localPath: `/${relativePath}`,
      mimeType: contentType,
      fileSize: imageBuffer.byteLength,
    };
    
  } catch (error) {
    console.error(`❌ Error downloading image for course ${courseId}:`, error.message);
    return null;
  }
}

function getFileExtension(filename, contentType) {
  const fileExt = path.extname(filename).toLowerCase();
  if (fileExt) return fileExt;
  
  switch (contentType.toLowerCase()) {
    case 'image/jpeg':
    case 'image/jpg':
      return '.jpg';
    case 'image/png':
      return '.png';
    case 'image/gif':
      return '.gif';
    case 'image/webp':
      return '.webp';
    default:
      return '.jpg';
  }
}

async function downloadAllImages() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🚀 Starting direct image download...');
    
    if (!MOODLE_TOKEN) {
      console.error('❌ MOODLE_TOKEN not found in environment variables');
      return;
    }
    
    // Get courses with Moodle image URLs
    const coursesWithImages = await prisma.course.findMany({
      where: { 
        moodleImageUrl: { not: null },
        localImagePath: null  // Only download if not already downloaded
      },
      select: {
        id: true,
        moodleCourseId: true,
        title: true,
        moodleImageUrl: true,
      }
    });
    
    console.log(`Found ${coursesWithImages.length} courses with Moodle images to download`);
    
    if (coursesWithImages.length === 0) {
      console.log('No courses need image downloads');
      return;
    }
    
    for (const course of coursesWithImages) {
      console.log(`\n📋 Processing: ${course.title}`);
      console.log(`   Moodle URL: ${course.moodleImageUrl}`);
      
      // Extract filename from URL
      const url = new URL(course.moodleImageUrl);
      const pathParts = url.pathname.split('/');
      const filename = pathParts[pathParts.length - 1] || `course-${course.moodleCourseId}.jpg`;
      
      // Download the image
      const imageData = await downloadImage(course.moodleImageUrl, course.moodleCourseId, filename);
      
      if (imageData) {
        // Update database with local image path
        try {
          await prisma.course.update({
            where: { id: course.id },
            data: {
              localImagePath: imageData.localPath,
              imageMimeType: imageData.mimeType,
              imageFileSize: imageData.fileSize,
              imageLastModified: new Date(),
            }
          });
          
          console.log(`✅ Updated database for course ${course.moodleCourseId}`);
        } catch (dbError) {
          console.error(`❌ Database update failed for course ${course.moodleCourseId}:`, dbError.message);
        }
      }
      
      // Small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Check results
    const updatedCount = await prisma.course.count({
      where: { localImagePath: { not: null } }
    });
    
    console.log(`\n🎉 Download complete! ${updatedCount} courses now have local images`);
    
    // List downloaded images
    const imageDir = path.join(process.cwd(), 'public', 'course-images');
    try {
      const files = fs.readdirSync(imageDir);
      console.log(`\n📁 Files in ${imageDir}:`);
      files.forEach(file => console.log(`   - ${file}`));
    } catch (error) {
      console.log('No files found in course-images directory');
    }
    
  } catch (error) {
    console.error('❌ Download process failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

downloadAllImages().then(() => {
  console.log('\n✅ Image download process completed');
}).catch(error => {
  console.error('❌ Process failed:', error);
});