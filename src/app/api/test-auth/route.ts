import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    
    console.log('🔍 Test Auth API: Token received:', token ? 'Present' : 'Missing');
    
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: 'No token provided',
        debug: 'Token is missing from request'
      });
    }

    console.log('🔍 Test Auth API: Calling verifyToken...');
    const user = verifyToken(token);
    
    console.log('🔍 Test Auth API: Verification result:', user);
    
    if (user) {
      console.log('🔍 Test Auth API: Token valid, user role:', user.role);
      return NextResponse.json({ 
        success: true, 
        user,
        isAdmin: user.role === 'ADMIN',
        debug: 'Token verification successful'
      });
    } else {
      console.log('🔍 Test Auth API: Token verification failed');
      return NextResponse.json({ 
        success: false, 
        error: 'Token verification failed',
        debug: 'verifyToken returned null'
      });
    }
    
  } catch (error) {
    console.error('🔍 Test Auth API: Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      debug: 'Exception during token verification'
    });
  }
}

// Test JWT generation
export async function GET() {
  try {
    console.log('🔍 Test Auth API: Testing JWT generation...');
    
    const testUser = {
      userId: 'test-123',
      email: 'test@cabala.com',
      name: 'Test User',
      role: 'STUDENT'
    };
    
    console.log('🔍 Test Auth API: Generating token for:', testUser);
    const token = generateToken(testUser);
    
    console.log('🔍 Test Auth API: Token generated successfully, length:', token?.length || 0);
    
    // Now verify the token we just generated
    const verifiedUser = verifyToken(token);
    console.log('🔍 Test Auth API: Token verification result:', verifiedUser);
    
    return NextResponse.json({
      success: true,
      message: 'JWT system working correctly',
      token: token.substring(0, 20) + '...', // Show first 20 chars for debugging
      tokenLength: token.length,
      verificationTest: verifiedUser ? 'PASSED' : 'FAILED',
      verifiedUser,
      jwtSecretConfigured: process.env.JWT_SECRET ? 'YES' : 'NO'
    });
    
  } catch (error) {
    console.error('🔍 Test Auth API: JWT Generation Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      jwtSecretConfigured: process.env.JWT_SECRET ? 'YES' : 'NO',
      debug: 'Exception during JWT generation test'
    });
  }
}