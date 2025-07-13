import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ 
        error: 'No token provided. Use ?token=YOUR_JWT_TOKEN' 
      }, { status: 400 });
    }

    console.log('🔍 Decoding JWT token:', token.substring(0, 50) + '...');

    const jwt = require('jsonwebtoken');
    const jwtSecret = '951a13d46d67f57e472e41ecdc19d6177194f384fe95d1b7f551b6667669a5622';
    
    try {
      // Decode without verification first to see structure
      const decodedUnverified = jwt.decode(token);
      console.log('🔍 Decoded payload (unverified):', decodedUnverified);
      
      // Now verify with secret
      const decodedVerified = jwt.verify(token, jwtSecret);
      console.log('🔍 Decoded payload (verified):', decodedVerified);
      
      return NextResponse.json({
        status: 'success',
        token: token,
        payload: decodedVerified,
        analysis: {
          hasUsername: 'username' in decodedVerified,
          hasEmail: 'email' in decodedVerified,
          hasFirstname: 'firstname' in decodedVerified,
          hasLastname: 'lastname' in decodedVerified,
          hasFirstName: 'firstName' in decodedVerified,
          hasLastName: 'lastName' in decodedVerified,
          fieldCount: Object.keys(decodedVerified).length,
          allFields: Object.keys(decodedVerified)
        },
        moodleExpectation: {
          requiredFields: ['username', 'email', 'firstname', 'lastname'],
          status: (
            'username' in decodedVerified && 
            'email' in decodedVerified && 
            'firstname' in decodedVerified && 
            'lastname' in decodedVerified
          ) ? 'ALL REQUIRED FIELDS PRESENT' : 'MISSING REQUIRED FIELDS'
        }
      });
      
    } catch (verifyError) {
      console.error('❌ JWT verification failed:', verifyError);
      
      // Try to decode without verification to at least see the payload
      try {
        const decodedUnverified = jwt.decode(token);
        return NextResponse.json({
          status: 'verification_failed',
          error: verifyError instanceof Error ? verifyError.message : 'Unknown verification error',
          payload: decodedUnverified,
          note: 'Token could be decoded but signature verification failed'
        });
      } catch (decodeError) {
        return NextResponse.json({
          status: 'decode_failed',
          error: decodeError instanceof Error ? decodeError.message : 'Unknown decode error',
          note: 'Token is completely malformed'
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error in JWT decoder:', error);
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}