import { NextRequest, NextResponse } from 'next/server';
import { Personality } from '@/types/tool';
import { getSessionFromRequest } from '@/lib/auth';

/**
 * GET /api/personalities
 *
 * Fetches the list of available chatbot personalities from the persona engine.
 * Endpoint: https://persona.cmgfinancial.ai/api/personalities/{username}
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

    // Fetch personalities from the persona engine
    const personalitiesUrl = `https://persona.cmgfinancial.ai/api/personalities/${username}`;
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
      description: p.description || '', // Brief description from persona engine
      promptUrl: `https://persona.cmgfinancial.ai${p.url}`, // Full URL to the personality
      emoji: p.emoji, // Emoji character (fallback)
      imageUrl: p.imageUrl, // Image URL (preferred)
      icon: p.emoji, // Legacy support
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

