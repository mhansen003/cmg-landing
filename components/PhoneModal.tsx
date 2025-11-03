'use client';

import React from 'react';

interface PhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  phoneNumber: string;
  accentColor?: 'green' | 'blue' | 'purple' | 'orange';
}

const PhoneModal: React.FC<PhoneModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  phoneNumber,
  accentColor = 'purple',
}) => {
  if (!isOpen) return null;

  const accentColors = {
    green: {
      border: 'border-accent-green',
      bg: 'bg-accent-green',
      text: 'text-accent-green',
      glow: 'shadow-[0_0_30px_rgba(0,255,136,0.3)]',
    },
    blue: {
      border: 'border-accent-blue',
      bg: 'bg-accent-blue',
      text: 'text-accent-blue',
      glow: 'shadow-[0_0_30px_rgba(0,212,255,0.3)]',
    },
    purple: {
      border: 'border-accent-purple',
      bg: 'bg-accent-purple',
      text: 'text-accent-purple',
      glow: 'shadow-[0_0_30px_rgba(168,85,247,0.3)]',
    },
    orange: {
      border: 'border-[#FF6B35]',
      bg: 'bg-[#FF6B35]',
      text: 'text-[#FF6B35]',
      glow: 'shadow-[0_0_30px_rgba(255,107,53,0.3)]',
    },
  };

  const colors = accentColors[accentColor];

  // Format phone number for display (949) 785-4613
  const formattedPhone = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

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
          className="relative w-full max-w-2xl bg-gradient-to-br from-dark-300 to-dark-400 rounded-2xl border border-white/20 shadow-2xl pointer-events-auto animate-in zoom-in-95 duration-300 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Animated Background Effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20"
              style={{ backgroundColor: accentColor === 'orange' ? '#FF6B35' : undefined }}
            />
            <div
              className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-20"
              style={{ backgroundColor: accentColor === 'orange' ? '#FF6B35' : undefined }}
            />
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all duration-200 group"
          >
            <svg className="w-5 h-5 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div className="relative p-12 text-center">
            {/* Phone Icon */}
            <div className="flex justify-center mb-6">
              <div className={`relative w-24 h-24 rounded-full ${colors.bg} ${colors.glow} flex items-center justify-center animate-pulse`}>
                <svg className="w-12 h-12 text-dark-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>

            {/* Description */}
            <p className="text-gray-400 text-base mb-8 max-w-lg mx-auto">
              {description}
            </p>

            {/* Call to Action */}
            <div className="space-y-4">
              <p className="text-sm font-bold text-white uppercase tracking-wider">
                Call now to try out the agent
              </p>

              {/* Phone Number Display */}
              <div className={`inline-block px-8 py-4 bg-white/5 border-2 ${colors.border} rounded-xl ${colors.glow}`}>
                <a
                  href={`tel:${phoneNumber}`}
                  className={`text-4xl font-bold ${colors.text} hover:scale-105 transition-transform duration-200 inline-block`}
                >
                  {formattedPhone}
                </a>
              </div>

              {/* Call Button for Mobile */}
              <div className="pt-4">
                <a
                  href={`tel:${phoneNumber}`}
                  className={`inline-flex items-center px-8 py-4 text-lg font-bold rounded-xl text-dark-500 ${colors.bg} hover:scale-105 transition-all duration-300 ${colors.glow}`}
                >
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Now
                </a>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-xs text-gray-500">
                Available 24/7 • AI-powered assistance • Natural voice conversation
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PhoneModal;
