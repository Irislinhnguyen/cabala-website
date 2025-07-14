import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { params: string[] } }
) {
  try {
    // Parse parameters - expecting [width, height]
    const [width, height] = params.params;
    
    // Get text from query parameters
    const { searchParams } = new URL(request.url);
    const text = searchParams.get('text') || 'Course Image';
    
    // Validate dimensions
    const w = parseInt(width) || 400;
    const h = parseInt(height) || 300;
    
    // Create a simple SVG placeholder
    const svg = `
      <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#E55A2B;stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:#2C3E50;stop-opacity:0.9" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)"/>
        <text 
          x="50%" 
          y="50%" 
          font-family="Arial, sans-serif" 
          font-size="${Math.min(w/15, h/8)}" 
          font-weight="600"
          fill="white" 
          text-anchor="middle" 
          dominant-baseline="middle"
          opacity="0.9"
        >
          ${text.length > 50 ? text.substring(0, 47) + '...' : text}
        </text>
        <circle cx="30" cy="30" r="8" fill="white" opacity="0.3"/>
        <circle cx="${w-30}" cy="${h-30}" r="5" fill="white" opacity="0.2"/>
      </svg>
    `.trim();
    
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    });
    
  } catch (error) {
    console.error('Placeholder generation error:', error);
    
    // Return a simple fallback SVG
    const fallbackSvg = `
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#E55A2B"/>
        <text x="50%" y="50%" font-family="Arial" font-size="18" fill="white" text-anchor="middle" dominant-baseline="middle">
          Course Image
        </text>
      </svg>
    `;
    
    return new NextResponse(fallbackSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
      },
    });
  }
}