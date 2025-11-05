'use client';

import React, { useState, useEffect } from 'react';

interface EditToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: any) => void;
  tool: {
    id: string;
    title: string;
    description: string;
    fullDescription?: string;
    url: string;
    videoUrl?: string;
    thumbnailUrl?: string;
    category?: string;
    features?: string[];
    status?: string;
  };
  isApprovalMode?: boolean; // If true, show "Approve & Publish" instead of "Save"
}

const EditToolModal: React.FC<EditToolModalProps> = ({ isOpen, onClose, onSave, tool, isApprovalMode = false }) => {
  const [formData, setFormData] = useState({
    title: tool.title || '',
    description: tool.description || '',
    fullDescription: tool.fullDescription || '',
    url: tool.url || '',
    videoUrl: tool.videoUrl || '',
    thumbnailUrl: tool.thumbnailUrl || '',
    category: tool.category || '',
    features: tool.features?.join('\n') || '',
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Update form when tool changes
  useEffect(() => {
    if (tool) {
      setFormData({
        title: tool.title || '',
        description: tool.description || '',
        fullDescription: tool.fullDescription || '',
        url: tool.url || '',
        videoUrl: tool.videoUrl || '',
        thumbnailUrl: tool.thumbnailUrl || '',
        category: tool.category || '',
        features: tool.features?.join('\n') || '',
      });
    }
  }, [tool]);

  const handleSave = () => {
    // Convert features back to array
    const featuresArray = formData.features
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    onSave({
      title: formData.title,
      description: formData.description,
      fullDescription: formData.fullDescription,
      url: formData.url,
      videoUrl: formData.videoUrl,
      thumbnailUrl: formData.thumbnailUrl,
      category: formData.category,
      features: featuresArray,
    });
  };

  const handleDelete = async () => {
    if (deleteConfirmText !== 'yes please delete this') {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/tools/${tool.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete tool');
      }

      // Close modal and reload page
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Error deleting tool:', error);
      alert('Failed to delete tool. Please try again.');
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl bg-gradient-to-br from-dark-300 to-dark-400 rounded-2xl border border-white/20 shadow-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-accent-green/10 to-accent-blue/10 backdrop-blur-sm border-b border-white/10 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Edit Tool</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 bg-dark-500 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors"
                placeholder="Tool name"
              />
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Short Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
                className="w-full px-4 py-3 bg-dark-500 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors resize-none"
                placeholder="Brief description shown on the card"
              />
            </div>

            {/* Full Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Description
              </label>
              <textarea
                value={formData.fullDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, fullDescription: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 bg-dark-500 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors resize-none"
                placeholder="Detailed description shown in modal"
              />
            </div>

            {/* URL */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                URL *
              </label>
              <div className="space-y-2">
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full px-4 py-3 bg-dark-500 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors"
                  placeholder="https://example.com"
                />
                {formData.url && (
                  <a
                    href={formData.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-3 py-2 bg-accent-blue/10 hover:bg-accent-blue/20 border border-accent-blue/30 hover:border-accent-blue text-accent-blue rounded-lg transition-colors text-sm font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span>Test Link</span>
                  </a>
                )}
              </div>
            </div>

            {/* Video URL */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Video URL
              </label>
              <input
                type="url"
                value={formData.videoUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                className="w-full px-4 py-3 bg-dark-500 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors"
                placeholder="/videos/demo.mp4 or https://..."
              />
            </div>

            {/* Thumbnail URL */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Thumbnail URL
              </label>
              <input
                type="url"
                value={formData.thumbnailUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
                className="w-full px-4 py-3 bg-dark-500 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors"
                placeholder="https://example.com/thumbnail.jpg"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 bg-dark-500 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors"
                placeholder="e.g. CMG Product, Sales AI Agents"
              />
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Features (one per line)
              </label>
              <textarea
                value={formData.features}
                onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
                rows={6}
                className="w-full px-4 py-3 bg-dark-500 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors resize-none font-mono text-sm"
                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-dark-300/95 backdrop-blur-sm border-t border-white/10 p-6">
          {!showDeleteConfirm ? (
            <div className="flex justify-between items-center">
              {/* Delete Button - Left Side */}
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 font-bold rounded-lg transition-colors"
              >
                Delete Tool
              </button>

              {/* Action Buttons - Right Side */}
              <div className="flex space-x-4">
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-gradient-to-r from-accent-green to-accent-blue text-dark-500 font-bold rounded-lg hover:scale-105 transition-transform"
                >
                  {isApprovalMode ? 'Approve & Publish' : 'Save Changes'}
                </button>
              </div>
            </div>
          ) : (
            /* Delete Confirmation */
            <div className="space-y-4">
              <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                <p className="text-red-500 font-bold mb-2">⚠️ Delete Confirmation</p>
                <p className="text-gray-300 text-sm mb-4">
                  This action cannot be undone. To confirm deletion, please type: <span className="font-mono font-bold text-white">yes please delete this</span>
                </p>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type here to confirm"
                  className="w-full px-4 py-3 bg-dark-500 border border-red-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                  autoFocus
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText('');
                  }}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-lg transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteConfirmText !== 'yes please delete this' || isDeleting}
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditToolModal;
