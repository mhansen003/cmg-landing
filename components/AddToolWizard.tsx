'use client';

import React, { useState } from 'react';
import Image from 'next/image';

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
}

const AddToolWizard: React.FC<AddToolWizardProps> = ({ isOpen, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ToolFormData>({
    url: '',
    description: '',
    video: null,
    videoPreview: null,
  });
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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

  const handleGenerate = async () => {
    if (!formData.url) {
      setError('Please enter a URL');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: formData.url,
          description: formData.description
        }),
      });

      if (!response.ok) throw new Error('Failed to generate tool data');

      const data = await response.json();
      setGeneratedData(data);
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate tool data');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = () => {
    const toolData = {
      ...generatedData,
      videoFile: formData.video,
      videoPreview: formData.videoPreview,
    };
    onSubmit(toolData);
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setFormData({ url: '', description: '', video: null, videoPreview: null });
    setGeneratedData(null);
    setError(null);
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
                    Demo Video (Optional)
                  </label>
                  <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-accent-green transition-colors">
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
                        <p className="text-xs text-gray-500">MP4, WebM (Max 50MB)</p>
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
                  <p className="text-sm text-gray-300">Review the generated content below and click confirm to add your tool.</p>
                </div>

                {/* Preview Card */}
                <div className="border border-white/20 rounded-xl p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-block px-3 py-1 text-xs font-bold text-accent-green bg-white/5 rounded-full border border-accent-green/30 mb-3">
                        {generatedData.category}
                      </span>
                      <h3 className="text-2xl font-bold text-white">{generatedData.title}</h3>
                    </div>
                    <div className={`w-12 h-12 rounded-xl bg-accent-${generatedData.accentColor || 'green'} flex items-center justify-center`}>
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
                          <svg className="w-4 h-4 text-accent-green flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
