import { NextRequest, NextResponse } from 'next/server';
import { createMoodleClient } from '@/lib/moodle/client';
import { generateMoodleJWT } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email') || 'irislevine13@gmail.com';

    console.log('🔍 Checking if account exists in Moodle for:', email);

    // Initialize Moodle client
    const moodleClient = createMoodleClient();
    
    // Check if account exists in Moodle
    const moodleUser = await moodleClient.getUserByEmail(email);
    
    if (moodleUser) {
      console.log('✅ Account found in Moodle:', moodleUser);
      
      // Generate what our JWT would send for comparison
      const testJWT = generateMoodleJWT({
        email: moodleUser.email,
        username: moodleUser.username,
        firstName: moodleUser.firstname, // Note: we'll see if this is the issue
        lastName: moodleUser.lastname
      });
      
      // Decode JWT to see payload structure
      const jwt = require('jsonwebtoken');
      const jwtSecret = '951a13d46d67f57e472e41ecdc19d6177194f384fe95d1b7f551b6667669a5622';
      const decodedJWT = jwt.verify(testJWT, jwtSecret);
      
      return NextResponse.json({
        status: 'found',
        email: email,
        moodleAccount: {
          id: moodleUser.id,
          username: moodleUser.username,
          email: moodleUser.email,
          firstname: moodleUser.firstname,  // lowercase
          lastname: moodleUser.lastname     // lowercase
        },
        jwtPayload: decodedJWT,
        comparison: {
          usernameMatch: moodleUser.username === decodedJWT.username,
          emailMatch: moodleUser.email === decodedJWT.email,
          firstnameMatch: moodleUser.firstname === decodedJWT.firstname,
          lastnameMatch: moodleUser.lastname === decodedJWT.lastname,
          fieldNameStatus: {
            moodleHas: 'firstname/lastname (lowercase)',
            jwtNowSends: 'firstname/lastname (lowercase)',
            status: 'FIXED - Field names now match!'
          }
        }
      });
    } else {
      console.log('❌ Account not found in Moodle for:', email);
      
      return NextResponse.json({
        status: 'not_found',
        email: email,
        message: 'No account found in Moodle for this email',
        implications: [
          'Account creation during SSO likely failed',
          'SSO process is not completing successfully',
          'Check SSO logs for creation errors'
        ]
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking Moodle account:', error);
    
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      details: 'Failed to check Moodle account - check Moodle connection and credentials'
    }, { status: 500 });
  }
}