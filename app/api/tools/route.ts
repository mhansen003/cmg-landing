import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

const TOOLS_KEY = 'cmg-tools';

// GET - Fetch all tools
export async function GET() {
  try {
    const tools = await kv.get(TOOLS_KEY) || [];
    return NextResponse.json({ tools });
  } catch (error) {
    console.error('Error fetching tools:', error);
    // Return default tools if KV is not configured
    return NextResponse.json({
      tools: [
        {
          title: 'Change Management Intake',
          description: 'Streamline your application intake process with our AI-powered change management system. Submit requests, track progress, and automatically route to the right teams.',
          fullDescription: 'The Change Management Intake system revolutionizes how CMG handles internal requests, feature changes, and support tickets. Using advanced AI technology, it automatically categorizes submissions, routes them to the appropriate teams, and pre-fills change management forms. This dramatically reduces processing time and ensures every request gets the attention it deserves.',
          url: 'https://intake.cmgfinancial.ai/',
          category: 'CMG Product',
          accentColor: 'green',
          features: [
            'AI-powered request analysis and categorization',
            'Automatic routing to appropriate teams',
            'Smart form pre-filling based on request content',
            'Real-time status tracking and notifications',
            'Integration with Azure DevOps',
            'Document and screenshot attachment support',
          ],
        },
        {
          title: 'Communications Builder',
          description: 'Create professional communications, training materials, and release notes with AI assistance. Generate multiple output formats from a single input.',
          fullDescription: 'The Communications Builder empowers teams to create comprehensive, professional documentation with minimal effort. Simply describe your feature or change, upload screenshots, and let AI generate perfectly formatted release notes, training guides, email announcements, FAQ documents, and quick reference cards - all from a single input.',
          url: 'https://trainbuilder.cmgfinancial.ai/',
          category: 'CMG Product',
          videoUrl: '/videos/communications-builder-demo.mp4',
          accentColor: 'blue',
          features: [
            'Multi-format output generation (Release Notes, Training Guides, FAQs)',
            'AI-powered content creation and formatting',
            'Screenshot and document integration',
            'Professional email templates',
            'Quick reference card generation',
            'Consistent branding across all materials',
          ],
        },
        {
          title: 'AI Chatbots',
          description: 'Access powerful AI chatbots for research, writing, coding, and problem-solving. Multiple models available including GPT-4, Claude, and more.',
          fullDescription: 'The AI Chatbots platform provides access to multiple state-of-the-art language models in one unified interface. Perfect for research, content creation, code generation, data analysis, and complex problem-solving. Switch between different AI models to find the best fit for your task.',
          url: 'https://app-librechat-u2uf7w.azurewebsites.net/c/new',
          category: 'Sales',
          accentColor: 'purple',
          features: [
            'Multiple AI models (GPT-4, Claude, Gemini)',
            'Conversation history and management',
            'Code generation and debugging',
            'Research and analysis assistance',
            'Document summarization',
            'Multi-language support',
          ],
        },
      ]
    });
  }
}

// POST - Add a new tool
export async function POST(request: NextRequest) {
  try {
    const newTool = await request.json();

    // Get existing tools
    const tools = (await kv.get(TOOLS_KEY) as any[]) || [];

    // Add new tool with timestamp
    const toolWithMetadata = {
      ...newTool,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    tools.push(toolWithMetadata);

    // Save back to KV
    await kv.set(TOOLS_KEY, tools);

    return NextResponse.json({ success: true, tool: toolWithMetadata });
  } catch (error) {
    console.error('Error adding tool:', error);
    return NextResponse.json(
      { error: 'Failed to add tool' },
      { status: 500 }
    );
  }
}
