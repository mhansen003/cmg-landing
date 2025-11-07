'use client';

import React, { useState, useEffect } from 'react';
import { Personality } from '@/types/tool';

interface PersonalityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunch: (personalityUrl: string) => void;
  toolTitle: string;
  accentColor?: 'green' | 'blue' | 'purple';
  customColor?: string;
}

const PersonalityModal: React.FC<PersonalityModalProps> = ({
  isOpen,
  onClose,
  onLaunch,
  toolTitle,
  accentColor = 'green',
  customColor,
}) => {
  const [personalities, setPersonalities] = useState<Personality[]>([]);
  const [selectedPersonality, setSelectedPersonality] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use customColor if provided, otherwise fall back to accentColor
  const useCustomColor = !!customColor;
  const effectiveColor = customColor || '#00FF88';

  const accentColors = {
    green: {
      bg: 'bg-accent-green',
      text: 'text-accent-green',
      border: 'border-accent-green',
      hover: 'hover:bg-accent-green',
    },
    blue: {
      bg: 'bg-accent-blue',
      text: 'text-accent-blue',
      border: 'border-accent-blue',
      hover: 'hover:bg-accent-blue',
    },
    purple: {
      bg: 'bg-accent-purple',
      text: 'text-accent-purple',
      border: 'border-accent-purple',
      hover: 'hover:bg-accent-purple',
    },
  };

  const colors = accentColors[accentColor];

  // Fetch personalities when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchPersonalities();
    }
  }, [isOpen]);

  const fetchPersonalities = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/personalities');
      if (!response.ok) {
        throw new Error('Failed to fetch personalities');
      }
      const data = await response.json();
      const personalitiesData = data.personalities || [];
      setPersonalities(personalitiesData);

      // Keep the modal open if no personalities found - show setup prompt
      // (Removed the auto-close behavior)

      // Auto-select first personality if available
      if (personalitiesData.length > 0) {
        setSelectedPersonality(personalitiesData[0].promptUrl);
      }
    } catch (err) {
      console.error('Error fetching personalities:', err);
      // Keep modal open on error - show the empty state with setup option
      setPersonalities([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLaunch = () => {
    if (selectedPersonality) {
      onLaunch(selectedPersonality);
      onClose();
    }
  };

  const handleSetupPersona = () => {
    console.log('[PersonalityModal] Redirecting to persona setup page...');
    // Only open persona setup page
    window.open('https://persona.cmgfinancial.ai/', '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handleLaunchWithoutPersona = () => {
    console.log('[PersonalityModal] Launching tool without persona...');
    // Only launch the tool without persona parameter
    onLaunch('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-gradient-to-br from-dark-300 to-dark-400 rounded-2xl shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header with glow effect */}
        <div className="relative p-6 border-b border-white/10">
          <div
            className="absolute inset-0 opacity-20 blur-2xl"
            style={useCustomColor ? { backgroundColor: effectiveColor } : {}}
          ></div>
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">
                Select Personality
              </h2>
              <p className="text-sm text-gray-400">
                Choose a personality for <span className="font-semibold">{toolTitle}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              title="Close"
            >
              <svg
                className="w-5 h-5 text-gray-400 hover:text-white"
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
        </div>

        {/* Body */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div
                className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 mb-4"
                style={useCustomColor ? { borderColor: effectiveColor } : {}}
              ></div>
              <p className="text-gray-400 text-sm">Loading personalities...</p>
            </div>
          ) : error ? (
            <div className="py-8 text-center">
              <svg
                className="w-12 h-12 text-red-500 mx-auto mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={fetchPersonalities}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm font-semibold text-white"
              >
                Try Again
              </button>
            </div>
          ) : personalities.length === 0 ? (
            <div className="py-6">
              {/* Icon and Message */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    style={useCustomColor ? { color: effectiveColor } : {}}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  No Persona Found
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed px-4">
                  Would you like to set up a persona to improve the behavior of your prompts?
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* Set Up Persona Button - Primary */}
                <button
                  onClick={handleSetupPersona}
                  className="w-full px-6 py-3.5 rounded-xl font-bold text-dark-500 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-2 shadow-lg"
                  style={
                    useCustomColor
                      ? { backgroundColor: effectiveColor, boxShadow: `0 0 20px ${effectiveColor}40` }
                      : {}
                  }
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span>Yes, Set Up Persona</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </button>

                {/* Launch Without Persona Button - Secondary */}
                <button
                  onClick={handleLaunchWithoutPersona}
                  className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 text-white font-semibold flex items-center justify-center space-x-2"
                >
                  <span>No, Launch Tool</span>
                  <svg
                    className="w-4 h-4"
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
                </button>
              </div>
            </div>
          ) : (
            <>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Choose a personality:
              </label>
              <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                {personalities.map((personality) => (
                    <button
                      key={personality.id}
                      onClick={() => setSelectedPersonality(personality.promptUrl)}
                      className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 hover:scale-[1.01] ${
                        selectedPersonality === personality.promptUrl
                          ? 'bg-white/10 shadow-lg'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                      }`}
                      style={
                        selectedPersonality === personality.promptUrl && useCustomColor
                          ? { borderColor: effectiveColor, boxShadow: `0 0 20px ${effectiveColor}40` }
                          : {}
                      }
                    >
                      <div className="flex items-start space-x-5">
                        {/* Icon/Image - Larger showcase */}
                        {(personality.imageUrl || personality.emoji || personality.icon) && (
                          <div className="flex-shrink-0">
                            {personality.imageUrl ? (
                              <img
                                src={personality.imageUrl}
                                alt={personality.name}
                                className="w-20 h-20 rounded-xl object-cover shadow-lg ring-2 ring-white/10"
                              />
                            ) : (
                              <div className="w-20 h-20 flex items-center justify-center text-5xl">
                                {personality.emoji || personality.icon}
                              </div>
                            )}
                          </div>
                        )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-white text-lg truncate">
                            {personality.name}
                          </h3>
                          {selectedPersonality === personality.promptUrl && (
                            <svg
                              className="w-6 h-6 flex-shrink-0 ml-2"
                              style={useCustomColor ? { color: effectiveColor } : {}}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                          {personality.description}
                        </p>
                        {personality.publishedPrompts !== undefined && (
                          <p className="text-xs text-gray-500 mt-2">
                            {personality.publishedPrompts} published prompt{personality.publishedPrompts !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!isLoading && !error && personalities.length > 0 && (
          <div className="p-6 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 text-white font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleLaunch}
              disabled={!selectedPersonality}
              className="px-6 py-3 rounded-lg font-bold text-dark-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={
                useCustomColor
                  ? { backgroundColor: effectiveColor }
                  : {}
              }
            >
              Launch Chatbot
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalityModal;
