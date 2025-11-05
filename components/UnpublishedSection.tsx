'use client';

import React, { useState } from 'react';
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
  tags?: string[];
}

interface UnpublishedSectionProps {
  unpublishedTools: Tool[];
  onUpdate: () => void;
}

const UnpublishedSection: React.FC<UnpublishedSectionProps> = ({ unpublishedTools, onUpdate }) => {
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRepublishConfirm, setShowRepublishConfirm] = useState(false);
  const [actionToolId, setActionToolId] = useState<string | null>(null);
  const [actionToolTitle, setActionToolTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);

  const handleRepublishClick = (tool: Tool) => {
    setActionToolId(tool.id);
    setActionToolTitle(tool.title);
    setShowRepublishConfirm(true);
  };

  const handleRepublishConfirm = async () => {
    if (!actionToolId) return;

    setProcessingId(actionToolId);
    try {
      const response = await fetch(`/api/tools/${actionToolId}/publish`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'published' }),
      });

      if (!response.ok) {
        throw new Error('Failed to republish tool');
      }

      // Close dialog and refresh
      setShowRepublishConfirm(false);
      onUpdate();
    } catch (error) {
      console.error('Error republishing tool:', error);
      setErrorMessage('Failed to republish tool. Please try again.');
      setShowError(true);
      setShowRepublishConfirm(false);
    } finally {
      setProcessingId(null);
      setActionToolId(null);
      setActionToolTitle('');
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

  const handleEditClick = (tool: Tool) => {
    setEditingTool(tool);
    setIsEditModalOpen(true);
  };

  const handleEditSave = async (updates: any) => {
    if (!editingTool) return;

    setProcessingId(editingTool.id);
    try {
      const response = await fetch(`/api/tools/${editingTool.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update tool');
      }

      // Close modal and refresh
      setIsEditModalOpen(false);
      setEditingTool(null);
      onUpdate();
    } catch (error) {
      console.error('Error updating tool:', error);
      setErrorMessage('Failed to update tool. Please try again.');
      setShowError(true);
    } finally {
      setProcessingId(null);
    }
  };

  if (unpublishedTools.length === 0) {
    return null;
  }

  return (
    <>
      <div id="unpublished-section" className="mb-12">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gray-500/20 border-2 border-gray-500 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white">Unpublished Tools</h3>
            <p className="text-sm text-gray-400">{unpublishedTools.length} unpublished item{unpublishedTools.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="px-4 py-2 bg-gray-500/20 border-2 border-gray-500 rounded-lg">
            <span className="text-gray-400 font-bold text-lg">{unpublishedTools.length}</span>
          </div>
        </div>

        {/* Unpublished Items List */}
        <div className="space-y-4">
          {unpublishedTools.map((tool) => (
            <div
              key={tool.id}
              id={`tool-${tool.id}`}
              className="relative bg-gradient-to-br from-dark-300 to-dark-400 rounded-xl border-2 border-gray-500/30 hover:border-gray-500/50 transition-all duration-300 overflow-hidden"
            >
              {/* Processing Overlay */}
              {processingId === tool.id && (
                <div className="absolute inset-0 bg-dark-500/80 backdrop-blur-sm z-50 flex items-center justify-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 border-3 border-accent-green border-t-transparent rounded-full animate-spin"></div>
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
                        <h4 className="text-xl font-bold text-white mb-1">{tool.title}</h4>
                        {tool.category && (
                          <span className="inline-block px-3 py-1 text-xs font-bold bg-white/5 text-gray-400 border border-gray-500/30 rounded-full">
                            {tool.category}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{tool.description}</p>

                    {/* Metadata */}
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>By: {tool.createdBy || 'Unknown'}</span>
                      </div>
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
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleRepublishClick(tool)}
                        disabled={processingId === tool.id}
                        className="flex items-center space-x-2 px-4 py-2 bg-accent-green text-dark-500 font-bold rounded-lg hover:bg-accent-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>Republish</span>
                      </button>

                      <button
                        onClick={() => handleEditClick(tool)}
                        disabled={processingId === tool.id}
                        className="flex items-center space-x-2 px-4 py-2 bg-accent-blue text-dark-500 font-bold rounded-lg hover:bg-accent-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteClick(tool)}
                        disabled={processingId === tool.id}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {editingTool && (
        <EditToolModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingTool(null);
          }}
          onSave={handleEditSave}
          tool={editingTool}
          isAdmin={true}
        />
      )}

      {/* Republish Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showRepublishConfirm}
        onClose={() => setShowRepublishConfirm(false)}
        onConfirm={handleRepublishConfirm}
        title="Republish Tool"
        message={`Are you sure you want to republish "${actionToolTitle}"? It will become visible to all users again.`}
        confirmText="Yes, Republish"
        cancelText="Cancel"
        confirmColor="green"
        isLoading={processingId === actionToolId}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Tool"
        message={`Are you sure you want to permanently delete "${actionToolTitle}"? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        confirmColor="red"
        isLoading={processingId === actionToolId}
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

export default UnpublishedSection;
