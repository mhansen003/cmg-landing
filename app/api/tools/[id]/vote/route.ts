import { NextRequest, NextResponse } from 'next/server';
import { Tool, VoteRequest } from '@/types/tool';

const TOOLS_KEY = 'cmg-tools';

// Lazy load Redis client only if configured
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

// PUT - Update vote for a specific tool
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let redis = null;

  try {
    const { id } = await params;
    const { voteType } = await request.json() as VoteRequest;

    if (!voteType || !['up', 'down'].includes(voteType)) {
      return NextResponse.json(
        { error: 'Invalid vote type. Must be "up" or "down"' },
        { status: 400 }
      );
    }

    redis = await getRedis();

    if (!redis) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    // Get all tools
    const toolsData = await redis.get(TOOLS_KEY);
    if (!toolsData) {
      return NextResponse.json(
        { error: 'No tools found' },
        { status: 404 }
      );
    }

    const tools: Tool[] = JSON.parse(toolsData);
    const toolIndex = tools.findIndex(t => t.id === id);

    if (toolIndex === -1) {
      return NextResponse.json(
        { error: 'Tool not found' },
        { status: 404 }
      );
    }

    // Update the vote count
    const tool = tools[toolIndex];
    if (voteType === 'up') {
      tool.upvotes = (tool.upvotes || 0) + 1;
    } else {
      tool.downvotes = (tool.downvotes || 0) + 1;
    }

    tools[toolIndex] = tool;

    // Save back to Redis
    await redis.set(TOOLS_KEY, JSON.stringify(tools));

    return NextResponse.json({
      success: true,
      tool: tool
    });
  } catch (error) {
    console.error('Error updating vote:', error);
    return NextResponse.json(
      { error: 'Failed to update vote' },
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
