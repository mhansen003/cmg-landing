'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminQueueDropdownProps {
  pendingCount: number;
  unpublishedCount: number;
  rejectedCount?: number;
  isOpen: boolean;
  onClose: () => void;
}

const AdminQueueDropdown: React.FC<AdminQueueDropdownProps> = ({
  pendingCount,
  unpublishedCount,
  rejectedCount = 0,
  isOpen,
  onClose,
}) => {
  const router = useRouter();

  const handleNavigate = (view: string) => {
    router.push(`/?view=${view}`);
    onClose();
    // Small delay to ensure navigation completes, then scroll
    setTimeout(() => {
      let sectionId = 'pending-queue';
      if (view === 'unpublished') sectionId = 'unpublished-section';
      if (view === 'rejected') sectionId = 'rejected-tools';

      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Dropdown Menu */}
      <div className="absolute right-0 mt-2 w-80 bg-gradient-to-br from-dark-300 to-dark-400 rounded-xl border border-white/20 shadow-2xl z-50 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500/10 to-gray-500/10 border-b border-white/10 px-4 py-3">
          <h3 className="text-lg font-bold text-white">Admin Queue</h3>
          <p className="text-xs text-gray-400">Review and manage submissions</p>
        </div>

        {/* Queue Items */}
        <div className="p-2">
          {/* Pending Items */}
          {pendingCount > 0 ? (
            <button
              onClick={() => handleNavigate('pending')}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-500/20 border-2 border-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-white">Pending Review</p>
                  <p className="text-xs text-gray-400">{pendingCount} item{pendingCount !== 1 ? 's' : ''} waiting</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-orange-500 text-dark-500 text-xs font-bold rounded">{pendingCount}</span>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-accent-green transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ) : (
            <div className="p-3 rounded-lg bg-white/5">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500/20 border-2 border-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-white">All Caught Up!</p>
                  <p className="text-xs text-gray-400">No pending items</p>
                </div>
              </div>
            </div>
          )}

          {/* Unpublished Items */}
          {unpublishedCount > 0 && (
            <button
              onClick={() => handleNavigate('unpublished')}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors group mt-2"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-500/20 border-2 border-gray-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-white">Unpublished</p>
                  <p className="text-xs text-gray-400">{unpublishedCount} item{unpublishedCount !== 1 ? 's' : ''} hidden</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-gray-500 text-dark-500 text-xs font-bold rounded">{unpublishedCount}</span>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-accent-green transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          )}

          {/* Rejected Items - shown to admins who are also authors */}
          {rejectedCount > 0 && (
            <button
              onClick={() => handleNavigate('rejected')}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors group mt-2"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-500/20 border-2 border-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-white">My Rejected Tools</p>
                  <p className="text-xs text-gray-400">{rejectedCount} item{rejectedCount !== 1 ? 's' : ''} needs revision</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">{rejectedCount}</span>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-accent-green transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 px-4 py-2 bg-white/5">
          <p className="text-xs text-gray-500 text-center">Click an item to review and take action</p>
        </div>
      </div>
    </>
  );
};

export default AdminQueueDropdown;
