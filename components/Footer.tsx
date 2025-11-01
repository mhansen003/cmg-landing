import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-cmg-dark text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-cmg-blue rounded flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold">CMG Tools Hub</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Your central hub for accessing CMG&apos;s suite of tools and applications.
              Designed for CMG employees to streamline workflows and enhance productivity.
            </p>
            <p className="text-gray-400 text-xs">
              3160 CROW CANYON ROAD SUITE 400<br />
              SAN RAMON, CA 94583
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-cmg-blue transition-colors duration-200 text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#tools" className="text-gray-400 hover:text-cmg-blue transition-colors duration-200 text-sm">
                  All Tools
                </Link>
              </li>
              <li>
                <a
                  href="https://www.cmgfi.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cmg-blue transition-colors duration-200 text-sm"
                >
                  CMG Financial
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-cmg-blue transition-colors duration-200 text-sm">
                  Support
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-cmg-blue transition-colors duration-200 text-sm">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-cmg-blue transition-colors duration-200 text-sm">
                  Training
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} CMG Financial. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-cmg-blue transition-colors duration-200">
              <span className="sr-only">Privacy</span>
              <span className="text-sm">Privacy</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-cmg-blue transition-colors duration-200">
              <span className="sr-only">Terms</span>
              <span className="text-sm">Terms</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-cmg-blue transition-colors duration-200">
              <span className="sr-only">Accessibility</span>
              <span className="text-sm">Accessibility</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
