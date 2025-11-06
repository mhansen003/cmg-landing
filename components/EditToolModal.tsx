'use client';

import React, { useState, useEffect } from 'react';
import TagInput from './TagInput';
import ConfirmDialog from './ConfirmDialog';
import ErrorAlert from './ErrorAlert';

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
    tags?: string[];
    aiGeneratedTags?: boolean;
    createdBy?: string;
    isChatbot?: boolean;
  };
  isApprovalMode?: boolean; // If true, show "Approve & Publish" instead of "Save"
  isAdmin?: boolean; // If true, show admin-only actions like unpublish
}

const EditToolModal: React.FC<EditToolModalProps> = ({ isOpen, onClose, onSave, tool, isApprovalMode = false, isAdmin = false }) => {
  const [formData, setFormData] = useState({
    title: tool.title || '',
    description: tool.description || '',
    fullDescription: tool.fullDescription || '',
    url: tool.url || '',
    thumbnailUrl: tool.thumbnailUrl || '',
    category: tool.category || '',
    features: tool.features?.join('\n') || '',
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(tool.videoUrl || null);
  const [tags, setTags] = useState<string[]>(tool.tags || []);
  const [isChatbot, setIsChatbot] = useState(tool.isChatbot || false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUnpublishing, setIsUnpublishing] = useState(false);
  const [showUnpublishConfirm, setShowUnpublishConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Update form when tool changes
  useEffect(() => {
    if (tool) {
      setFormData({
        title: tool.title || '',
        description: tool.description || '',
        fullDescription: tool.fullDescription || '',
        url: tool.url || '',
        thumbnailUrl: tool.thumbnailUrl || '',
        category: tool.category || '',
        features: tool.features?.join('\n') || '',
      });
      setVideoFile(null);
      setVideoPreview(tool.videoUrl || null);
      setTags(tool.tags || []);
      setIsChatbot(tool.isChatbot || false);
    }
  }, [tool]);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (3MB limit to account for base64 encoding overhead)
      const maxSizeInBytes = 3 * 1024 * 1024; // 3MB
      if (file.size > maxSizeInBytes) {
        setErrorMessage(`Video file is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Maximum size is 3MB.`);
        setShowError(true);
        return;
      }

      if (file.type.startsWith('video/')) {
        setVideoFile(file);
        setVideoPreview(URL.createObjectURL(file));
      } else {
        setErrorMessage('Please upload a valid video file');
        setShowError(true);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];

      // Check file size (3MB limit to account for base64 encoding overhead)
      const maxSizeInBytes = 3 * 1024 * 1024; // 3MB
      if (file.size > maxSizeInBytes) {
        setErrorMessage(`Video file is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Maximum size is 3MB.`);
        setShowError(true);
        return;
      }

      if (file.type.startsWith('video/')) {
        setVideoFile(file);
        setVideoPreview(URL.createObjectURL(file));
      } else {
        setErrorMessage('Please upload a valid video file');
        setShowError(true);
      }
    }
  };

  // Auto-correct URL to ensure it has http:// or https://
  const normalizeUrl = (url: string): string => {
    if (!url) return url;

    const trimmedUrl = url.trim();

    // If URL already has protocol, return as-is
    if (trimmedUrl.match(/^https?:\/\//i)) {
      return trimmedUrl;
    }

    // If URL starts with //, add https:
    if (trimmedUrl.startsWith('//')) {
      return `https:${trimmedUrl}`;
    }

    // Otherwise, add https://
    return `https://${trimmedUrl}`;
  };

  const handleSave = async () => {
    // Convert features back to array
    const featuresArray = formData.features
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    let videoBase64 = null;

    // Convert video file to base64 if a new file was uploaded
    if (videoFile) {
      try {
        const reader = new FileReader();
        videoBase64 = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(videoFile);
        });
      } catch (error) {
        console.error('Error converting video to base64:', error);
        setErrorMessage('Failed to process video file. Please try again.');
        setShowError(true);
        return;
      }
    }

    onSave({
      title: formData.title,
      description: formData.description,
      fullDescription: formData.fullDescription,
      url: normalizeUrl(formData.url),
      videoBase64, // Send base64 video if new file uploaded
      thumbnailUrl: normalizeUrl(formData.thumbnailUrl),
      category: formData.category,
      features: featuresArray,
      tags,
      isChatbot, // Include chatbot flag
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
      setErrorMessage('Failed to delete tool. Please try again.');
      setShowError(true);
      setIsDeleting(false);
    }
  };

  const handleUnpublishClick = () => {
    setShowUnpublishConfirm(true);
  };

  const handleUnpublishConfirm = async (_inputValue?: string, sendEmail?: boolean) => {
    setIsUnpublishing(true);

    try {
      const response = await fetch(`/api/tools/${tool.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'unpublished',
          sendEmailNotification: sendEmail || false,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to unpublish tool');
      }

      // Close modal and reload page
      setShowUnpublishConfirm(false);
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Error unpublishing tool:', error);
      setErrorMessage('Failed to unpublish tool. Please try again.');
      setShowError(true);
      setShowUnpublishConfirm(false);
      setIsUnpublishing(false);
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
        <div className="p-6 pb-16 overflow-y-auto max-h-[calc(90vh-140px)]">
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

            {/* Video Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Demo Video File (Optional)
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDragging
                    ? 'border-accent-green bg-accent-green/10'
                    : 'border-white/20 hover:border-accent-green'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {videoPreview ? (
                  <div className="space-y-3">
                    <video
                      src={videoPreview}
                      controls
                      className="w-full rounded-lg max-h-64"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setVideoFile(null);
                        setVideoPreview(null);
                      }}
                      className="text-sm text-red-400 hover:text-red-300 transition-colors"
                    >
                      Remove video
                    </button>
                  </div>
                ) : (
                  <>
                    <svg className="w-12 h-12 text-gray-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-gray-400 mb-2 text-sm">Drop video file here or click to browse</p>
                    <p className="text-xs text-gray-500">MP4, WebM (Max 3MB)</p>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                      id="video-upload-edit"
                    />
                    <label
                      htmlFor="video-upload-edit"
                      className="inline-block mt-3 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-medium text-white cursor-pointer transition-colors"
                    >
                      Choose File
                    </label>
                  </>
                )}
              </div>
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

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tags
              </label>
              <TagInput
                tags={tags}
                onChange={setTags}
                aiGenerated={tool.aiGeneratedTags}
                placeholder="Add tags for search and categorization"
                maxTags={10}
              />
              <p className="text-xs text-gray-500 mt-2">
                Tags help users find this tool through search
              </p>
            </div>

            {/* Chatbot Personality Checkbox */}
            <div className="flex items-start space-x-3 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
              <input
                type="checkbox"
                id="isChatbot"
                checked={isChatbot}
                onChange={(e) => setIsChatbot(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-purple-500/50 bg-dark-500 text-purple-500 focus:ring-purple-500 focus:ring-offset-dark-500"
              />
              <div className="flex-1">
                <label htmlFor="isChatbot" className="block text-sm font-bold text-white cursor-pointer">
                  🤖 Prompt for Personality
                </label>
                <p className="text-xs text-gray-400 mt-1">
                  Enable this if your tool is a chatbot that requires personality selection before launching. Users will be prompted to choose a personality from your admin system.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-dark-300/95 backdrop-blur-sm border-t border-white/10 p-6">
          {!showDeleteConfirm ? (
            <div className="flex justify-between items-center">
              {/* Left Side Actions */}
              <div className="flex space-x-4">
                {/* Delete Button */}
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 font-bold rounded-lg transition-colors"
                >
                  Delete Tool
                </button>

                {/* Unpublish Button - Admin Only, for published tools */}
                {isAdmin && tool.status === 'published' && (
                  <button
                    onClick={handleUnpublishClick}
                    disabled={isUnpublishing}
                    className="px-6 py-3 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 border border-orange-500/50 font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUnpublishing ? 'Unpublishing...' : 'Unpublish'}
                  </button>
                )}
              </div>

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

      {/* Unpublish Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showUnpublishConfirm}
        onClose={() => setShowUnpublishConfirm(false)}
        onConfirm={handleUnpublishConfirm}
        title="Unpublish Tool"
        message="Are you sure you want to unpublish this tool? It will be hidden from users but not deleted. You can republish it later."
        confirmText="Yes, Unpublish"
        cancelText="Cancel"
        confirmColor="red"
        isLoading={isUnpublishing}
        showCheckbox={true}
        checkboxLabel="Send email notification to the author"
        checkboxDefaultChecked={tool.createdBy !== 'system'}
      />

      {/* Error Alert */}
      <ErrorAlert
        isOpen={showError}
        onClose={() => setShowError(false)}
        message={errorMessage}
      />
    </div>
  );
};

export default EditToolModal;
