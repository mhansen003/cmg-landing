import { NextRequest, NextResponse } from 'next/server';
import { sendPendingApprovalEmail } from '@/lib/email-service';
import { verifyJWT } from '@/lib/jwt';
import { isAdmin } from '@/lib/permissions';

/**
 * Test Email Endpoint
 * Admin-only endpoint to test email functionality
 * GET /api/test-email
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = await verifyJWT(token);
    if (!session || !isAdmin(session.email)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Test email data
    const testTool = {
      toolId: 'test-' + Date.now(),
      title: 'Test Email Notification',
      description: 'This is a test email to verify the notification system is working correctly.',
      category: 'Testing',
      url: 'https://test.cmgfinancial.ai',
      createdBy: session.email || 'test@cmgfi.com',
      thumbnailUrl: undefined,
    };

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://product.cmgfinancial.ai';

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('[Test Email API] Sending test email...');
    console.log('[Test Email API] SMTP_HOST:', process.env.SMTP_HOST);
    console.log('[Test Email API] SMTP_USER:', process.env.SMTP_USER);
    console.log('[Test Email API] SMTP_PORT:', process.env.SMTP_PORT);
    console.log('[Test Email API] Site URL:', siteUrl);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Send test email
    const success = await sendPendingApprovalEmail(testTool, siteUrl);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('[Test Email API] Result:', success ? '✅ SUCCESS' : '❌ FAILED');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return NextResponse.json({
      success,
      message: success
        ? '✅ Test email sent successfully! Check your inbox (and spam folder).'
        : '❌ Failed to send test email. Check server logs for details.',
      smtp: {
        host: process.env.SMTP_HOST || 'NOT SET',
        user: process.env.SMTP_USER || 'NOT SET',
        port: process.env.SMTP_PORT || 'NOT SET',
        configured: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS),
      },
      siteUrl,
    });
  } catch (error) {
    console.error('[Test Email API] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
