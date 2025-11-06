import { NextRequest, NextResponse } from 'next/server';
import { Personality } from '@/types/tool';
import { getSessionFromRequest } from '@/lib/auth';

/**
 * GET /api/personalities
 *
 * Fetches the list of available chatbot personalities from the prompt engine.
 * If user has no published personalities, returns empty array (bypasses modal).
 */
export async function GET(request: NextRequest) {
  try {
    // Get session to extract username
    const session = getSessionFromRequest(request);
    const userEmail = session?.email;

    if (!userEmail) {
      console.log('[Personalities API] No user session found, returning empty array');
      return NextResponse.json({ personalities: [] });
    }

    // Extract username from email (part before @)
    const username = userEmail.split('@')[0];

    // Fetch personalities from the prompt engine
    const personalitiesUrl = `https://prompt.cmgfinancial.ai/api/personalities/${username}`;
    console.log(`[Personalities API] Fetching from: ${personalitiesUrl}`);

    const response = await fetch(personalitiesUrl, {
      headers: {
        'Accept': 'application/json',
      },
      // Add cache control to get fresh data
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`[Personalities API] Failed to fetch: ${response.status} ${response.statusText}`);
      return NextResponse.json({ personalities: [] });
    }

    const data = await response.json();

    // If the API returns no personalities, return empty array (will bypass modal)
    if (!data.personalities || data.personalities.length === 0) {
      console.log(`[Personalities API] No published personalities found for user: ${username}`);
      return NextResponse.json({ personalities: [] });
    }

    // Transform the data to match our Personality interface
    const personalities: Personality[] = data.personalities.map((p: any) => ({
      id: p.id,
      name: p.name,
      description: '', // Prompt engine doesn't provide descriptions
      promptUrl: `https://prompt.cmgfinancial.ai${p.url}`, // Full URL to the personality
      icon: p.emoji,
      createdAt: p.createdAt,
    }));

    console.log(`[Personalities API] Found ${personalities.length} personalities for user: ${username}`);
    return NextResponse.json({ personalities });

  } catch (error) {
    console.error('[Personalities API] Error fetching personalities:', error);
    // Return empty array on error - this will trigger the bypass logic
    return NextResponse.json({ personalities: [] });
  }
}

// ==================================================================================
// BACKUP: Mock data in case we need to revert
// ==================================================================================
const mockPersonalities_BACKUP: Personality[] = [
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
