/**
 * Audit Log Service
 * Tracks all admin actions for compliance and review
 */

import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();
const AUDIT_LOG_KEY = 'audit_logs';

export type AuditAction =
  | 'tool_created'
  | 'tool_approved'
  | 'tool_rejected'
  | 'tool_published'
  | 'tool_unpublished'
  | 'tool_deleted'
  | 'tool_resubmitted';

export interface AuditLogEntry {
  id: string;
  timestamp: number;
  action: AuditAction;
  toolId: string;
  toolTitle: string;
  performedBy: string;
  metadata?: {
    rejectionReason?: string;
    previousStatus?: string;
    newStatus?: string;
  };
}

/**
 * Log an audit event
 */
export async function logAuditEvent(
  action: AuditAction,
  toolId: string,
  toolTitle: string,
  performedBy: string,
  metadata?: AuditLogEntry['metadata']
): Promise<void> {
  try {
    const entry: AuditLogEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      action,
      toolId,
      toolTitle,
      performedBy,
      metadata,
    };

    // Get existing logs
    const logsData = await redis.get(AUDIT_LOG_KEY);
    const logs: AuditLogEntry[] = logsData ? JSON.parse(logsData as string) : [];

    // Add new log entry at the beginning (newest first)
    logs.unshift(entry);

    // Keep only last 1000 entries
    const trimmedLogs = logs.slice(0, 1000);

    // Save back to Redis
    await redis.set(AUDIT_LOG_KEY, JSON.stringify(trimmedLogs));

    console.log('[Audit Log] Logged action:', action, 'for tool:', toolTitle, 'by:', performedBy);
  } catch (error) {
    console.error('[Audit Log] Error logging event:', error);
    // Don't throw - audit logging should not break the main flow
  }
}

/**
 * Get all audit logs (newest first)
 */
export async function getAuditLogs(limit?: number): Promise<AuditLogEntry[]> {
  try {
    const logsData = await redis.get(AUDIT_LOG_KEY);
    const logs: AuditLogEntry[] = logsData ? JSON.parse(logsData as string) : [];

    if (limit && limit > 0) {
      return logs.slice(0, limit);
    }

    return logs;
  } catch (error) {
    console.error('[Audit Log] Error fetching logs:', error);
    return [];
  }
}

/**
 * Get audit logs for a specific tool
 */
export async function getAuditLogsForTool(toolId: string): Promise<AuditLogEntry[]> {
  try {
    const logs = await getAuditLogs();
    return logs.filter(log => log.toolId === toolId);
  } catch (error) {
    console.error('[Audit Log] Error fetching tool logs:', error);
    return [];
  }
}
