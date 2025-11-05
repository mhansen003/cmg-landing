import { NextRequest, NextResponse } from 'next/server';

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

// PUT - Update a tool
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let redis = null;

  try {
    const { id } = await params;
    const updates = await request.json();

    redis = await getRedis();

    // If Redis is not configured, return error
    if (!redis) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 500 }
      );
    }

    // Get existing tools
    const toolsData = await redis.get(TOOLS_KEY);
    const tools = toolsData ? JSON.parse(toolsData) : [];

    // Find tool index
    const toolIndex = tools.findIndex((t: any) => t.id === id);

    if (toolIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Tool not found' },
        { status: 404 }
      );
    }

    // Update tool
    tools[toolIndex] = {
      ...tools[toolIndex],
      ...updates,
      id, // Preserve original ID
      updatedAt: new Date().toISOString(),
    };

    // Save back to Redis
    await redis.set(TOOLS_KEY, JSON.stringify(tools));

    return NextResponse.json({
      success: true,
      tool: tools[toolIndex],
    });
  } catch (error) {
    console.error('Error updating tool:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update tool' },
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

// DELETE - Delete a tool
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let redis = null;

  try {
    const { id } = await params;

    redis = await getRedis();

    // If Redis is not configured, return error
    if (!redis) {
      return NextResponse.json(
        { success: false, error: 'Database not configured' },
        { status: 500 }
      );
    }

    // Get existing tools
    const toolsData = await redis.get(TOOLS_KEY);
    const tools = toolsData ? JSON.parse(toolsData) : [];

    // Filter out the tool to delete
    const filteredTools = tools.filter((t: any) => t.id !== id);

    if (filteredTools.length === tools.length) {
      return NextResponse.json(
        { success: false, error: 'Tool not found' },
        { status: 404 }
      );
    }

    // Save back to Redis
    await redis.set(TOOLS_KEY, JSON.stringify(filteredTools));

    return NextResponse.json({
      success: true,
      message: 'Tool deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting tool:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete tool' },
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
