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
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

interface RejectedToolsSectionProps {
  rejectedTools: Tool[];
  onUpdate: () => void;
}

const RejectedToolsSection: React.FC<RejectedToolsSectionProps> = ({ rejectedTools, onUpdate }) => {
  const router = useRouter();
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [actionToolId, setActionToolId] = useState<string | null>(null);
  const [actionToolTitle, setActionToolTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);

  const handleBackToTools = () => {
    router.push('/');
  };

  const handleResubmit = async (tool: Tool, withEdits: boolean = false) => {
    if (withEdits) {
      // Open edit modal to make changes before resubmitting
      setEditingTool(tool);
      setIsEditModalOpen(true);
      return;
    }

    // Direct resubmit without edits
    setProcessingId(tool.id);
    try {
      const response = await fetch(`/api/tools/${tool.id}/resubmit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to resubmit tool');
      }

      // Refresh the list
      onUpdate();
    } catch (error) {
      console.error('Error resubmitting tool:', error);
      setErrorMessage('Failed to resubmit tool. Please try again.');
      setShowError(true);
    } finally {
      setProcessingId(null);
    }
  };

  const handleResubmitWithEdits = async (updates: any) => {
    if (!editingTool) return;

    setProcessingId(editingTool.id);
    try {
      const response = await fetch(`/api/tools/${editingTool.id}/resubmit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      });

      if (!response.ok) {
        throw new Error('Failed to resubmit tool with edits');
      }

      // Close modal and refresh
      setIsEditModalOpen(false);
      setEditingTool(null);
      onUpdate();
    } catch (error) {
      console.error('Error resubmitting tool with edits:', error);
      setErrorMessage('Failed to resubmit tool. Please try again.');
      setShowError(true);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteClick = (tool: Tool) => {
    setActionToolId(tool.id);
    setActionToolTitle(tool.title);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!actionToolId) return;

    setProcessingId(actionToolId);
    try {
      const response = await fetch(`/api/tools/${actionToolId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to delete tool');
      }

      // Close dialog and refresh
      setShowDeleteConfirm(false);
      onUpdate();
    } catch (error) {
      console.error('Error deleting tool:', error);
      setErrorMessage('Failed to delete tool. Please try again.');
      setShowError(true);
      setShowDeleteConfirm(false);
    } finally {
      setProcessingId(null);
      setActionToolId(null);
      setActionToolTitle('');
    }
  };

  if (rejectedTools.length === 0) {
    return null;
  }

  return (
    <>
      <div id="rejected-tools" className="mb-12">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-red-500/20 border-2 border-red-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">My Rejected Tools</h3>
              <p className="text-sm text-gray-400">{rejectedTools.length} tool{rejectedTools.length !== 1 ? 's' : ''} needing revision</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="px-4 py-2 bg-red-500/20 border-2 border-red-500 rounded-lg">
              <span className="text-red-500 font-bold text-lg">{rejectedTools.length}</span>
            </div>
            <button
              onClick={handleBackToTools}
              className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-gray-300 hover:text-white transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="text-sm font-medium">Hide Section</span>
            </button>
          </div>
        </div>

        {/* Rejected Items List */}
        <div className="space-y-4">
          {rejectedTools.map((tool) => (
            <div
              key={tool.id}
              id={`tool-${tool.id}`}
              className="relative bg-gradient-to-br from-dark-300 to-dark-400 rounded-xl border-2 border-red-500/30 hover:border-red-500/50 transition-all duration-300 overflow-hidden"
            >
              {/* Processing Overlay */}
              {processingId === tool.id && (
                <div className="absolute inset-0 bg-dark-500/80 backdrop-blur-sm z-50 flex items-center justify-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 border-3 border-red-500 border-t-transparent rounded-full animate-spin"></div>
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
                            <span className="inline-block px-3 py-1 text-xs font-bold bg-white/5 text-red-500 border border-red-500/30 rounded-full">
                              {tool.category}
                            </span>
                          )}
                          <span className="inline-flex items-center space-x-1.5 px-3 py-1 text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/30 rounded-full">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>Rejected</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{tool.description}</p>

                    {/* Rejection Reason Box - Prominent */}
                    {tool.rejectionReason && (
                      <div className="mb-4 p-4 bg-red-500/10 border-l-4 border-red-500 rounded-r-lg">
                        <div className="flex items-start space-x-2">
                          <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div className="flex-1">
                            <p className="text-xs font-bold text-red-500 uppercase mb-1">Rejection Reason</p>
                            <p className="text-sm text-white leading-relaxed">{tool.rejectionReason}</p>
                            {tool.rejectedBy && (
                              <p className="text-xs text-gray-500 mt-2">— {tool.rejectedBy} on {tool.rejectedAt ? new Date(tool.rejectedAt).toLocaleDateString() : ''}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
                      {tool.createdAt && (
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Submitted {new Date(tool.createdAt).toLocaleDateString()}</span>
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
                      {/* Launch Tool Button */}
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-accent-green to-accent-blue text-dark-500 font-bold rounded-lg hover:opacity-90 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span>Launch Tool</span>
                      </a>

                      <button
                        onClick={() => handleResubmit(tool, false)}
                        disabled={processingId === tool.id}
                        className="flex items-center space-x-2 px-4 py-2 bg-accent-green text-dark-500 font-bold rounded-lg hover:bg-accent-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Resubmit</span>
                      </button>

                      <button
                        onClick={() => handleResubmit(tool, true)}
                        disabled={processingId === tool.id}
                        className="flex items-center space-x-2 px-4 py-2 bg-accent-blue text-dark-500 font-bold rounded-lg hover:bg-accent-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Edit & Resubmit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteClick(tool)}
                        disabled={processingId === tool.id}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Delete Forever</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal for Resubmit with Edits */}
      {editingTool && (
        <EditToolModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingTool(null);
          }}
          onSave={handleResubmitWithEdits}
          tool={editingTool}
          isApprovalMode={false}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Tool Permanently"
        message={`You are about to permanently delete "${actionToolTitle}". This action cannot be undone. To confirm, please type "delete" below.`}
        confirmText="Delete Forever"
        cancelText="Cancel"
        confirmColor="red"
        isLoading={processingId === actionToolId}
        showTextInput={true}
        textInputLabel="Type 'delete' to confirm"
        textInputPlaceholder="delete"
        requireTextMatch="delete"
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

export default RejectedToolsSection;
