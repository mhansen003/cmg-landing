import { NextRequest, NextResponse } from 'next/server';
import { Personality } from '@/types/tool';

/**
 * GET /api/personalities
 *
 * Fetches the list of available chatbot personalities.
 *
 * TODO: Replace this placeholder implementation with your actual endpoint.
 * Once you have your personality management system set up, update this endpoint
 * to fetch from your real API or database.
 *
 * Expected response format:
 * {
 *   personalities: Personality[]
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // ==================================================================================
    // PLACEHOLDER IMPLEMENTATION
    // ==================================================================================
    // Replace this with your actual API call once you have the endpoint ready.
    //
    // Example with real endpoint:
    // const response = await fetch('https://your-api.com/api/personalities', {
    //   headers: {
    //     'Authorization': `Bearer ${process.env.PERSONALITY_API_KEY}`,
    //   },
    // });
    // const data = await response.json();
    // return NextResponse.json(data);
    // ==================================================================================

    // Mock data based on the screenshot provided
    const mockPersonalities: Personality[] = [
      {
        id: '1',
        name: 'Executive Briefing (CMG)',
        description: 'Professional executive communication style with formal tone and strategic focus.',
        promptUrl: 'https://your-api.com/prompts/executive-briefing',
        icon: '📊',
        createdAt: '11/5/2025',
        publishedPrompts: 7,
      },
      {
        id: '2',
        name: 'Teaching Assistant',
        description: 'Patient, educational approach that explains concepts clearly and encourages learning.',
        promptUrl: 'https://your-api.com/prompts/teaching-assistant',
        icon: '🎓',
        createdAt: '12/31/2023',
        publishedPrompts: 0,
      },
      {
        id: '3',
        name: 'Code Review Expert',
        description: 'Technical code analysis with constructive feedback and best practice recommendations.',
        promptUrl: 'https://your-api.com/prompts/code-review-expert',
        icon: '💻',
        createdAt: '12/31/2023',
        publishedPrompts: 0,
      },
      {
        id: '4',
        name: 'Creative Storyteller',
        description: 'Engaging narrative style with vivid descriptions and compelling story arcs.',
        promptUrl: 'https://your-api.com/prompts/creative-storyteller',
        icon: '✨',
        createdAt: '12/31/2023',
        publishedPrompts: 0,
      },
      {
        id: '5',
        name: 'Executive Briefing',
        description: 'Concise, action-oriented communication for executive decision-making.',
        promptUrl: 'https://your-api.com/prompts/executive-briefing-2',
        icon: '📋',
        createdAt: '12/31/2023',
        publishedPrompts: 0,
      },
      {
        id: '6',
        name: 'Casual Chat Friend',
        description: 'Friendly, conversational tone perfect for everyday interactions.',
        promptUrl: 'https://your-api.com/prompts/casual-chat-friend',
        icon: '💬',
        createdAt: '12/31/2023',
        publishedPrompts: 0,
      },
      {
        id: '7',
        name: 'Research Analyst',
        description: 'Data-driven insights with thorough analysis and evidence-based conclusions.',
        promptUrl: 'https://your-api.com/prompts/research-analyst',
        icon: '🔬',
        createdAt: '12/31/2023',
        publishedPrompts: 0,
      },
      {
        id: '8',
        name: 'Quick Helper',
        description: 'Fast, efficient responses focused on getting things done quickly.',
        promptUrl: 'https://your-api.com/prompts/quick-helper',
        icon: '⚡',
        createdAt: '12/31/2023',
        publishedPrompts: 0,
      },
      {
        id: '9',
        name: 'Social Media Writer',
        description: 'Engaging, shareable content optimized for social media platforms.',
        promptUrl: 'https://your-api.com/prompts/social-media-writer',
        icon: '📱',
        createdAt: '12/31/2023',
        publishedPrompts: 0,
      },
      {
        id: '10',
        name: 'Technical Documentation',
        description: 'Clear, structured technical writing with comprehensive documentation standards.',
        promptUrl: 'https://your-api.com/prompts/technical-documentation',
        icon: '📚',
        createdAt: '12/31/2023',
        publishedPrompts: 0,
      },
    ];

    return NextResponse.json({
      personalities: mockPersonalities,
    });
  } catch (error) {
    console.error('Error fetching personalities:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch personalities',
        personalities: [],
      },
      { status: 500 }
    );
  }
}
