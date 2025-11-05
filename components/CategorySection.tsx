'use client';

import React, { useRef, useState } from 'react';
import ToolCard from './ToolCard';

interface Tool {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  accentColor?: 'green' | 'blue' | 'purple';
  fullDescription?: string;
  features?: string[];
  upvotes?: number;
  downvotes?: number;
  rating?: number;
  ratingCount?: number;
  tags?: string[];
}

interface CategorySectionProps {
  category: string;
  categoryTools: Tool[];
  categoryIcon: React.ReactNode;
  categoryColor: string;
  onAddTool: (category: string) => void;
  getToolIcon: (category?: string) => React.ReactNode;
  onUpdate?: () => void;
  isAdmin?: boolean;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  categoryTools,
  categoryIcon,
  categoryColor,
  onAddTool,
  getToolIcon,
  onUpdate,
  isAdmin = false,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  // Only show View All button if there are more than 2 cards
  const showViewAllButton = categoryTools.length > 2;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 500; // Scroll by ~1 card width
      const newScrollPosition = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Category Header */}
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          {categoryIcon}
        </div>
        <h3 className="text-2xl font-bold text-white">{category}</h3>
        <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent"></div>
        {showViewAllButton && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 rounded-lg transition-all duration-300"
          >
            <span className="text-sm font-bold text-white">{isExpanded ? 'Collapse' : 'View All'}</span>
            <svg
              className={`w-4 h-4 text-white transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isExpanded ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              )}
            </svg>
          </button>
        )}
      </div>

      {/* Tool Cards Container - Horizontal Scroll or Expanded Grid */}
      {!isExpanded ? (
        /* Horizontal Scrolling View */
        <div className="relative group/scroll border-2 border-white/30 rounded-xl p-6 bg-gradient-to-br from-dark-400/40 to-dark-500/40 shadow-lg">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-dark-500/95 hover:bg-dark-400/95 border-2 border-white/30 rounded-full flex items-center justify-center opacity-0 group-hover/scroll:opacity-100 transition-all duration-300 hover:scale-110 shadow-xl"
            aria-label="Scroll left"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-dark-500/95 hover:bg-dark-400/95 border-2 border-white/30 rounded-full flex items-center justify-center opacity-0 group-hover/scroll:opacity-100 transition-all duration-300 hover:scale-110 shadow-xl"
            aria-label="Scroll right"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Permanent Scroll Indicator on Right */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center space-y-1 pointer-events-none opacity-50 group-hover/scroll:opacity-0 transition-opacity duration-300">
            <svg className="w-5 h-5 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-xs text-white font-medium">Scroll</span>
          </div>

          <div
            ref={scrollRef}
            className="overflow-x-auto overflow-y-hidden pb-4 scroll-smooth scrollbar-visible"
            style={{
              scrollBehavior: 'smooth',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.05)'
            }}
          >
            <div className="flex space-x-6 min-w-max px-2">
              {categoryTools.map((tool, index) => (
                <div key={tool.id || index} className="w-[450px] flex-shrink-0">
                  <ToolCard
                    id={tool.id}
                    title={tool.title}
                    description={tool.description}
                    url={tool.url}
                    category={tool.category}
                    thumbnailUrl={tool.thumbnailUrl}
                    videoUrl={tool.videoUrl}
                    icon={getToolIcon(tool.category)}
                    accentColor={tool.accentColor}
                    categoryColor={categoryColor}
                    fullDescription={tool.fullDescription}
                    features={tool.features}
                    upvotes={tool.upvotes}
                    downvotes={tool.downvotes}
                    rating={tool.rating}
                    ratingCount={tool.ratingCount}
                    onUpdate={onUpdate}
                    isAdmin={isAdmin}
                    tags={tool.tags}
                  />
                </div>
              ))}

              {/* Ghost Tile - Add New Tool */}
              <div className="w-[450px] flex-shrink-0">
                <button
                  onClick={() => onAddTool(category)}
                  className="h-full min-h-[400px] w-full group relative bg-gradient-to-br from-dark-300/50 to-dark-400/50 rounded-xl border-2 border-dashed border-white/20 hover:border-accent-green/50 transition-all duration-300 flex flex-col items-center justify-center space-y-4 hover:scale-[1.02]"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-accent-green/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative w-16 h-16 rounded-2xl bg-white/5 border border-white/20 group-hover:border-accent-green flex items-center justify-center transition-all duration-300">
                      <svg className="w-8 h-8 text-gray-500 group-hover:text-accent-green transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-gray-400 group-hover:text-white transition-colors">Add New Tool</h3>
                    <p className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors mt-1">Contribute to {category}</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Expanded Grid View */
        <div className="border-2 border-white/30 rounded-xl p-6 bg-gradient-to-br from-dark-400/40 to-dark-500/40 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryTools.map((tool, index) => (
              <div key={tool.id || index}>
                <ToolCard
                  id={tool.id}
                  title={tool.title}
                  description={tool.description}
                  url={tool.url}
                  category={tool.category}
                  thumbnailUrl={tool.thumbnailUrl}
                  videoUrl={tool.videoUrl}
                  icon={getToolIcon(tool.category)}
                  accentColor={tool.accentColor}
                  categoryColor={categoryColor}
                  fullDescription={tool.fullDescription}
                  features={tool.features}
                  upvotes={tool.upvotes}
                  downvotes={tool.downvotes}
                  rating={tool.rating}
                  ratingCount={tool.ratingCount}
                  onUpdate={onUpdate}
                  isAdmin={isAdmin}
                  tags={tool.tags}
                />
              </div>
            ))}

            {/* Ghost Tile - Add New Tool */}
            <div>
              <button
                onClick={() => onAddTool(category)}
                className="h-full min-h-[400px] w-full group relative bg-gradient-to-br from-dark-300/50 to-dark-400/50 rounded-xl border-2 border-dashed border-white/20 hover:border-accent-green/50 transition-all duration-300 flex flex-col items-center justify-center space-y-4 hover:scale-[1.02]"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-accent-green/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative w-16 h-16 rounded-2xl bg-white/5 border border-white/20 group-hover:border-accent-green flex items-center justify-center transition-all duration-300">
                    <svg className="w-8 h-8 text-gray-500 group-hover:text-accent-green transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-400 group-hover:text-white transition-colors">Add New Tool</h3>
                  <p className="text-sm text-gray-500 group-hover:text-gray-400 transition-colors mt-1">Contribute to {category}</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySection;
