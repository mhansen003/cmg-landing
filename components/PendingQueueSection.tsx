'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import EditToolModal from './EditToolModal';
import ConfirmDialog from './ConfirmDialog';
import ErrorAlert from './ErrorAlert';

interface Tool {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  fullDescription?: string;
  features?: string[];
  status: string;
  createdBy?: string;
  createdAt?: string;
}

interface PendingQueueSectionProps {
  pendingTools: Tool[];
  onUpdate: () => void;
}

const PendingQueueSection: React.FC<PendingQueueSectionProps> = ({ pendingTools, onUpdate }) => {
  const router = useRouter();
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [rejectingToolId, setRejectingToolId] = useState<string | null>(null);
  const [rejectingToolTitle, setRejectingToolTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);

  const handleBackToTools = () => {
    router.push('/');
  };

  const handleApprove = async (tool: Tool, withEdits: boolean = false) => {
    if (withEdits) {
      // Open edit modal to make changes before approving
      setEditingTool(tool);
      setIsEditModalOpen(true);
      return;
    }

    // Direct approve without edits
    setProcessingId(tool.id);
    try {
      const response = await fetch(`/api/tools/${tool.id}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to approve tool');
      }

      // Refresh the list
      onUpdate();
    } catch (error) {
      console.error('Error approving tool:', error);
      setErrorMessage('Failed to approve tool. Please try again.');
      setShowError(true);
    } finally {
      setProcessingId(null);
    }
  };

  const handleApproveWithEdits = async (updates: any) => {
    if (!editingTool) return;

    setProcessingId(editingTool.id);
    try {
      const response = await fetch(`/api/tools/${editingTool.id}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      });

      if (!response.ok) {
        throw new Error('Failed to approve tool with edits');
      }

      // Close modal and refresh
      setIsEditModalOpen(false);
      setEditingTool(null);
      onUpdate();
    } catch (error) {
      console.error('Error approving tool with edits:', error);
      setErrorMessage('Failed to approve tool. Please try again.');
      setShowError(true);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectClick = (tool: Tool) => {
    setRejectingToolId(tool.id);
    setRejectingToolTitle(tool.title);
    setShowRejectConfirm(true);
  };

  const handleRejectConfirm = async (rejectionReason?: string) => {
    if (!rejectingToolId) return;

    setProcessingId(rejectingToolId);
    try {
      const response = await fetch(`/api/tools/${rejectingToolId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejectionReason }),
      });

      if (!response.ok) {
        throw new Error('Failed to reject tool');
      }

      // Close dialog and refresh
      setShowRejectConfirm(false);
      onUpdate();
    } catch (error) {
      console.error('Error rejecting tool:', error);
      setErrorMessage('Failed to reject tool. Please try again.');
      setShowError(true);
      setShowRejectConfirm(false);
    } finally {
      setProcessingId(null);
      setRejectingToolId(null);
      setRejectingToolTitle('');
    }
  };

  if (pendingTools.length === 0) {
    return null;
  }

  return (
    <>
      <div id="pending-queue" className="mb-12">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-orange-500/20 border-2 border-orange-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Pending Review Queue</h3>
              <p className="text-sm text-gray-400">{pendingTools.length} item{pendingTools.length !== 1 ? 's' : ''} awaiting approval</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="px-4 py-2 bg-orange-500/20 border-2 border-orange-500 rounded-lg">
              <span className="text-orange-500 font-bold text-lg">{pendingTools.length}</span>
            </div>
            <button
              onClick={handleBackToTools}
              className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-gray-300 hover:text-white transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="text-sm font-medium">Hide Queue</span>
            </button>
          </div>
        </div>

        {/* Pending Items List */}
        <div className="space-y-4">
          {pendingTools.map((tool) => (
            <div
              key={tool.id}
              id={`tool-${tool.id}`}
              className="relative bg-gradient-to-br from-dark-300 to-dark-400 rounded-xl border-2 border-orange-500/30 hover:border-orange-500/50 transition-all duration-300 overflow-hidden"
            >
              {/* Processing Overlay */}
              {processingId === tool.id && (
                <div className="absolute inset-0 bg-dark-500/80 backdrop-blur-sm z-50 flex items-center justify-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 border-3 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-white font-bold">Processing...</span>
                  </div>
                </div>
              )}

              <div className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Video/Thumbnail Preview */}
                  <div className="flex-shrink-0 w-48 h-32 bg-dark-500 rounded-lg overflow-hidden border border-white/10">
                    {tool.videoUrl ? (
                      <video
                        src={tool.videoUrl}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        autoPlay
                        playsInline
                      />
                    ) : tool.thumbnailUrl ? (
                      <img src={tool.thumbnailUrl} alt={tool.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-white mb-2">{tool.title}</h4>
                        <div className="flex items-center space-x-2 mb-1">
                          {tool.category && (
                            <span className="inline-block px-3 py-1 text-xs font-bold bg-white/5 text-orange-500 border border-orange-500/30 rounded-full">
                              {tool.category}
                            </span>
                          )}
                          {/* Creator Badge - Prominent */}
                          <span className="inline-flex items-center space-x-1.5 px-3 py-1 text-xs font-bold bg-accent-blue/10 text-accent-blue border border-accent-blue/30 rounded-full">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>Submitted by {tool.createdBy || 'Unknown'}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{tool.description}</p>

                    {/* Metadata */}
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
                      {tool.createdAt && (
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{new Date(tool.createdAt).toLocaleDateString()}</span>
                        </div>
                      )}
                      {tool.url && (
                        <a
                          href={tool.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-accent-blue hover:text-accent-blue/80 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          <span>View URL</span>
                        </a>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center flex-wrap gap-3">
                      <button
                        onClick={() => handleApprove(tool, false)}
                        disabled={processingId === tool.id}
                        className="flex items-center space-x-2 px-4 py-2 bg-accent-green text-dark-500 font-bold rounded-lg hover:bg-accent-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Approve</span>
                      </button>

                      <button
                        onClick={() => handleApprove(tool, true)}
                        disabled={processingId === tool.id}
                        className="flex items-center space-x-2 px-4 py-2 bg-accent-blue text-dark-500 font-bold rounded-lg hover:bg-accent-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Edit & Approve</span>
                      </button>

                      <button
                        onClick={() => handleRejectClick(tool)}
                        disabled={processingId === tool.id}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal for Approve with Edits */}
      {editingTool && (
        <EditToolModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingTool(null);
          }}
          onSave={handleApproveWithEdits}
          tool={editingTool}
          isApprovalMode={true}
        />
      )}

      {/* Reject Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showRejectConfirm}
        onClose={() => setShowRejectConfirm(false)}
        onConfirm={handleRejectConfirm}
        title="Reject Tool Submission"
        message={`You are about to reject "${rejectingToolTitle}". The submitter will receive an email with your feedback and a link to edit and resubmit.`}
        confirmText="Send Rejection Email"
        cancelText="Cancel"
        confirmColor="red"
        isLoading={processingId === rejectingToolId}
        showTextInput={true}
        textInputLabel="Rejection Reason"
        textInputPlaceholder="Please explain why this tool submission is being rejected (e.g., missing information, incorrect category, duplicate submission, etc.)"
        textInputRequired={true}
      />

      {/* Error Alert */}
      <ErrorAlert
        isOpen={showError}
        onClose={() => setShowError(false)}
        message={errorMessage}
      />
    </>
  );
};

export default PendingQueueSection;
