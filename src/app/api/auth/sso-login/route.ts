import { NextRequest, NextResponse } from 'next/server';
import { generateMoodleJWT, generateSSOUrl, JWTUser } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Get user parameters from query string
  const email = searchParams.get('email');
  const username = searchParams.get('username');
  const firstName = searchParams.get('firstName') || searchParams.get('first_name');
  const lastName = searchParams.get('lastName') || searchParams.get('last_name');
  const redirectUrl = searchParams.get('redirect');

  // Validate required parameters
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  // Create user object for JWT generation
  const user: JWTUser = {
    email,
    username,
    firstName,
    lastName
  };

  try {
    // Generate JWT token
    const token = generateMoodleJWT(user);
    
    // Generate SSO URL with token
    const ssoUrl = generateSSOUrl(token, redirectUrl);
    
    // Redirect to Moodle with JWT token
    return NextResponse.redirect(ssoUrl);
  } catch (error) {
    console.error('SSO login error:', error);
    return NextResponse.json({ error: 'Failed to generate SSO token' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username, firstName, lastName, redirectUrl } = body;

    // Validate required parameters
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Create user object for JWT generation
    const user: JWTUser = {
      email,
      username,
      firstName,
      lastName
    };

    // Generate JWT token
    const token = generateMoodleJWT(user);
    
    // Generate SSO URL with token
    const ssoUrl = generateSSOUrl(token, redirectUrl);
    
    // Return the SSO URL for client-side redirect
    return NextResponse.json({ ssoUrl });
  } catch (error) {
    console.error('SSO login error:', error);
    return NextResponse.json({ error: 'Failed to generate SSO token' }, { status: 500 });
  }
}