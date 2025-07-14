import { NextRequest, NextResponse } from 'next/server';
import { createMoodleClient } from '@/lib/moodle/client';
import { createMoodleSyncService } from '@/lib/moodle/sync';
import { requireAdminAuth } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized - Bearer token required' }, { status: 401 });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    try {
      const adminUser = requireAdminAuth(token);
      console.log(`Admin sync requested by: ${adminUser.email}`);
    } catch (authError) {
      return NextResponse.json({ 
        error: 'Access denied - Admin role required', 
        details: authError instanceof Error ? authError.message : 'Auth failed' 
      }, { status: 403 });
    }

    const body = await request.json();
    const { action } = body;

    // Create Moodle client and sync service
    const moodleClient = createMoodleClient();
    const syncService = createMoodleSyncService(moodleClient);

    switch (action) {
      case 'sync-categories':
        await syncService.syncCategories();
        return NextResponse.json({ success: true, message: 'Categories synced successfully' });

      case 'sync-courses':
        await syncService.syncCourses();
        return NextResponse.json({ success: true, message: 'Courses synced successfully' });

      case 'sync-all':
        await syncService.fullSync();
        return NextResponse.json({ success: true, message: 'Full sync completed successfully' });

      case 'test-connection':
        const isConnected = await moodleClient.testConnection();
        return NextResponse.json({ 
          success: isConnected, 
          message: isConnected ? 'Connection successful' : 'Connection failed' 
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Moodle sync error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication for GET requests too
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized - Bearer token required' }, { status: 401 });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    try {
      const adminUser = requireAdminAuth(token);
      console.log(`Admin info requested by: ${adminUser.email}`);
    } catch (authError) {
      return NextResponse.json({ 
        error: 'Access denied - Admin role required', 
        details: authError instanceof Error ? authError.message : 'Auth failed' 
      }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'site-info') {
      const moodleClient = createMoodleClient();
      const siteInfo = await moodleClient.getSiteInfo();
      return NextResponse.json(siteInfo);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Moodle API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}