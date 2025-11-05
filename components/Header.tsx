'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ConfirmDialog from './ConfirmDialog';
import ErrorAlert from './ErrorAlert';
import AdminQueueDropdown from './AdminQueueDropdown';

interface UserSession {
  email: string;
  isAdmin: boolean;
}

interface HeaderProps {
  pendingCount?: number;
  unpublishedCount?: number;
  rejectedCount?: number;
}

const Header: React.FC<HeaderProps> = ({ pendingCount = 0, unpublishedCount = 0, rejectedCount = 0 }) => {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch user session on mount
  useEffect(() => {
    fetchUserSession();
  }, []);

  const fetchUserSession = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();

      if (data.authenticated && data.user) {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Failed to fetch user session:', error);
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        setUser(null);
        setShowLogoutConfirm(false);
        // Redirect to login page
        router.push('/login');
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      setErrorMessage('Failed to logout. Please try again.');
      setShowError(true);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="bg-dark-400/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-accent-green blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-accent-green to-accent-blue rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-dark-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold text-white">CMG</span>
                <span className="text-xl font-light text-gray-400 ml-2">Tools</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/"
              className="text-gray-400 hover:text-accent-green transition-colors duration-200 font-medium relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-green group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="#tools"
              className="text-gray-400 hover:text-accent-green transition-colors duration-200 font-medium relative group"
            >
              Tools
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-green group-hover:w-full transition-all duration-300"></span>
            </Link>
            <a
              href="https://www.cmgfi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-accent-green transition-colors duration-200 font-medium relative group"
            >
              CMG Financial
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent-green group-hover:w-full transition-all duration-300"></span>
            </a>
          </nav>

          {/* User Section / CTA Button */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* User Info with Admin Queue Dropdown or Rejected Tools Link */}
                <div className="relative">
                  <button
                    onClick={() => {
                      if (user.isAdmin) {
                        setIsDropdownOpen(!isDropdownOpen);
                      } else if (rejectedCount > 0) {
                        router.push('/tools?view=rejected');
                      }
                    }}
                    className={`hidden sm:flex items-center space-x-3 px-4 py-2 bg-white/5 border border-white/10 rounded-lg ${
                      user.isAdmin || rejectedCount > 0 ? 'cursor-pointer hover:bg-white/10 transition-colors' : 'cursor-default'
                    }`}
                    title={!user.isAdmin && rejectedCount > 0 ? 'View your rejected tools' : undefined}
                  >
                    <div className="flex flex-col items-end">
                      <span className="text-sm text-white font-medium">{user.email}</span>
                      {user.isAdmin ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-accent-green">Admin</span>
                          {(pendingCount > 0 || unpublishedCount > 0 || rejectedCount > 0) && (
                            <span className="px-1.5 py-0.5 bg-orange-500 text-white text-xs font-bold rounded">
                              {pendingCount + unpublishedCount + rejectedCount}
                            </span>
                          )}
                        </div>
                      ) : (
                        rejectedCount > 0 && (
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-red-500">Rejected Tools</span>
                            <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs font-bold rounded">
                              {rejectedCount}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-br from-accent-green to-accent-blue rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-dark-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </button>

                  {/* Admin Queue Dropdown */}
                  {user.isAdmin && (
                    <AdminQueueDropdown
                      pendingCount={pendingCount}
                      unpublishedCount={unpublishedCount}
                      rejectedCount={rejectedCount}
                      isOpen={isDropdownOpen}
                      onClose={() => setIsDropdownOpen(false)}
                    />
                  )}
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogoutClick}
                  disabled={isLoggingOut}
                  className="inline-flex items-center px-4 py-2.5 text-sm font-semibold rounded-lg text-white bg-red-500/20 border border-red-500/50 hover:bg-red-500/30 hover:border-red-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Logout"
                >
                  {isLoggingOut ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline">Logging out...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span className="hidden sm:inline">Logout</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <a
                href="https://www.cmgfi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center px-5 py-2.5 text-sm font-semibold rounded-lg text-dark-500 bg-gradient-to-r from-accent-green to-accent-blue hover:shadow-neon-green transition-all duration-300 transform hover:scale-105"
              >
                Visit CMG
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            )}

            {/* Mobile menu button */}
            <button className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-accent-green focus:outline-none transition-colors duration-200">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogoutConfirm}
        title="Confirm Logout"
        message="Are you sure you want to logout? You will need to login again to access the tools."
        confirmText="Yes, Logout"
        cancelText="Cancel"
        confirmColor="red"
        isLoading={isLoggingOut}
      />

      {/* Error Alert */}
      <ErrorAlert
        isOpen={showError}
        onClose={() => setShowError(false)}
        message={errorMessage}
      />
    </header>
  );
};

export default Header;
