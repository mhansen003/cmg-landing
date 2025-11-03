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
  categoryColor?: string; // Hex color for category
  fullDescription?: string;
  features?: string[];
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
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
  categoryColor,
  fullDescription,
  features,
  onToggleFavorite,
  isFavorite = false,
}) => {
  const [votes, setVotes] = useState({ up: 0, down: 0 });
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [showShareToast, setShowShareToast] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // Use categoryColor if provided, otherwise fall back to accentColor
  const useCustomColor = !!categoryColor;
  const customColor = categoryColor || '#00FF88';

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
        <div
          className="absolute -inset-0.5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500"
          style={useCustomColor ? { backgroundColor: customColor + '33' } : {}}
        ></div>

        <div className="relative bg-gradient-to-br from-dark-300 to-dark-400 rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-500 group-hover:scale-[1.01] flex flex-col min-h-[600px]">
          <div className="flex flex-col flex-1">
            {/* Top - Video/Screenshot */}
            <div className="relative bg-dark-500 flex items-center justify-center p-4 h-72 cursor-pointer flex-shrink-0 overflow-hidden" onClick={() => setIsModalOpen(true)}>
              {/* Animated Background */}
              <div className="absolute inset-0 overflow-hidden">
                {/* Animated gradient background - more prominent */}
                <div
                  className="absolute inset-0 opacity-60"
                  style={{
                    background: useCustomColor
                      ? `radial-gradient(circle at 20% 50%, ${customColor}40 0%, transparent 50%),
                         radial-gradient(circle at 80% 50%, ${customColor}30 0%, transparent 50%)`
                      : 'radial-gradient(circle at 20% 50%, rgba(0, 255, 136, 0.25) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(0, 212, 255, 0.2) 0%, transparent 50%)',
                    animation: 'pulse 4s ease-in-out infinite'
                  }}
                />

                {/* Larger gradient orbs */}
                <div
                  className="absolute top-0 left-0 w-32 h-32 rounded-full blur-3xl opacity-40"
                  style={{
                    backgroundColor: useCustomColor ? customColor : '#00FF88',
                    animation: 'float 8s ease-in-out infinite'
                  }}
                />
                <div
                  className="absolute bottom-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-30"
                  style={{
                    backgroundColor: useCustomColor ? customColor : '#00D4FF',
                    animation: 'float 10s ease-in-out infinite 2s'
                  }}
                />

                {/* Grid pattern - more visible */}
                <div
                  className="absolute inset-0 opacity-25"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    animation: 'gridScroll 20s linear infinite'
                  }}
                />

                {/* Diagonal lines for tech feel */}
                <div
                  className="absolute inset-0 opacity-15"
                  style={{
                    backgroundImage: `linear-gradient(45deg, ${useCustomColor ? customColor : '#00FF88'}15 25%, transparent 25%, transparent 75%, ${useCustomColor ? customColor : '#00FF88'}15 75%)`,
                    backgroundSize: '100px 100px',
                    animation: 'diagonalScroll 30s linear infinite'
                  }}
                />

                {/* Floating particles - larger and more visible */}
                <div className="absolute top-1/4 left-1/4 w-3 h-3 rounded-full opacity-40 blur-sm" style={{ backgroundColor: useCustomColor ? customColor : '#00FF88', animation: 'float 6s ease-in-out infinite' }} />
                <div className="absolute top-3/4 right-1/4 w-4 h-4 rounded-full opacity-35 blur-sm" style={{ backgroundColor: useCustomColor ? customColor : '#00D4FF', animation: 'float 8s ease-in-out infinite 1s' }} />
                <div className="absolute top-1/2 right-1/3 w-2.5 h-2.5 rounded-full opacity-30 blur-sm" style={{ backgroundColor: useCustomColor ? customColor : '#00FF88', animation: 'float 7s ease-in-out infinite 2s' }} />
                <div className="absolute top-1/3 right-1/2 w-3 h-3 rounded-full opacity-25 blur-sm" style={{ backgroundColor: useCustomColor ? customColor : '#00D4FF', animation: 'float 9s ease-in-out infinite 3s' }} />
                <div className="absolute bottom-1/4 left-1/3 w-2 h-2 rounded-full opacity-30 blur-sm" style={{ backgroundColor: useCustomColor ? customColor : '#00FF88', animation: 'float 7s ease-in-out infinite 1.5s' }} />
              </div>

              {videoUrl ? (
                <div className="relative w-full h-full rounded-lg overflow-hidden border border-white/10 shadow-2xl group-hover:border-white/20 transition-all duration-500 z-10">
                  <video
                    src={videoUrl}
                    className="w-full h-full object-contain rounded-lg"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                  {/* Favorite Star Button - Top Right */}
                  {onToggleFavorite && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite();
                      }}
                      className="absolute top-3 right-3 w-10 h-10 rounded-full bg-dark-500/90 hover:bg-dark-400/90 border-2 border-white/20 hover:border-white/40 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110 group/star z-40"
                      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <svg
                        className={`w-5 h-5 transition-all duration-300 ${
                          isFavorite
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-400 group-hover/star:text-yellow-400'
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
              <div
                className="absolute top-0 right-0 w-16 h-16 opacity-10 blur-2xl"
                style={useCustomColor ? { backgroundColor: customColor } : {}}
              ></div>
              <div
                className="absolute bottom-0 left-0 w-16 h-16 opacity-10 blur-2xl"
                style={useCustomColor ? { backgroundColor: customColor } : {}}
              ></div>
            </div>

            {/* Bottom - Content */}
            <div className="p-5 flex flex-col justify-between relative z-10 flex-1">
              <div className="flex-1">
                {/* Category Badge and Star Rating */}
                <div className="flex items-center justify-between mb-4">
                  {category && (
                    <span
                      className="px-3 py-1 text-xs font-bold bg-white/5 rounded-full border-2 backdrop-blur-sm"
                      style={useCustomColor ? {
                        color: customColor,
                        borderColor: customColor
                      } : {}}
                    >
                      {category}
                    </span>
                  )}

                  {/* 5-Star Rating */}
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="focus:outline-none transition-transform hover:scale-110 duration-200"
                        title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                      >
                        <svg
                          className="w-5 h-5 transition-colors duration-200"
                          style={{
                            color: star <= (hoverRating || rating)
                              ? (useCustomColor ? customColor : undefined)
                              : '#4B5563'
                          }}
                          fill={star <= (hoverRating || rating) ? 'currentColor' : 'none'}
                          stroke="currentColor"
                          strokeWidth={1.5}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                          />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Icon and Title */}
                <div className="flex items-start space-x-3 mb-3">
                  {icon && (
                    <div className="relative flex-shrink-0">
                      <div
                        className="absolute inset-0 blur-md opacity-50"
                        style={useCustomColor ? { backgroundColor: customColor } : {}}
                      ></div>
                      <div
                        className="relative w-10 h-10 rounded-lg flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                        style={useCustomColor ? { backgroundColor: customColor } : {}}
                      >
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

                </div>
              </div>

              {/* Action Buttons - Learn More and Launch Tool */}
              <div className="grid grid-cols-2 gap-3">
                {/* Learn More Button */}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center justify-center px-4 py-2.5 text-xs font-bold rounded-lg border-2 transition-all duration-300 transform hover:scale-105 group/learn"
                  style={useCustomColor ? {
                    borderColor: customColor,
                    color: customColor
                  } : {}}
                >
                  <span className="flex items-center">
                    <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Learn More
                  </span>
                </button>

                {/* Launch Tool Button */}
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-4 py-2.5 text-xs font-bold rounded-lg text-dark-500 transition-all duration-300 transform hover:scale-105 relative overflow-hidden group/button"
                  style={useCustomColor ? { backgroundColor: customColor } : {}}
                >
                  <span className="relative z-10 flex items-center">
                    Launch Tool
                    <svg
                      className="ml-2 w-4 h-4 transform group-hover/button:translate-x-1 transition-transform duration-300"
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
        videoUrl={videoUrl}
        category={category}
        accentColor={accentColor}
        fullDescription={fullDescription}
        features={features}
        onToggleFavorite={onToggleFavorite}
        isFavorite={isFavorite}
      />
    </>
  );
};

export default ToolCard;
