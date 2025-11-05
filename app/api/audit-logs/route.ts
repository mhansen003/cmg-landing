import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth-jwt';
import { isAdmin } from '@/lib/permissions';
import { getAuditLogs } from '@/lib/audit-log';

/**
 * Get Audit Logs API
 * Admin-only endpoint to retrieve audit logs
 * GET /api/audit-logs
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const session = verifyAuthToken(token);
    if (!session || !isAdmin(session.email)) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get limit from query params
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    // Fetch audit logs
    const logs = await getAuditLogs(limit);

    return NextResponse.json({
      success: true,
      logs,
      count: logs.length,
    });
  } catch (error) {
    console.error('[Audit Logs API] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
