import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Check for API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // Generate tool details using OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert at analyzing web applications and creating compelling product descriptions.
          Given a URL, analyze what the tool does and generate marketing content for it.

          Return a JSON object with this structure:
          {
            "title": "Tool Name (2-4 words)",
            "description": "Brief one-line description (under 150 characters)",
            "fullDescription": "Detailed description (2-3 sentences)",
            "category": "One of: Operations, Marketing, Engineering, Finance, HR, Analytics",
            "accentColor": "One of: green, blue, purple",
            "features": ["6 key features as short bullet points"]
          }

          Make it sound professional and compelling for internal employees.`,
        },
        {
          role: 'user',
          content: `Analyze this tool and generate compelling content: ${url}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const generatedContent = completion.choices[0]?.message?.content;
    if (!generatedContent) {
      throw new Error('No content generated');
    }

    const toolData = JSON.parse(generatedContent);

    return NextResponse.json(toolData);
  } catch (error) {
    console.error('Error generating tool data:', error);
    return NextResponse.json(
      { error: 'Failed to generate tool data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
