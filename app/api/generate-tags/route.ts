import { NextRequest, NextResponse } from 'next/server';
import { generateToolTags } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const { title, description, fullDescription, category, url } = await request.json();

    // Validate required fields
    if (!title || !url) {
      return NextResponse.json(
        { error: 'Title and URL are required' },
        { status: 400 }
      );
    }

    // Generate tags using AI
    const tags = await generateToolTags(
      title,
      description || '',
      fullDescription || '',
      category || '',
      url
    );

    return NextResponse.json({
      success: true,
      tags,
      aiGenerated: true,
    });
  } catch (error) {
    console.error('Error in generate-tags API:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate tags',
        tags: [], // Return empty array as fallback
      },
      { status: 500 }
    );
  }
}
