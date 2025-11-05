'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import TagSearch from '@/components/TagSearch';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-dark-500">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Enhanced Purple Gradient Background - More Dramatic */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Main purple glow from bottom */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(139, 92, 246, 0.6), rgba(99, 102, 241, 0.4) 40%, rgba(59, 130, 246, 0.2) 60%, transparent 80%)',
            }}
          ></div>
          {/* Additional pink/purple accent glow */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 60% 40% at 30% 80%, rgba(168, 85, 247, 0.4), transparent 60%)',
            }}
          ></div>
          {/* Blue accent glow on right side */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 60% 40% at 70% 80%, rgba(59, 130, 246, 0.3), transparent 60%)',
            }}
          ></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Hero Heading */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
            Amplify your{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 bg-clip-text text-transparent">
              clarity
            </span>
            <br />
            with AI Tools
          </h1>

          {/* Hero Subheading */}
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-12">
            With CMG AI Tools you can turn prospects into applications with on-brand emails, ads, and scripts built in seconds so you book more calls and close more loans.
          </p>

          {/* Tag Search Component */}
          <div className="mb-12">
            <TagSearch
              placeholder="Search by tag... (e.g., ai, guidelines, marketing, voice)"
              autoFocus={false}
            />
            <p className="mt-4 text-sm text-gray-500">
              Try searching: <button onClick={() => router.push('/tools?tag=guidelines')} className="text-accent-blue hover:text-accent-green transition-colors">guidelines</button>,{' '}
              <button onClick={() => router.push('/tools?tag=ai')} className="text-accent-blue hover:text-accent-green transition-colors">ai</button>,{' '}
              <button onClick={() => router.push('/tools?tag=marketing')} className="text-accent-blue hover:text-accent-green transition-colors">marketing</button>,{' '}
              <button onClick={() => router.push('/tools?tag=voice')} className="text-accent-blue hover:text-accent-green transition-colors">voice</button>
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => router.push('/tools')}
              className="group relative px-8 py-4 bg-gradient-to-r from-accent-blue to-accent-green text-dark-500 font-bold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-neon-blue"
            >
              <span className="relative z-10">Explore CMG Tools</span>
              <div className="absolute inset-0 bg-gradient-to-r from-accent-green to-accent-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            <a
              href="https://www.cmgfi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-8 py-4 bg-transparent border-2 border-white/20 text-white font-bold rounded-xl hover:bg-white/5 hover:border-accent-blue transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              <span>Learn More</span>
            </a>
          </div>
        </div>

        {/* Decorative Grid Lines (Optional) */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
              backgroundSize: '100px 100px',
            }}
          ></div>
        </div>
      </section>

      {/* Powered By Section */}
      <section className="py-16 bg-dark-400/50 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-white mb-8">
            Powered by the world's top models
          </h2>
          <div className="flex items-center justify-center space-x-12 opacity-60">
            <div className="text-gray-400 text-4xl font-bold">OpenAI</div>
            <div className="text-gray-400 text-4xl font-bold">Claude</div>
            <div className="text-gray-400 text-4xl font-bold">Gemini</div>
          </div>
        </div>
      </section>

      {/* Quick Categories Section */}
      <section className="py-20 bg-dark-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Explore by Category</h2>
            <p className="text-lg text-gray-400">Browse our curated collection of AI tools</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* CMG Product */}
            <button
              onClick={() => router.push('/tools')}
              className="group p-6 bg-gradient-to-br from-dark-300 to-dark-400 rounded-xl border border-white/10 hover:border-accent-green/50 transition-all duration-300 hover:scale-105"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-accent-green to-accent-blue rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent-green transition-colors">CMG Products</h3>
              <p className="text-sm text-gray-400">Internal tools and applications</p>
            </button>

            {/* Sales AI Agents */}
            <button
              onClick={() => router.push('/tools')}
              className="group p-6 bg-gradient-to-br from-dark-300 to-dark-400 rounded-xl border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">Sales AI Agents</h3>
              <p className="text-sm text-gray-400">AI-powered sales assistance</p>
            </button>

            {/* Operations */}
            <button
              onClick={() => router.push('/tools')}
              className="group p-6 bg-gradient-to-br from-dark-300 to-dark-400 rounded-xl border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:scale-105"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Operations</h3>
              <p className="text-sm text-gray-400">Workflow and process tools</p>
            </button>

            {/* Training */}
            <button
              onClick={() => router.push('/tools')}
              className="group p-6 bg-gradient-to-br from-dark-300 to-dark-400 rounded-xl border border-white/10 hover:border-yellow-500/50 transition-all duration-300 hover:scale-105"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">Training</h3>
              <p className="text-sm text-gray-400">Learning and development</p>
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Footer - Matching Showroom Design */}
      <footer className="relative bg-gradient-to-b from-dark-500 to-dark-400 border-t border-white/10 overflow-hidden">
        {/* Diagonal line pattern background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 50px, rgba(255,255,255,0.05) 50px, rgba(255,255,255,0.05) 51px)',
            }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Left Column - Brand */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-accent-blue to-accent-green rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-dark-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">CMG//Agentic</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Empowering loan officers with purpose-built AI agents. Secure, compliant, and ready for enterprise deployment.
              </p>
            </div>

            {/* Middle Column - Compliance & Security */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Compliance & Security</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-accent-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>SOC 2 Type II Certified</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-accent-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>GDPR & CCPA Compliant</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-accent-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Enterprise SSO Integration</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-accent-green flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>End-to-End Encryption</span>
                </li>
              </ul>
            </div>

            {/* Right Column - AI Summit Demo */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">AI Summit Demo</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                Experience the future of AI-powered loan origination. See how our agents transform workflows in real-time.
              </p>
              <a
                href="https://www.cmgfi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-gradient-to-r from-accent-blue to-purple-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
              >
                Schedule Demo
              </a>
            </div>
          </div>

          {/* Bottom Copyright Bar */}
          <div className="pt-8 border-t border-white/10">
            <div className="text-center text-gray-500 text-sm">
              <p>
                &copy; 2025 CMG Financial Services. All rights reserved. |{' '}
                <a href="#" className="hover:text-accent-blue transition-colors">Privacy Policy</a> |{' '}
                <a href="#" className="hover:text-accent-blue transition-colors">Terms of Service</a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
