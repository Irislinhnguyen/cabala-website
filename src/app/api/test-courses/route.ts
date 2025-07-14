import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔍 Testing course fetch...');
    
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        moodleCourseId: true,
        thumbnail: true,
        isVisible: true
      }
    });
    
    console.log(`Found ${courses.length} courses`);
    
    return NextResponse.json({
      success: true,
      courses: courses,
      count: courses.length
    });
    
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}