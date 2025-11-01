import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-dark-400/50 backdrop-blur-xl border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-accent-green blur-md opacity-30"></div>
                <div className="relative w-8 h-8 bg-gradient-to-br from-accent-green to-accent-blue rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-dark-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                </div>
              </div>
              <span className="text-xl font-bold text-white">CMG Tools Hub</span>
            </div>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              Your central hub for accessing CMG&apos;s suite of tools and applications.
              Designed for CMG employees to streamline workflows and enhance productivity.
            </p>
            <div className="text-gray-500 text-xs space-y-1">
              <p className="font-semibold text-gray-400">CMG FINANCIAL</p>
              <p>3160 CROW CANYON ROAD SUITE 400</p>
              <p>SAN RAMON, CA 94583</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-accent-green transition-colors duration-200 text-sm flex items-center group">
                  <span className="w-1 h-1 bg-accent-green rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link href="#tools" className="text-gray-400 hover:text-accent-green transition-colors duration-200 text-sm flex items-center group">
                  <span className="w-1 h-1 bg-accent-green rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  All Tools
                </Link>
              </li>
              <li>
                <a
                  href="https://www.cmgfi.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-accent-green transition-colors duration-200 text-sm flex items-center group"
                >
                  <span className="w-1 h-1 bg-accent-green rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  CMG Financial
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-accent-green transition-colors duration-200 text-sm flex items-center group">
                  <span className="w-1 h-1 bg-accent-green rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Support
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-accent-green transition-colors duration-200 text-sm flex items-center group">
                  <span className="w-1 h-1 bg-accent-green rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-accent-green transition-colors duration-200 text-sm flex items-center group">
                  <span className="w-1 h-1 bg-accent-green rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Training
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} CMG Financial. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-accent-green transition-colors duration-200">
              <span className="text-xs">Privacy</span>
            </a>
            <a href="#" className="text-gray-500 hover:text-accent-green transition-colors duration-200">
              <span className="text-xs">Terms</span>
            </a>
            <a href="#" className="text-gray-500 hover:text-accent-green transition-colors duration-200">
              <span className="text-xs">Accessibility</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
