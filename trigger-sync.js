// Trigger sync via API endpoint
async function triggerSync() {
  try {
    console.log('🔄 Triggering Moodle sync via API...');
    
    const response = await fetch('http://localhost:3000/api/moodle/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'sync-courses'
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Sync triggered successfully:');
      console.log(JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.error('❌ Sync failed:', response.status);
      console.error(errorText);
    }
    
    // Wait a moment then check results
    console.log('\n⏳ Waiting 5 seconds for sync to complete...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('\n📊 Checking results...');
    const coursesResponse = await fetch('http://localhost:3000/api/courses');
    if (coursesResponse.ok) {
      const coursesData = await coursesResponse.json();
      console.log(`Results:
        - Total courses: ${coursesData.total}
        - Local images: ${coursesData.localImagesCount}
        - Placeholders: ${coursesData.placeholderCount}
      `);
      
      const withImages = coursesData.courses.filter(c => c.hasLocalImage);
      if (withImages.length > 0) {
        console.log('\n🖼️ Courses with images:');
        withImages.forEach(course => {
          console.log(`  - ${course.title}: ${course.courseImage}`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Failed:', error.message);
  }
}

triggerSync();