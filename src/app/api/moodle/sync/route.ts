import { NextRequest, NextResponse } from 'next/server';
import { createMoodleClient } from '@/lib/moodle/client';
import { createMoodleSyncService } from '@/lib/moodle/sync';

export async function POST(request: NextRequest) {
  try {
    // Check if request is from authorized source (you can add authentication here)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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