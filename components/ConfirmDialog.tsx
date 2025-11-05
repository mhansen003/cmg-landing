'use client';

import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'red' | 'green' | 'blue';
  isLoading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'green',
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const colorClasses = {
    red: 'bg-red-500 hover:bg-red-600 shadow-[0_0_30px_rgba(239,68,68,0.3)]',
    green: 'bg-accent-green hover:bg-accent-green/90 shadow-[0_0_30px_rgba(0,255,136,0.3)]',
    blue: 'bg-accent-blue hover:bg-accent-blue/90 shadow-[0_0_30px_rgba(0,212,255,0.3)]',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] animate-in fade-in duration-200"
        onClick={isLoading ? undefined : onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative w-full max-w-md bg-gradient-to-br from-dark-300 to-dark-400 rounded-2xl border-2 border-white/20 shadow-2xl pointer-events-auto animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <h3 className="text-2xl font-bold text-white">{title}</h3>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-300 leading-relaxed">{message}</p>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 flex items-center justify-end space-x-4">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-6 py-3 text-dark-500 font-bold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 ${colorClasses[confirmColor]}`}
            >
              {isLoading && (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              <span>{confirmText}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmDialog;
