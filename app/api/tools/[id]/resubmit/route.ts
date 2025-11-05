import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import { sendPendingApprovalEmail } from '@/lib/email-service';

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

// PUT - Resubmit a rejected tool (moves back to pending status)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let redis = null;

  try {
    const { id } = await params;

    // Get session - user can only resubmit their own tools
    const session = getSessionFromRequest(request);
    if (!session?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    // Get optional updates from request body
    const body = await request.json().catch(() => ({}));
    const { updates } = body;

    redis = await getRedis();

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

    const tool = tools[toolIndex];

    // Verify tool is rejected and user owns it
    if (tool.status !== 'rejected') {
      return NextResponse.json(
        { success: false, error: 'Tool is not in rejected status' },
        { status: 400 }
      );
    }

    if (tool.createdBy !== session.email) {
      return NextResponse.json(
        { success: false, error: 'You can only resubmit your own tools' },
        { status: 403 }
      );
    }

    // Update tool: apply any edits, move to pending, clear rejection data
    tools[toolIndex] = {
      ...tool,
      ...(updates || {}),
      id, // Preserve original ID
      status: 'pending',
      resubmittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Clear rejection data
      rejectedBy: undefined,
      rejectedAt: undefined,
      rejectionReason: undefined,
    };

    // Save back to Redis
    await redis.set(TOOLS_KEY, JSON.stringify(tools));

    // Send approval notification email to admin
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://product.cmgfinancial.ai';

    console.log(`[Tool Resubmit] Sending approval email for resubmitted tool "${tools[toolIndex].title}"`);

    // Send email asynchronously (don't block response)
    sendPendingApprovalEmail(
      {
        toolId: tools[toolIndex].id,
        title: tools[toolIndex].title,
        description: tools[toolIndex].description,
        category: tools[toolIndex].category,
        url: tools[toolIndex].url,
        createdBy: tools[toolIndex].createdBy,
        thumbnailUrl: tools[toolIndex].thumbnailUrl,
      },
      siteUrl
    ).then((success) => {
      console.log(`[Tool Resubmit] Approval email ${success ? 'sent successfully' : 'failed to send'}`);
    }).catch((err) => {
      console.error('[Tool Resubmit] Failed to send approval email (non-blocking):', err);
    });

    return NextResponse.json({
      success: true,
      tool: tools[toolIndex],
      message: 'Tool resubmitted for approval',
    });
  } catch (error) {
    console.error('Error resubmitting tool:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to resubmit tool' },
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
