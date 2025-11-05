import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import { sendRejectionEmail, sendUnpublishNotificationEmail } from '@/lib/email-service';

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
    const body = await request.json();
    const { sendEmailNotification, ...updates } = body;

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

    // Store original tool data for email
    const originalTool = tools[toolIndex];

    // Update tool
    tools[toolIndex] = {
      ...tools[toolIndex],
      ...updates,
      id, // Preserve original ID
      updatedAt: new Date().toISOString(),
    };

    // Save back to Redis
    await redis.set(TOOLS_KEY, JSON.stringify(tools));

    // Send unpublish notification email if requested
    if (sendEmailNotification && updates.status === 'unpublished' && originalTool.createdBy && originalTool.createdBy !== 'system') {
      const session = getSessionFromRequest(request);
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://product.cmgfinancial.ai';

      console.log('[API /tools PUT] Sending unpublish notification email...');
      console.log('[API /tools PUT] Tool:', originalTool.title);
      console.log('[API /tools PUT] Recipient:', originalTool.createdBy);

      sendUnpublishNotificationEmail(
        {
          toolId: originalTool.id,
          title: originalTool.title,
          description: originalTool.description,
          category: originalTool.category,
          url: originalTool.url,
          createdBy: originalTool.createdBy,
          thumbnailUrl: originalTool.thumbnailUrl,
        },
        session?.email || 'Admin',
        originalTool.createdBy,
        siteUrl
      ).then((success) => {
        console.log(`[API /tools PUT] Unpublish email ${success ? 'sent successfully' : 'failed to send'}`);
      }).catch((err) => {
        console.error('[API /tools PUT] Failed to send unpublish email (non-blocking):', err);
      });
    }

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

// DELETE - Delete a tool (with optional rejection email)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let redis = null;

  try {
    const { id } = await params;

    // Parse rejection reason from body (if provided)
    let rejectionReason: string | undefined;
    try {
      const body = await request.json();
      rejectionReason = body.rejectionReason;
    } catch {
      // No body or invalid JSON - that's okay, treat as simple delete
    }

    // Get admin session
    const session = getSessionFromRequest(request);
    const adminEmail = session?.email || 'Admin';

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

    // Find the tool to delete (we need its info for email)
    const toolToDelete = tools.find((t: any) => t.id === id);

    if (!toolToDelete) {
      return NextResponse.json(
        { success: false, error: 'Tool not found' },
        { status: 404 }
      );
    }

    // If rejection reason provided, REJECT the tool (don't delete)
    if (rejectionReason) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://product.cmgfinancial.ai';

      console.log(`[Tool Rejection] Rejecting tool "${toolToDelete.title}" by ${adminEmail}`);
      console.log(`[Tool Rejection] Reason: ${rejectionReason}`);

      // Find the tool and update its status to "rejected"
      const toolIndex = tools.findIndex((t: any) => t.id === id);
      tools[toolIndex] = {
        ...tools[toolIndex],
        status: 'rejected',
        rejectedBy: adminEmail,
        rejectedAt: new Date().toISOString(),
        rejectionReason: rejectionReason,
      };

      // Save back to Redis
      await redis.set(TOOLS_KEY, JSON.stringify(tools));

      // Send rejection email asynchronously
      if (toolToDelete.createdBy) {
        sendRejectionEmail(
          {
            toolId: toolToDelete.id,
            title: toolToDelete.title,
            description: toolToDelete.description,
            category: toolToDelete.category,
            url: toolToDelete.url,
            createdBy: toolToDelete.createdBy,
            thumbnailUrl: toolToDelete.thumbnailUrl,
          },
          adminEmail,
          toolToDelete.createdBy,
          rejectionReason,
          siteUrl
        ).then((success) => {
          console.log(`[Tool Rejection] Email ${success ? 'sent successfully' : 'failed to send'}`);
        }).catch((err) => {
          console.error('[Tool Rejection] Failed to send rejection email (non-blocking):', err);
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Tool rejected and moved to rejected queue',
      });
    }

    // No rejection reason = permanent delete (for unpublished/rejected tools)
    console.log(`[Tool Delete] Permanently deleting tool "${toolToDelete.title}"`);

    // Filter out the tool to delete
    const filteredTools = tools.filter((t: any) => t.id !== id);

    // Save back to Redis
    await redis.set(TOOLS_KEY, JSON.stringify(filteredTools));

    return NextResponse.json({
      success: true,
      message: 'Tool deleted permanently',
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
