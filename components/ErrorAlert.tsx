'use client';

import React, { useEffect } from 'react';

interface ErrorAlertProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({
  isOpen,
  onClose,
  title = 'Error',
  message,
}) => {
  // Auto-close after 5 seconds
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Alert Modal */}
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative w-full max-w-md bg-gradient-to-br from-dark-300 to-dark-400 rounded-2xl border-2 border-red-500/50 shadow-2xl pointer-events-auto animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with Icon */}
          <div className="p-6 border-b border-white/10 flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-300 leading-relaxed">{message}</p>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-[0_0_30px_rgba(239,68,68,0.3)]"
            >
              OK
            </button>
          </div>

          {/* Auto-close progress bar */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 rounded-b-2xl overflow-hidden">
            <div
              className="h-full bg-red-500"
              style={{
                animation: 'shrinkWidth 5s linear forwards',
              }}
            />
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes shrinkWidth {
            from { width: 100%; }
            to { width: 0%; }
          }
        `
      }} />
    </>
  );
};

export default ErrorAlert;
