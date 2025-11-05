import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import { isAdmin } from '@/lib/permissions';

const TOOLS_KEY = 'cmg-tools';

// Lazy load Redis client
const getRedis = async () => {
  if (!process.env.REDIS_URL) {
    return null;
  }

  try {
    const { createClient } = await import('redis');
    const client = createClient({
      url: process.env.REDIS_URL
    });

    await client.connect();
    return client;
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    return null;
  }
};

// Intelligent tag assignment based on tool content
function generateTags(tool: any): string[] {
  const tags = new Set<string>();
  const text = `${tool.title} ${tool.description} ${tool.fullDescription || ''} ${tool.category}`.toLowerCase();

  // Category-based tags
  if (tool.category === 'CMG Product') {
    tags.add('AI');
    tags.add('Automation');
    tags.add('CMG Internal');
  } else if (tool.category === 'Sales AI Agents') {
    tags.add('AI');
    tags.add('Sales');
    tags.add('Chat');
  } else if (tool.category === 'Sales Voice Agents') {
    tags.add('AI');
    tags.add('Voice');
    tags.add('Sales');
  }

  // Keyword-based tags
  const keywordMap: { [key: string]: string } = {
    'guideline': 'Guidelines',
    'construction': 'Construction',
    'bank statement': 'Income Verification',
    'income': 'Income Verification',
    'document': 'Documents',
    'classification': 'Documents',
    'loan': 'Lending',
    'mortgage': 'Lending',
    'jumbo': 'Jumbo',
    'non-qm': 'Non-QM',
    'va loan': 'VA Loans',
    'va guideline': 'VA Loans',
    'chatbot': 'Chat',
    'voice': 'Voice',
    'phone': 'Voice',
    'call': 'Voice',
    'communication': 'Communication',
    'training': 'Training',
    'release': 'Release Management',
    'change management': 'Change Management',
    'intake': 'Change Management',
    'underwriting': 'Underwriting',
    'compliance': 'Compliance',
    'automation': 'Automation',
    'ai-powered': 'AI',
    'artificial intelligence': 'AI',
    'analysis': 'Analytics',
    'calculator': 'Calculators',
    'qualification': 'Qualification',
    'eligibility': 'Qualification',
    'processing': 'Processing',
    'self-employed': 'Self-Employed',
    'foreign national': 'Foreign National',
    'veteran': 'VA Loans',
    'conventional': 'Conventional',
    'fannie': 'Conventional',
    'freddie': 'Conventional',
  };

  // Check for keyword matches
  for (const [keyword, tag] of Object.entries(keywordMap)) {
    if (text.includes(keyword)) {
      tags.add(tag);
    }
  }

  // Specific tool name matching
  if (tool.title.includes('Builder')) {
    tags.add('Content Creation');
  }
  if (tool.title.includes('Analyzer')) {
    tags.add('Analytics');
  }
  if (tool.title.includes('Assistant')) {
    tags.add('Assistant');
  }

  // Feature-based tags
  if (tool.features && Array.isArray(tool.features)) {
    const featuresText = tool.features.join(' ').toLowerCase();
    if (featuresText.includes('real-time')) {
      tags.add('Real-time');
    }
    if (featuresText.includes('24/7')) {
      tags.add('24/7 Available');
    }
    if (featuresText.includes('integration')) {
      tags.add('Integration');
    }
  }

  // Convert Set to Array and limit to 5 most relevant tags
  return Array.from(tags).slice(0, 5);
}

// POST - Backfill tags for all existing tools
export async function POST(request: NextRequest) {
  let redis = null;

  try {
    // Check if user is admin
    const session = getSessionFromRequest(request);
    if (!isAdmin(session?.email)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    redis = await getRedis();

    if (!redis) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 500 }
      );
    }

    // Get all tools
    const toolsData = await redis.get(TOOLS_KEY);
    const tools = toolsData ? JSON.parse(toolsData) : [];

    console.log(`[Tag Backfill] Starting backfill for ${tools.length} tools`);

    let updatedCount = 0;
    let skippedCount = 0;

    // Process each tool
    const updatedTools = tools.map((tool: any) => {
      // Skip if tags already exist and are not empty
      if (tool.tags && Array.isArray(tool.tags) && tool.tags.length > 0) {
        console.log(`[Tag Backfill] Skipping "${tool.title}" - already has tags: ${tool.tags.join(', ')}`);
        skippedCount++;
        return tool;
      }

      // Generate tags
      const tags = generateTags(tool);
      console.log(`[Tag Backfill] Generated tags for "${tool.title}": ${tags.join(', ')}`);
      updatedCount++;

      return {
        ...tool,
        tags,
      };
    });

    // Save updated tools back to Redis
    await redis.set(TOOLS_KEY, JSON.stringify(updatedTools));

    console.log(`[Tag Backfill] ✅ Complete - Updated: ${updatedCount}, Skipped: ${skippedCount}`);

    return NextResponse.json({
      success: true,
      message: `Successfully backfilled tags for ${updatedCount} tools (${skippedCount} already had tags)`,
      updated: updatedCount,
      skipped: skippedCount,
      total: tools.length,
    });
  } catch (error) {
    console.error('[Tag Backfill] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to backfill tags' },
      { status: 500 }
    );
  } finally {
    if (redis) {
      try {
        await redis.quit();
      } catch (err) {
        console.error('Error closing Redis connection:', err);
      }
    }
  }
}
