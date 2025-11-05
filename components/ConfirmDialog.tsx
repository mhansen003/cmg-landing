'use client';

import React, { useState } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (inputValue?: string, checkboxValue?: boolean) => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'red' | 'green' | 'blue';
  isLoading?: boolean;
  showTextInput?: boolean;
  textInputLabel?: string;
  textInputPlaceholder?: string;
  textInputRequired?: boolean;
  requireTextMatch?: string; // Require exact text match for confirmation
  showCheckbox?: boolean;
  checkboxLabel?: string;
  checkboxDefaultChecked?: boolean;
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
  showTextInput = false,
  textInputLabel = '',
  textInputPlaceholder = '',
  textInputRequired = false,
  requireTextMatch = undefined,
  showCheckbox = false,
  checkboxLabel = '',
  checkboxDefaultChecked = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [checkboxValue, setCheckboxValue] = useState(checkboxDefaultChecked);

  if (!isOpen) return null;

  const handleConfirm = () => {
    // Check for required text match
    if (requireTextMatch && inputValue.trim().toLowerCase() !== requireTextMatch.toLowerCase()) {
      return; // Don't confirm if text doesn't match
    }
    // Check for required input
    if (showTextInput && textInputRequired && !inputValue.trim()) {
      return; // Don't confirm if required input is empty
    }
    onConfirm(showTextInput ? inputValue : undefined, showCheckbox ? checkboxValue : undefined);
  };

  const isTextMatchValid = !requireTextMatch || inputValue.trim().toLowerCase() === requireTextMatch.toLowerCase();
  const isInputValid = !textInputRequired || inputValue.trim().length > 0;

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
            <p className="text-gray-300 leading-relaxed mb-4">{message}</p>

            {/* Optional Text Input */}
            {showTextInput && (
              <div className="mt-4">
                {textInputLabel && (
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    {textInputLabel}
                    {(textInputRequired || requireTextMatch) && <span className="text-red-500 ml-1">*</span>}
                  </label>
                )}
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={textInputPlaceholder}
                  className={`w-full px-4 py-3 bg-dark-500 border rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all resize-none ${
                    requireTextMatch
                      ? (isTextMatchValid ? 'border-accent-green' : 'border-red-500')
                      : 'border-white/20 focus:border-accent-green focus:ring-2 focus:ring-accent-green/50'
                  }`}
                  rows={requireTextMatch ? 1 : 4}
                  disabled={isLoading}
                  required={textInputRequired || !!requireTextMatch}
                />
                {requireTextMatch && !isTextMatchValid && inputValue.trim() && (
                  <p className="text-xs text-red-400 mt-1">Please type "{requireTextMatch}" to confirm</p>
                )}
                {requireTextMatch && !inputValue.trim() && (
                  <p className="text-xs text-gray-400 mt-1">Type "{requireTextMatch}" to confirm deletion</p>
                )}
                {textInputRequired && !requireTextMatch && !inputValue.trim() && (
                  <p className="text-xs text-red-400 mt-1">This field is required</p>
                )}
              </div>
            )}

            {/* Optional Checkbox */}
            {showCheckbox && (
              <div className="mt-4">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={checkboxValue}
                    onChange={(e) => setCheckboxValue(e.target.checked)}
                    disabled={isLoading}
                    className="w-5 h-5 bg-dark-500 border-2 border-white/20 rounded text-accent-green focus:ring-2 focus:ring-accent-green/50 focus:ring-offset-0 disabled:opacity-50 cursor-pointer"
                  />
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{checkboxLabel}</span>
                </label>
              </div>
            )}
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
              onClick={handleConfirm}
              disabled={isLoading || (showTextInput && (!isInputValid || !isTextMatchValid))}
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
