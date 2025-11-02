import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const { url, description } = await request.json();

    console.log('Generate tool request:', { url, description });

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Check for API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OpenAI API key not configured');
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    console.log('API key found, creating OpenAI client...');

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    console.log('Calling OpenAI API...');

    // Generate tool details using OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using cheaper, faster model
      messages: [
        {
          role: 'system',
          content: `You are an expert at analyzing web applications and creating compelling product descriptions.
          Given a URL, analyze what the tool does and generate marketing content for it.

          You MUST respond with ONLY a valid JSON object, no other text. Use this exact structure:
          {
            "title": "Tool Name (2-4 words)",
            "description": "Brief one-line description (under 150 characters)",
            "fullDescription": "Detailed description (2-3 sentences)",
            "category": "One of: CMG Product, Operations, Marketing, Engineering, Sales, Finance, HR, Analytics",
            "accentColor": "One of: green, blue, purple",
            "features": ["6 key features as short bullet points"]
          }

          Make it sound professional and compelling for internal employees.`,
        },
        {
          role: 'user',
          content: `Analyze this tool and generate compelling content: ${url}${description ? `\n\nAdditional context: ${description}` : ''}`,
        },
      ],
      temperature: 0.7,
    });

    console.log('OpenAI response received');

    const generatedContent = completion.choices[0]?.message?.content;
    if (!generatedContent) {
      throw new Error('No content generated');
    }

    const toolData = JSON.parse(generatedContent);
    console.log('Tool data generated:', toolData);

    return NextResponse.json(toolData);
  } catch (error) {
    console.error('Error generating tool data:', error);

    // More detailed error information
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    return NextResponse.json(
      {
        error: 'Failed to generate tool data',
        details: error instanceof Error ? error.message : 'Unknown error',
        type: error instanceof Error ? error.name : 'UnknownError'
      },
      { status: 500 }
    );
  }
}
