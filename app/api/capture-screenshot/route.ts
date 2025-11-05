import { NextRequest, NextResponse } from 'next/server';
import { captureScreenshot } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    // Validate URL
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Capture screenshot
    const screenshotUrl = await captureScreenshot(url);

    if (!screenshotUrl) {
      return NextResponse.json({
        success: false,
        error: 'Failed to capture screenshot',
        screenshotUrl: null,
      });
    }

    return NextResponse.json({
      success: true,
      screenshotUrl,
    });
  } catch (error) {
    console.error('Error in capture-screenshot API:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to capture screenshot',
        screenshotUrl: null,
      },
      { status: 500 }
    );
  }
}
