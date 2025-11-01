import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-cmg-blue rounded flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-cmg-dark">CMG</span>
              <span className="text-xl font-normal text-cmg-gray">Tools Hub</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-cmg-gray hover:text-cmg-blue transition-colors duration-200 font-medium">
              Home
            </Link>
            <Link href="#tools" className="text-cmg-gray hover:text-cmg-blue transition-colors duration-200 font-medium">
              Tools
            </Link>
            <Link href="https://www.cmgfi.com" target="_blank" rel="noopener noreferrer" className="text-cmg-gray hover:text-cmg-blue transition-colors duration-200 font-medium">
              CMG Financial
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="flex items-center space-x-4">
            <a
              href="https://www.cmgfi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cmg-blue hover:bg-cmg-darkblue transition-colors duration-200"
            >
              Visit CMG
            </a>

            {/* Mobile menu button */}
            <button className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-cmg-gray hover:text-cmg-blue focus:outline-none">
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
