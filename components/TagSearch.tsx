'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface TagSearchProps {
  placeholder?: string;
  autoFocus?: boolean;
  initialValue?: string;
}

const TagSearch: React.FC<TagSearchProps> = ({
  placeholder = "Search by tag... (e.g., ai, guidelines, marketing)",
  autoFocus = false,
  initialValue = ''
}) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Fetch all available tags from tools
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/tools?status=all');
        const data = await response.json();

        // Extract unique tags from all tools
        const tagSet = new Set<string>();
        data.tools?.forEach((tool: any) => {
          if (tool.tags && Array.isArray(tool.tags)) {
            tool.tags.forEach((tag: string) => tagSet.add(tag.toLowerCase()));
          }
          // Also include AI-generated tags if they exist
          if (tool.aiGeneratedTags && Array.isArray(tool.aiGeneratedTags)) {
            tool.aiGeneratedTags.forEach((tag: string) => tagSet.add(tag.toLowerCase()));
          }
        });

        setAllTags(Array.from(tagSet).sort());
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, []);

  // Update suggestions based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = allTags.filter(tag => tag.includes(query));
    setSuggestions(filtered.slice(0, 8)); // Limit to 8 suggestions
    setShowSuggestions(filtered.length > 0);
    setSelectedIndex(-1);
  }, [searchQuery, allTags]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (tag?: string) => {
    const searchTerm = tag || searchQuery.trim();
    if (searchTerm) {
      // Navigate to tools page with tag filter
      router.push(`/tools?tag=${encodeURIComponent(searchTerm.toLowerCase())}`);
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0) {
        handleSearch(suggestions[selectedIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (tag: string) => {
    setSearchQuery(tag);
    handleSearch(tag);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => searchQuery && setShowSuggestions(true)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full pl-12 pr-12 py-4 bg-dark-400/50 border-2 border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 transition-all duration-300"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSuggestions([]);
              setShowSuggestions(false);
              inputRef.current?.focus();
            }}
            className="absolute inset-y-0 right-12 flex items-center pr-3 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        <button
          onClick={() => handleSearch()}
          className="absolute inset-y-0 right-0 flex items-center px-4 text-accent-blue hover:text-accent-green transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-2 bg-dark-300 border border-white/10 rounded-xl shadow-2xl overflow-hidden"
        >
          <div className="px-4 py-2 bg-dark-400/50 border-b border-white/10">
            <p className="text-xs text-gray-400 uppercase font-bold">Suggested Tags</p>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {suggestions.map((tag, index) => (
              <button
                key={tag}
                onClick={() => handleSuggestionClick(tag)}
                className={`w-full px-4 py-3 text-left hover:bg-white/5 transition-colors flex items-center space-x-3 ${
                  index === selectedIndex ? 'bg-accent-blue/20 border-l-2 border-accent-blue' : ''
                }`}
              >
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-accent-blue to-accent-green rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{tag}</p>
                </div>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
          <div className="px-4 py-2 bg-dark-400/50 border-t border-white/10">
            <p className="text-xs text-gray-500">
              Press <kbd className="px-1.5 py-0.5 bg-dark-500 rounded">Enter</kbd> to search or use{' '}
              <kbd className="px-1.5 py-0.5 bg-dark-500 rounded">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-dark-500 rounded">↓</kbd> to navigate
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagSearch;
