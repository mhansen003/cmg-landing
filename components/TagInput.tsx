'use client';

import React, { useState, useRef, KeyboardEvent } from 'react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  aiGenerated?: boolean; // Show AI badge on initial tags
  suggestions?: string[]; // Autocomplete suggestions
  maxTags?: number;
  placeholder?: string;
}

const TagInput: React.FC<TagInputProps> = ({
  tags,
  onChange,
  aiGenerated = false,
  suggestions = [],
  maxTags = 10,
  placeholder = 'Add tag (press Enter)',
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter suggestions based on input and exclude already added tags
  const filteredSuggestions = suggestions
    .filter(
      (suggestion) =>
        suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
        !tags.includes(suggestion)
    )
    .slice(0, 5);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (!trimmedTag) return;
    if (tags.length >= maxTags) return;
    if (tags.includes(trimmedTag)) return;

    onChange([...tags, trimmedTag]);
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      // Remove last tag if input is empty
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    addTag(suggestion);
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-2">
      {/* Tag Display */}
      <div className="flex flex-wrap gap-2 p-3 bg-dark-500 border border-white/20 rounded-lg min-h-[50px]">
        {tags.map((tag, index) => (
          <div
            key={`${tag}-${index}`}
            className="group flex items-center space-x-1.5 px-3 py-1.5 bg-accent-green/10 border border-accent-green/30 rounded-full text-sm text-accent-green hover:bg-accent-green/20 transition-colors"
          >
            {aiGenerated && index < tags.length && (
              <span className="px-1.5 py-0.5 bg-accent-blue text-dark-500 rounded text-xs font-bold">
                AI
              </span>
            )}
            <span>{tag}</span>
            <button
              onClick={() => removeTag(tag)}
              className="hover:bg-red-500/20 rounded-full p-0.5 transition-colors"
              title="Remove tag"
            >
              <svg
                className="w-3.5 h-3.5 text-accent-green group-hover:text-red-500 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}

        {/* Input */}
        {tags.length < maxTags && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(inputValue.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-white placeholder-gray-500 text-sm"
            placeholder={tags.length === 0 ? placeholder : ''}
          />
        )}
      </div>

      {/* Tag Count */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>
          {tags.length} / {maxTags} tags
        </span>
        {tags.length >= maxTags && (
          <span className="text-orange-500">Maximum tags reached</span>
        )}
      </div>

      {/* Autocomplete Suggestions */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="p-2 bg-dark-400 border border-white/20 rounded-lg shadow-xl">
          <div className="text-xs text-gray-500 mb-1 px-2">Suggestions:</div>
          <div className="space-y-1">
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/5 rounded transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Helper Text */}
      <p className="text-xs text-gray-500">
        Press <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-xs">Enter</kbd> to add tag •{' '}
        <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-xs">Backspace</kbd> to remove
      </p>
    </div>
  );
};

export default TagInput;
