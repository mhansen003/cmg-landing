'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

interface AuditLogEntry {
  id: string;
  timestamp: number;
  action: string;
  toolId: string;
  toolTitle: string;
  performedBy: string;
  metadata?: {
    rejectionReason?: string;
    previousStatus?: string;
    newStatus?: string;
  };
}

export default function AuditLogPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();

        if (data.authenticated) {
          setIsAuthenticated(true);
          setIsAdmin(data.user?.isAdmin || false);

          // If not admin, redirect to home
          if (!data.user?.isAdmin) {
            router.push('/');
            return;
          }

          // Fetch audit logs
          fetchAuditLogs();
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const fetchAuditLogs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/audit-logs');
      const data = await response.json();

      if (data.success) {
        setLogs(data.logs || []);
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'tool_created':
        return 'text-blue-400 bg-blue-500/10';
      case 'tool_approved':
        return 'text-green-400 bg-green-500/10';
      case 'tool_rejected':
        return 'text-red-400 bg-red-500/10';
      case 'tool_published':
        return 'text-accent-green bg-accent-green/10';
      case 'tool_unpublished':
        return 'text-gray-400 bg-gray-500/10';
      case 'tool_deleted':
        return 'text-orange-400 bg-orange-500/10';
      case 'tool_resubmitted':
        return 'text-purple-400 bg-purple-500/10';
      default:
        return 'text-gray-400 bg-gray-500/10';
    }
  };

  const getActionLabel = (action: string) => {
    return action
      .replace('tool_', '')
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const formatDateTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Show loading state while checking authentication
  if (isAuthenticated === null || !isAdmin) {
    return (
      <div className="min-h-screen bg-dark-500 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-accent-green mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-500">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Audit Log</h1>
              <p className="text-gray-400">
                Complete history of all tool actions and changes
              </p>
            </div>
            <button
              onClick={() => router.push('/tools')}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              ← Back to Tools
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {['tool_created', 'tool_approved', 'tool_rejected', 'tool_published'].map((action) => {
            const count = logs.filter(log => log.action === action).length;
            return (
              <div
                key={action}
                className="bg-gradient-to-br from-dark-300 to-dark-400 border border-white/10 rounded-xl p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{getActionLabel(action)}</p>
                    <p className="text-3xl font-bold text-white mt-1">{count}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg ${getActionColor(action)} flex items-center justify-center`}>
                    <span className="text-2xl">
                      {action === 'tool_created' && '📝'}
                      {action === 'tool_approved' && '✅'}
                      {action === 'tool_rejected' && '❌'}
                      {action === 'tool_published' && '🚀'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Audit Log Table */}
        <div className="bg-gradient-to-br from-dark-300 to-dark-400 border border-white/10 rounded-xl overflow-hidden">
          {/* Table Header */}
          <div className="bg-dark-400/50 border-b border-white/10 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Activity Timeline</h2>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent-green mb-4"></div>
                <p className="text-gray-400">Loading audit logs...</p>
              </div>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 bg-dark-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Activity Yet</h3>
                <p className="text-gray-400">Audit logs will appear here as actions are performed</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-500/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Tool
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Performed By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {logs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getActionColor(log.action)}`}>
                          {getActionLabel(log.action)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white max-w-xs truncate">
                          {log.toolTitle}
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                          ID: {log.toolId.substring(0, 8)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{log.performedBy}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{formatDateTime(log.timestamp)}</div>
                        <div className="text-xs text-gray-500">{formatDate(log.timestamp)}</div>
                      </td>
                      <td className="px-6 py-4">
                        {log.metadata?.rejectionReason && (
                          <div className="text-sm text-gray-400 max-w-xs truncate" title={log.metadata.rejectionReason}>
                            Reason: {log.metadata.rejectionReason}
                          </div>
                        )}
                        {log.metadata?.previousStatus && log.metadata?.newStatus && (
                          <div className="text-sm text-gray-400">
                            {log.metadata.previousStatus} → {log.metadata.newStatus}
                          </div>
                        )}
                        {!log.metadata && <span className="text-gray-600">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Total Count */}
        {logs.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Showing {logs.length} audit {logs.length === 1 ? 'entry' : 'entries'}
          </div>
        )}
      </div>
    </div>
  );
}
