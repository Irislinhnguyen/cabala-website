// Test Moodle Login Form Requirements
const fetch = require('node-fetch');

async function testMoodleLogin() {
  try {
    console.log('🔍 Testing Moodle Login Form Requirements\n');
    
    const moodleUrl = 'https://learn.cabala.com.vn';
    
    // First, get the login page to see what fields are required
    console.log('1. Fetching Moodle login page...');
    const loginPageResponse = await fetch(`${moodleUrl}/login/index.php`);
    const loginPageHtml = await loginPageResponse.text();
    
    // Look for form fields
    console.log('2. Analyzing login form fields...');
    
    // Extract form action
    const actionMatch = loginPageHtml.match(/<form[^>]*action="([^"]*)"[^>]*>/i);
    console.log('   Form Action:', actionMatch ? actionMatch[1] : 'Not found');
    
    // Look for hidden fields (like CSRF tokens)
    const hiddenFields = [];
    const hiddenRegex = /<input[^>]*type=["\']hidden["\'][^>]*>/gi;
    let match;
    while ((match = hiddenRegex.exec(loginPageHtml)) !== null) {
      const nameMatch = match[0].match(/name=["\']([^"\']*)["\']/) || [];
      const valueMatch = match[0].match(/value=["\']([^"\']*)["\']/) || [];
      if (nameMatch[1]) {
        hiddenFields.push({
          name: nameMatch[1],
          value: valueMatch[1] || ''
        });
      }
    }
    
    console.log('   Hidden Fields Found:');
    hiddenFields.forEach(field => {
      console.log(`     ${field.name}: "${field.value}"`);
    });
    
    // Look for username/password field names
    const usernameFieldMatch = loginPageHtml.match(/<input[^>]*name=["\']([^"\']*username[^"\']*)["\'][^>]*>/i) ||
                              loginPageHtml.match(/<input[^>]*name=["\']([^"\']*user[^"\']*)["\'][^>]*>/i);
    const passwordFieldMatch = loginPageHtml.match(/<input[^>]*name=["\']([^"\']*password[^"\']*)["\'][^>]*>/i) ||
                              loginPageHtml.match(/<input[^>]*name=["\']([^"\']*pass[^"\']*)["\'][^>]*>/i);
    
    console.log('   Username Field:', usernameFieldMatch ? usernameFieldMatch[1] : 'username (default)');
    console.log('   Password Field:', passwordFieldMatch ? passwordFieldMatch[1] : 'password (default)');
    
    // Check if there's a redirect field
    const redirectFieldMatch = loginPageHtml.match(/<input[^>]*name=["\']([^"\']*redirect[^"\']*)["\'][^>]*>/i);
    console.log('   Redirect Field:', redirectFieldMatch ? redirectFieldMatch[1] : 'redirect (default)');
    
    // Test actual login with credentials
    console.log('\n3. Testing login with stored credentials...');
    
    const formData = new URLSearchParams();
    formData.append('username', 'irislinhnguyen');
    formData.append('password', 'Moodlelinhnt.ftu522024!');
    
    // Add any discovered hidden fields
    hiddenFields.forEach(field => {
      formData.append(field.name, field.value);
    });
    
    const loginResponse = await fetch(`${moodleUrl}/login/index.php`, {
      method: 'POST',
      body: formData,
      redirect: 'manual', // Don't follow redirects automatically
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    console.log('   Login Response Status:', loginResponse.status);
    console.log('   Login Response Headers:');
    loginResponse.headers.forEach((value, key) => {
      console.log(`     ${key}: ${value}`);
    });
    
    if (loginResponse.status === 302 || loginResponse.status === 303) {
      const location = loginResponse.headers.get('location');
      console.log('   ✅ Login appears successful - redirected to:', location);
      
      if (location && location.includes('login')) {
        console.log('   ❌ Actually failed - redirected back to login');
      }
    } else {
      console.log('   ❌ Login failed - no redirect received');
      const responseText = await loginResponse.text();
      if (responseText.includes('Invalid login')) {
        console.log('   ❌ Invalid login message found in response');
      }
    }
    
    console.log('\n💡 DIAGNOSIS:');
    console.log('   - If login fails, the username or password might be incorrect');
    console.log('   - Hidden fields (like CSRF tokens) might be required');
    console.log('   - Field names might be different than expected');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testMoodleLogin();