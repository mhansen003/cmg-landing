import React from 'react';
import Link from 'next/link';

const Header = () => {
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

          {/* CTA Button */}
          <div className="flex items-center space-x-4">
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

            {/* Mobile menu button */}
            <button className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-accent-green focus:outline-none transition-colors duration-200">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
