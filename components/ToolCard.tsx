'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import ToolDetailModal from './ToolDetailModal';

interface ToolCardProps {
  title: string;
  description: string;
  url: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  icon?: React.ReactNode;
  category?: string;
  accentColor?: 'green' | 'blue' | 'purple';
  fullDescription?: string;
  features?: string[];
}

const ToolCard: React.FC<ToolCardProps> = ({
  title,
  description,
  url,
  thumbnailUrl,
  videoUrl,
  icon,
  category,
  accentColor = 'green',
  fullDescription,
  features,
}) => {
  const [votes, setVotes] = useState({ up: 0, down: 0 });
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [showShareToast, setShowShareToast] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const accentColors = {
    green: {
      border: 'border-accent-green',
      bg: 'bg-accent-green',
      shadow: 'shadow-neon-green',
      text: 'text-accent-green',
      hover: 'group-hover:border-accent-green',
      glow: 'bg-accent-green/20',
    },
    blue: {
      border: 'border-accent-blue',
      bg: 'bg-accent-blue',
      shadow: 'shadow-neon-blue',
      text: 'text-accent-blue',
      hover: 'group-hover:border-accent-blue',
      glow: 'bg-accent-blue/20',
    },
    purple: {
      border: 'border-accent-purple',
      bg: 'bg-accent-purple',
      shadow: 'shadow-neon-purple',
      text: 'text-accent-purple',
      hover: 'group-hover:border-accent-purple',
      glow: 'bg-accent-purple/20',
    },
  };

  const colors = accentColors[accentColor];

  const handleVote = (type: 'up' | 'down') => {
    if (userVote === type) {
      // Remove vote
      setVotes(prev => ({ ...prev, [type]: prev[type] - 1 }));
      setUserVote(null);
    } else {
      // Change or add vote
      setVotes(prev => ({
        up: type === 'up' ? prev.up + 1 : userVote === 'up' ? prev.up - 1 : prev.up,
        down: type === 'down' ? prev.down + 1 : userVote === 'down' ? prev.down - 1 : prev.down,
      }));
      setUserVote(type);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: description,
          url: url,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(url);
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 2000);
      }
    } catch (err) {
      console.log('Share failed:', err);
    }
  };

  return (
    <>
      <div className="group relative">
        {/* Glow effect on hover */}
        <div className={`absolute -inset-0.5 ${colors.glow} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500`}></div>

        <div className={`relative bg-gradient-to-br from-dark-300 to-dark-400 rounded-xl overflow-hidden border ${colors.hover} border-white/10 transition-all duration-500 group-hover:scale-[1.01]`}>
          <div className="flex flex-col">
            {/* Top - Video/Screenshot */}
            <div className="relative bg-dark-500 flex items-center justify-center p-3 h-48 cursor-pointer" onClick={() => setIsModalOpen(true)}>
              {videoUrl ? (
                <div className="relative w-full h-full rounded-lg overflow-hidden border border-white/10 shadow-2xl group-hover:border-white/20 transition-all duration-500">
                  <video
                    src={videoUrl}
                    className="w-full h-full object-cover rounded-lg"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 flex items-center justify-center">
                    <div className="text-white text-center">
                      <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span className="text-xs font-bold">View details</span>
                    </div>
                  </div>
                </div>
              ) : thumbnailUrl ? (
                <div className="relative w-full h-full rounded-lg overflow-hidden border border-white/10 shadow-2xl group-hover:border-white/20 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-dark-500/50 z-10"></div>
                  <Image
                    src={thumbnailUrl}
                    alt={`${title} screenshot`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 flex items-center justify-center">
                    <div className="text-white text-center">
                      <svg className="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span className="text-xs font-bold">View details</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`w-full h-full rounded-lg bg-gradient-to-br from-dark-400 to-dark-500 flex items-center justify-center border ${colors.border}`}>
                  <svg className={`w-12 h-12 ${colors.text} opacity-30`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              {/* Corner accent */}
              <div className={`absolute top-0 right-0 w-16 h-16 ${colors.bg} opacity-10 blur-2xl`}></div>
              <div className={`absolute bottom-0 left-0 w-16 h-16 ${colors.bg} opacity-10 blur-2xl`}></div>
            </div>

            {/* Bottom - Content */}
            <div className="p-5 flex flex-col justify-between relative z-10">
              <div>
                {/* Category Badge */}
                {category && (
                  <div className="inline-flex items-center space-x-2 mb-4">
                    <span className={`px-3 py-1 text-xs font-bold ${colors.text} bg-white/5 rounded-full border ${colors.border} backdrop-blur-sm`}>
                      {category}
                    </span>
                  </div>
                )}

                {/* Icon and Title */}
                <div className="flex items-start space-x-3 mb-3">
                  {icon && (
                    <div className="relative flex-shrink-0">
                      <div className={`absolute inset-0 ${colors.bg} blur-md opacity-50`}></div>
                      <div className={`relative w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                        <div className="scale-75">{icon}</div>
                      </div>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">
                      {title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-400 text-xs leading-relaxed mb-4">
                  {description}
                </p>

                {/* Action Buttons Row */}
                <div className="flex items-center space-x-2 mb-4">
                  {/* Vote Up */}
                  <button
                    onClick={() => handleVote('up')}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg border ${
                      userVote === 'up'
                        ? `${colors.border} ${colors.bg}/20`
                        : 'border-white/10 bg-white/5'
                    } hover:border-white/30 transition-all duration-200 group/vote`}
                    title="Vote up"
                  >
                    <svg
                      className={`w-4 h-4 ${userVote === 'up' ? colors.text : 'text-gray-400'} group-hover/vote:${colors.text} transition-colors`}
                      fill={userVote === 'up' ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                    <span className={`text-xs font-bold ${userVote === 'up' ? colors.text : 'text-gray-400'}`}>
                      {votes.up}
                    </span>
                  </button>

                  {/* Vote Down */}
                  <button
                    onClick={() => handleVote('down')}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg border ${
                      userVote === 'down'
                        ? 'border-red-500 bg-red-500/20'
                        : 'border-white/10 bg-white/5'
                    } hover:border-white/30 transition-all duration-200 group/vote`}
                    title="Vote down"
                  >
                    <svg
                      className={`w-4 h-4 ${userVote === 'down' ? 'text-red-500' : 'text-gray-400'} group-hover/vote:text-red-500 transition-colors`}
                      fill={userVote === 'down' ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                    </svg>
                    <span className={`text-xs font-bold ${userVote === 'down' ? 'text-red-500' : 'text-gray-400'}`}>
                      {votes.down}
                    </span>
                  </button>

                  {/* Share Button */}
                  <button
                    onClick={handleShare}
                    className="relative flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:border-white/30 transition-all duration-200 group/share"
                    title="Share"
                  >
                    <svg className="w-4 h-4 text-gray-400 group-hover/share:text-accent-blue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span className="text-xs font-bold text-gray-400 group-hover/share:text-accent-blue">Share</span>

                    {/* Toast notification */}
                    {showShareToast && (
                      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-accent-green text-dark-500 text-xs font-bold rounded-lg whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-200">
                        Link copied!
                      </div>
                    )}
                  </button>

                  {/* View Details Button */}
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:border-white/30 transition-all duration-200 group/details"
                    title="View details"
                  >
                    <svg className="w-4 h-4 text-gray-400 group-hover/details:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs font-bold text-gray-400 group-hover/details:text-white">Details</span>
                  </button>
                </div>
              </div>

              {/* Launch Button */}
              <div>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center w-full px-4 py-2.5 text-xs font-bold rounded-lg text-dark-500 ${colors.bg} hover:${colors.shadow} transition-all duration-300 transform hover:scale-105 relative overflow-hidden group/button`}
                >
                  <span className="relative z-10 flex items-center">
                    Launch Tool
                    <svg
                      className="ml-2 w-5 h-5 transform group-hover/button:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-white/20 transform translate-x-[-100%] group-hover/button:translate-x-[100%] transition-transform duration-700"></div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <ToolDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
        description={description}
        url={url}
        thumbnailUrl={thumbnailUrl}
        category={category}
        accentColor={accentColor}
        fullDescription={fullDescription}
        features={features}
      />
    </>
  );
};

export default ToolCard;
