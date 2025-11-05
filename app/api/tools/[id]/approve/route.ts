import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import { canApprove } from '@/lib/permissions';
import { sendApprovalConfirmationEmail } from '@/lib/email-service';

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

// PUT - Approve a tool (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let redis = null;

  try {
    const { id } = await params;

    // Check permissions
    const session = getSessionFromRequest(request);
    if (!canApprove(session?.email)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
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

    // Store original tool data for email
    const originalTool = tools[toolIndex];

    // Update tool with approval data and any edits
    tools[toolIndex] = {
      ...tools[toolIndex],
      ...(updates || {}),
      id, // Preserve original ID
      status: 'published',
      approvedBy: session?.email,
      approvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save back to Redis
    await redis.set(TOOLS_KEY, JSON.stringify(tools));

    // Send approval confirmation email to the creator
    if (originalTool.createdBy && originalTool.createdBy !== 'system') {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://product.cmgfinancial.ai';

      console.log(`[Tool Approval] Sending confirmation email for "${tools[toolIndex].title}" to ${originalTool.createdBy}`);

      // Send email asynchronously (don't block response)
      sendApprovalConfirmationEmail(
        {
          toolId: tools[toolIndex].id,
          title: tools[toolIndex].title,
          description: tools[toolIndex].description,
          category: tools[toolIndex].category,
          url: tools[toolIndex].url,
          createdBy: originalTool.createdBy,
          thumbnailUrl: tools[toolIndex].thumbnailUrl,
        },
        session?.email || 'Admin',
        originalTool.createdBy,
        siteUrl
      ).then((success) => {
        console.log(`[Tool Approval] Confirmation email ${success ? 'sent successfully' : 'failed to send'}`);
      }).catch((err) => {
        console.error('[Tool Approval] Failed to send confirmation email (non-blocking):', err);
      });
    }

    return NextResponse.json({
      success: true,
      tool: tools[toolIndex],
    });
  } catch (error) {
    console.error('Error approving tool:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to approve tool' },
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
