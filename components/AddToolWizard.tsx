'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import TagInput from './TagInput';

interface AddToolWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (toolData: any) => void;
}

interface ToolFormData {
  url: string;
  description: string;
  video: File | null;
  videoPreview: string | null;
  thumbnailUrl: string;
}

const AddToolWizard: React.FC<AddToolWizardProps> = ({ isOpen, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ToolFormData>({
    url: '',
    description: '',
    video: null,
    videoPreview: null,
    thumbnailUrl: '',
  });
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualCategory, setManualCategory] = useState<string>('');
  const [editedCategory, setEditedCategory] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('#00FF88');
  const [tags, setTags] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const categoryOptions = [
    'CMG Product',
    'Sales',
    'Operations',
    'Marketing',
    'Engineering',
    'Finance',
    'HR',
    'Analytics',
  ];

  const colorOptions = [
    { name: 'Green', value: '#00FF88' },
    { name: 'Blue', value: '#00D4FF' },
    { name: 'Purple', value: '#A855F7' },
    { name: 'Orange', value: '#FB923C' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Yellow', value: '#FBBF24' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Cyan', value: '#06B6D4' },
  ];

  if (!isOpen) return null;

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (3MB limit to account for base64 encoding overhead)
      const maxSizeInBytes = 3 * 1024 * 1024; // 3MB
      if (file.size > maxSizeInBytes) {
        setError(`Video file is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Maximum size is 3MB.`);
        return;
      }

      if (file.type.startsWith('video/')) {
        setFormData(prev => ({
          ...prev,
          video: file,
          videoPreview: URL.createObjectURL(file),
        }));
        setError(null);
      } else {
        setError('Please upload a valid video file');
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
        setError(`Video file is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Maximum size is 3MB.`);
        return;
      }

      if (file.type.startsWith('video/')) {
        setFormData(prev => ({
          ...prev,
          video: file,
          videoPreview: URL.createObjectURL(file),
        }));
        setError(null);
      } else {
        setError('Please upload a valid video file');
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

  const handleGenerate = async () => {
    if (!formData.url) {
      setError('Please enter a URL');
      return;
    }

    // Normalize the URL before processing
    const normalizedUrl = normalizeUrl(formData.url);
    setFormData(prev => ({ ...prev, url: normalizedUrl }));

    setIsGenerating(true);
    setError(null);

    try {
      // Step 1: Generate tool data
      const toolResponse = await fetch('/api/generate-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: normalizedUrl,
          description: formData.description
        }),
      });

      if (!toolResponse.ok) throw new Error('Failed to generate tool data');

      const toolData = await toolResponse.json();
      setGeneratedData(toolData);

      // Use manual category if set, otherwise use AI-generated category
      const finalCategory = manualCategory || toolData.category || '';
      setEditedCategory(finalCategory);

      // Step 2: Generate AI tags in parallel with screenshot capture
      const aiPromises = [];

      // Generate tags
      const tagsPromise = fetch('/api/generate-tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: toolData.title,
          description: toolData.description,
          fullDescription: toolData.fullDescription,
          category: finalCategory,
          url: formData.url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.tags) {
            setTags(data.tags);
          }
        })
        .catch((err) => {
          console.error('Failed to generate tags:', err);
          // Set fallback tags
          setTags([finalCategory, 'Tools']);
        });

      aiPromises.push(tagsPromise);

      // Capture screenshot if no video was uploaded AND no manual thumbnail provided
      if (!formData.video && !formData.thumbnailUrl) {
        const screenshotPromise = fetch('/api/capture-screenshot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: normalizedUrl }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.screenshotUrl) {
              // Add screenshot URL to generated data
              setGeneratedData((prev: any) => ({
                ...prev,
                thumbnailUrl: data.screenshotUrl,
              }));
            }
          })
          .catch((err) => {
            console.error('Failed to capture screenshot:', err);
            // Non-critical error, continue without screenshot
          });

        aiPromises.push(screenshotPromise);
      } else if (formData.thumbnailUrl) {
        // Use manually provided thumbnail
        setGeneratedData((prev: any) => ({
          ...prev,
          thumbnailUrl: normalizeUrl(formData.thumbnailUrl),
        }));
      }

      // Wait for all AI operations to complete
      await Promise.all(aiPromises);

      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate tool data');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async () => {
    let videoBase64 = null;

    // Convert video file to base64 if present
    if (formData.video) {
      try {
        const reader = new FileReader();
        videoBase64 = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(formData.video!);
        });
      } catch (error) {
        console.error('Error converting video to base64:', error);
      }
    }

    const toolData = {
      ...generatedData,
      category: editedCategory,
      categoryColor: selectedColor,
      videoBase64, // Pass base64 video data
      thumbnailUrl: formData.thumbnailUrl ? normalizeUrl(formData.thumbnailUrl) : generatedData.thumbnailUrl,
      tags,
      aiGeneratedTags: true, // Mark tags as AI-generated
    };
    onSubmit(toolData);
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setFormData({ url: '', description: '', video: null, videoPreview: null, thumbnailUrl: '' });
    setGeneratedData(null);
    setError(null);
    setTags([]);
    setManualCategory('');
    setEditedCategory('');
    setSelectedColor('#00FF88');
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={handleClose}
      />

      {/* Wizard Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-dark-300 to-dark-400 rounded-2xl border border-white/20 shadow-2xl pointer-events-auto animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all duration-200 group"
          >
            <svg className="w-5 h-5 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="p-8 border-b border-white/10">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-green to-accent-blue flex items-center justify-center">
                <svg className="w-6 h-6 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">Add New Tool</h2>
                <p className="text-sm text-gray-400">Step {step} of 2</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent-green to-accent-blue transition-all duration-500"
                style={{ width: `${(step / 2) * 100}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-white mb-2">
                    Tool URL <span className="text-accent-green">*</span>
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://yourtool.cmgfinancial.ai/"
                    className="w-full px-4 py-3 bg-dark-500 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-2">AI will analyze this URL to generate tool details</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-white mb-2">
                    Brief Description (Optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this tool does and its key features..."
                    rows={3}
                    className="w-full px-4 py-3 bg-dark-500 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">Help AI understand your tool better (optional)</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-white mb-2">
                    Category <span className="text-accent-green">*</span>
                  </label>
                  <select
                    value={manualCategory}
                    onChange={(e) => setManualCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-dark-500 border border-white/20 rounded-xl text-white focus:outline-none focus:border-accent-green transition-colors"
                  >
                    <option value="">Select a category or AI will suggest one</option>
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-2">Choose a category or let AI suggest one based on the URL</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-white mb-2">
                    Demo Video File (Optional)
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                      isDragging
                        ? 'border-accent-green bg-accent-green/10'
                        : 'border-white/20 hover:border-accent-green'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {formData.videoPreview ? (
                      <div className="space-y-4">
                        <video
                          src={formData.videoPreview}
                          controls
                          className="w-full rounded-lg"
                        />
                        <button
                          onClick={() => setFormData(prev => ({ ...prev, video: null, videoPreview: null }))}
                          className="text-sm text-red-400 hover:text-red-300"
                        >
                          Remove video
                        </button>
                      </div>
                    ) : (
                      <>
                        <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-gray-400 mb-2">Drop video file here or click to browse</p>
                        <p className="text-xs text-gray-500">MP4, WebM (Max 3MB)</p>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoUpload}
                          className="hidden"
                          id="video-upload"
                        />
                        <label
                          htmlFor="video-upload"
                          className="inline-block mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-medium text-white cursor-pointer transition-colors"
                        >
                          Choose File
                        </label>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-white mb-2">
                    Thumbnail URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.thumbnailUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
                    placeholder="https://example.com/thumbnail.jpg"
                    className="w-full px-4 py-3 bg-dark-500 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {formData.video
                      ? "Thumbnail will be shown when video isn't playing"
                      : "AI will auto-capture a screenshot if not provided"}
                  </p>
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !formData.url}
                  className="w-full px-6 py-4 bg-gradient-to-r from-accent-green to-accent-blue text-dark-500 font-bold rounded-xl hover:shadow-neon-green transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generating with AI...
                    </span>
                  ) : (
                    'Generate Tool Details'
                  )}
                </button>
              </div>
            )}

            {step === 2 && generatedData && (
              <div className="space-y-6">
                <div className="p-6 bg-accent-green/10 border border-accent-green/30 rounded-xl">
                  <div className="flex items-center space-x-2 mb-4">
                    <svg className="w-5 h-5 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-bold text-accent-green">AI Generated Successfully!</span>
                  </div>
                  <p className="text-sm text-gray-300">Review and edit the category and color below before confirming.</p>
                </div>

                {/* Category and Color Picker */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">
                      Category <span className="text-accent-green">*</span>
                    </label>
                    <input
                      type="text"
                      value={editedCategory}
                      onChange={(e) => setEditedCategory(e.target.value)}
                      placeholder="Enter category name"
                      className="w-full px-4 py-3 bg-dark-500 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent-green transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-2">All tools in the same category will share this color</p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-white mb-2">
                      Category Color
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {colorOptions.map((color) => (
                        <button
                          key={color.value}
                          onClick={() => setSelectedColor(color.value)}
                          className={`relative p-4 rounded-xl border-2 transition-all ${
                            selectedColor === color.value
                              ? 'border-white scale-105'
                              : 'border-white/20 hover:border-white/40'
                          }`}
                          style={{ backgroundColor: color.value + '20' }}
                        >
                          <div
                            className="w-full h-8 rounded-lg"
                            style={{ backgroundColor: color.value }}
                          />
                          <p className="text-xs text-white mt-2 text-center font-medium">{color.name}</p>
                          {selectedColor === color.value && (
                            <div className="absolute top-2 right-2">
                              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tags Section */}
                <div>
                  <label className="block text-sm font-bold text-white mb-2">
                    Tags (Optional)
                  </label>
                  <TagInput
                    tags={tags}
                    onChange={setTags}
                    placeholder="Add tags for search and categorization"
                    maxTags={10}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Tags help users find your tool. Example: Sales, Operations, IT, Training, AI
                  </p>
                </div>

                {/* Preview Card */}
                <div className="border border-white/20 rounded-xl p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span
                        className="inline-block px-3 py-1 text-xs font-bold bg-white/5 rounded-full border-2 mb-3"
                        style={{ color: selectedColor, borderColor: selectedColor }}
                      >
                        {editedCategory}
                      </span>
                      <h3 className="text-2xl font-bold text-white">{generatedData.title}</h3>
                    </div>
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: selectedColor }}
                    >
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm">{generatedData.description}</p>

                  <div className="pt-4 border-t border-white/10">
                    <h4 className="text-sm font-bold text-white mb-3">Key Features:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {generatedData.features?.map((feature: string, index: number) => (
                        <div key={index} className="flex items-start space-x-2 text-xs text-gray-400">
                          <svg
                            className="w-4 h-4 flex-shrink-0 mt-0.5"
                            style={{ color: selectedColor }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-accent-green to-accent-blue text-dark-500 font-bold rounded-xl hover:shadow-neon-green transition-all duration-300 transform hover:scale-105"
                  >
                    Confirm & Add Tool
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddToolWizard;
