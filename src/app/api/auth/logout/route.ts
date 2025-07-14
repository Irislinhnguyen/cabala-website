import { NextRequest, NextResponse } from 'next/server';
import { addSecurityHeaders } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Logout API: Request received');
    
    // Get the token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    
    console.log('🔍 Logout API: Token present:', token ? 'Yes' : 'No');
    
    // For now, we just return success since we're using stateless JWT tokens
    // In a production system, you might want to maintain a blacklist of invalidated tokens
    // or use shorter-lived tokens with refresh tokens
    
    console.log('🔍 Logout API: Logout successful');
    
    return addSecurityHeaders(NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    }));
    
  } catch (error) {
    console.error('🔍 Logout API: Error:', error);
    return addSecurityHeaders(NextResponse.json(
      { 
        error: 'Logout failed',
        debug: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    ));
  }
}