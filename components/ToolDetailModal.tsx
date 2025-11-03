'use client';

import React from 'react';
import Image from 'next/image';

interface ToolDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  url: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  category?: string;
  accentColor?: 'green' | 'blue' | 'purple';
  fullDescription?: string;
  features?: string[];
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
}

const ToolDetailModal: React.FC<ToolDetailModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  url,
  thumbnailUrl,
  videoUrl,
  category,
  accentColor = 'green',
  fullDescription,
  features,
  onToggleFavorite,
  isFavorite = false,
}) => {
  if (!isOpen) return null;

  const accentColors = {
    green: {
      border: 'border-accent-green',
      bg: 'bg-accent-green',
      text: 'text-accent-green',
    },
    blue: {
      border: 'border-accent-blue',
      bg: 'bg-accent-blue',
      text: 'text-accent-blue',
    },
    purple: {
      border: 'border-accent-purple',
      bg: 'bg-accent-purple',
      text: 'text-accent-purple',
    },
  };

  const colors = accentColors[accentColor];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative w-full max-w-5xl max-h-[75vh] flex flex-col bg-gradient-to-br from-dark-300 to-dark-400 rounded-2xl border border-white/20 shadow-2xl pointer-events-auto animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all duration-200 group"
          >
            <svg className="w-5 h-5 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="p-6 border-b border-white/10 flex-shrink-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {category && (
                  <span className={`inline-block px-3 py-1 text-xs font-bold ${colors.text} bg-white/5 rounded-full border ${colors.border} mb-3`}>
                    {category}
                  </span>
                )}
                <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
                <p className="text-base text-gray-400">{description}</p>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Video and Screenshot Preview - Side by Side */}
            {(videoUrl || thumbnailUrl) && (
            <div className={`relative w-full bg-dark-500 border-y border-white/10 ${videoUrl && thumbnailUrl ? 'grid grid-cols-2' : ''}`}>
              {/* Video */}
              {videoUrl && (
                <div className="relative bg-dark-500 flex items-center justify-center p-6">
                  <div className="relative w-full rounded-lg overflow-hidden border border-white/10 shadow-2xl">
                    <video
                      src={videoUrl}
                      className="w-full object-contain rounded-lg bg-black"
                      style={{ maxHeight: '500px', height: 'auto' }}
                      autoPlay
                      loop
                      playsInline
                      controls
                      controlsList="nodownload"
                    />
                    {/* Favorite Button - Top Right of Video */}
                    {onToggleFavorite && (
                      <button
                        onClick={onToggleFavorite}
                        className="absolute top-4 right-4 w-12 h-12 rounded-full bg-dark-500/90 hover:bg-dark-400/90 border-2 border-white/20 hover:border-white/40 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110 group z-10"
                        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                      >
                        <svg
                          className={`w-6 h-6 transition-all duration-300 ${
                            isFavorite
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-400 group-hover:text-yellow-400'
                          }`}
                          fill={isFavorite ? "currentColor" : "none"}
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                  {videoUrl && thumbnailUrl && (
                    <div className="absolute top-8 left-8 px-3 py-1.5 bg-dark-500/90 border border-white/10 rounded-lg text-xs text-gray-300 font-bold backdrop-blur-sm">
                      🎥 Video Demo
                    </div>
                  )}
                </div>
              )}

              {/* Screenshot */}
              {thumbnailUrl && (
                <div className="relative bg-dark-500" style={{ minHeight: '400px' }}>
                  <Image
                    src={thumbnailUrl}
                    alt={`${title} screenshot`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-400 to-transparent"></div>
                  {videoUrl && thumbnailUrl && (
                    <div className="absolute top-2 left-2 px-3 py-1.5 bg-dark-500/90 border border-white/10 rounded-lg text-xs text-gray-300 font-bold backdrop-blur-sm">
                      📸 Screenshot
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Full Description */}
            {fullDescription && (
              <div>
                <h3 className="text-lg font-bold text-white mb-2">About this tool</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{fullDescription}</p>
              </div>
            )}

            {/* Features */}
            {features && features.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-white mb-3">Key Features</h3>
                <div className="grid md:grid-cols-2 gap-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2 p-2.5 rounded-lg bg-white/5 border border-white/10">
                      <svg className={`w-4 h-4 ${colors.text} flex-shrink-0 mt-0.5`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300 text-xs">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          </div>

          {/* Footer with CTA - Sticky at Bottom */}
          <div className="p-6 border-t border-white/10 bg-dark-500/50 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-400">
                Ready to get started?
              </div>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center px-5 py-2.5 text-xs font-bold rounded-xl text-dark-500 ${colors.bg} hover:shadow-neon-green transition-all duration-300 transform hover:scale-105`}
              >
                Launch {title}
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ToolDetailModal;
