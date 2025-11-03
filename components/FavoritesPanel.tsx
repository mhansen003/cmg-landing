'use client';

import React from 'react';

interface FavoriteTool {
  title: string;
  url: string;
  category: string;
  accentColor?: 'green' | 'blue' | 'purple';
}

interface FavoritesPanelProps {
  favorites: FavoriteTool[];
  isOpen: boolean;
  onToggle: () => void;
  onRemoveFavorite: (title: string) => void;
}

const FavoritesPanel: React.FC<FavoritesPanelProps> = ({
  favorites,
  isOpen,
  onToggle,
  onRemoveFavorite,
}) => {
  const getAccentColorClass = (accentColor?: 'green' | 'blue' | 'purple') => {
    const colors = {
      green: '#00FF88',
      blue: '#00D4FF',
      purple: '#A855F7',
    };
    return colors[accentColor || 'green'];
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-50 bg-gradient-to-r from-accent-green to-accent-blue text-dark-500 font-bold py-6 px-3 rounded-r-xl shadow-neon-green hover:px-4 transition-all duration-300 flex flex-col items-center gap-2"
        title="My Favorites"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span className="text-xs writing-mode-vertical-rl rotate-180">{favorites.length}</span>
      </button>

      {/* Sliding Panel */}
      <div
        className={`fixed left-0 top-0 h-full w-80 bg-dark-500/95 backdrop-blur-xl border-r border-white/10 shadow-2xl z-40 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold gradient-text">My Favorites</h2>
              <button
                onClick={onToggle}
                className="text-gray-400 hover:text-white transition-colors"
                title="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-400">Quick access to your starred tools</p>
          </div>

          {/* Favorites List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {favorites.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <p className="text-gray-400 text-sm">No favorites yet</p>
                <p className="text-gray-500 text-xs mt-2">Click the star icon on any tool video to add it here</p>
              </div>
            ) : (
              favorites.map((tool, index) => (
                <div
                  key={index}
                  className="group relative bg-dark-400/50 rounded-lg border border-white/10 hover:border-white/30 transition-all duration-300 overflow-hidden"
                >
                  {/* Accent gradient */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${getAccentColorClass(tool.accentColor)} 0%, transparent 100%)`
                    }}
                  />

                  <div className="relative p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-white mb-1 truncate group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-accent-green group-hover:to-accent-blue transition-all">
                          {tool.title}
                        </h3>
                        <span className="text-xs text-gray-400">{tool.category}</span>
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveFavorite(tool.title);
                        }}
                        className="flex-shrink-0 text-gray-500 hover:text-red-400 transition-colors"
                        title="Remove from favorites"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>

                    {/* Launch button */}
                    <button
                      onClick={() => window.open(tool.url, '_blank', 'noopener,noreferrer')}
                      className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold rounded-lg text-dark-500 transition-all duration-300 hover:scale-105"
                      style={{ backgroundColor: getAccentColorClass(tool.accentColor) }}
                    >
                      <span>Launch Tool</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default FavoritesPanel;
