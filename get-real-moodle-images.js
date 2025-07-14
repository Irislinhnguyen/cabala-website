// Get real Moodle course images via API
const fetch = require('node-fetch');

async function getRealMoodleImages() {
  try {
    console.log('🔍 Testing real Moodle image fetching...');
    
    // Test the courses API to see current state
    console.log('1. Current courses from API:');
    const response = await fetch('http://localhost:3000/api/courses');
    const data = await response.json();
    
    if (data.success) {
      console.log(`   Found ${data.courses.length} courses`);
      console.log(`   Source: ${data.source}`);
      console.log(`   Image support: ${data.imageSupport}`);
      
      // Show image status for each course
      data.courses.forEach((course, index) => {
        console.log(`\\n   ${index + 1}. ${course.title}`);
        console.log(`      Course Image: ${course.courseImage ? 'YES' : 'NO'}`);
        console.log(`      Thumbnail: ${course.thumbnail ? 'YES' : 'NO'}`);
        if (course.thumbnail) {
          console.log(`      Thumbnail URL: ${course.thumbnail.substring(0, 80)}...`);
        }
      });
      
      // Test Moodle sync API
      console.log('\\n2. Testing Moodle sync...');
      try {
        const syncResponse = await fetch('http://localhost:3000/api/moodle/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer admin_token'
          },
          body: JSON.stringify({ action: 'sync-courses' })
        });
        
        const syncResult = await syncResponse.json();
        console.log('   Sync result:', syncResult);
        
      } catch (syncError) {
        console.log('   ⚠️ Sync not available:', syncError.message);
      }
      
    } else {
      console.log('   ❌ API failed:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Failed to get Moodle images:', error.message);
  }
}

getRealMoodleImages();