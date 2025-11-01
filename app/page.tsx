'use client';

import React, { useState, useEffect } from 'react';
import ToolCard from '@/components/ToolCard';
import AddToolWizard from '@/components/AddToolWizard';

// Helper function to get icon for a tool based on category
const getToolIcon = (category?: string) => {
  const icons: Record<string, React.ReactNode> = {
    Operations: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    Marketing: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    default: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  };
  return icons[category || 'default'] || icons.default;
};

export default function Home() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [tools, setTools] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch tools from API on mount
  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await fetch('/api/tools');
        const data = await response.json();
        setTools(data.tools || []);
      } catch (error) {
        console.error('Error fetching tools:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTools();
  }, []);

  // Fallback tools if loading or empty (icons added dynamically in render)
  const fallbackTools = [
    {
      title: 'Change Management Intake',
      description: 'Streamline your application intake process with our AI-powered change management system. Submit requests, track progress, and automatically route to the right teams.',
      fullDescription: 'The Change Management Intake system revolutionizes how CMG handles internal requests, feature changes, and support tickets. Using advanced AI technology, it automatically categorizes submissions, routes them to the appropriate teams, and pre-fills change management forms. This dramatically reduces processing time and ensures every request gets the attention it deserves.',
      url: 'https://intake.cmgfinancial.ai/',
      category: 'Operations',
      thumbnailUrl: 'https://intake.cmgfinancial.ai/api/og',
      accentColor: 'green',
      features: [
        'AI-powered request analysis and categorization',
        'Automatic routing to appropriate teams',
        'Smart form pre-filling based on request content',
        'Real-time status tracking and notifications',
        'Integration with Azure DevOps',
        'Document and screenshot attachment support',
      ],
    },
    {
      title: 'Communications Builder',
      description: 'Create professional communications, training materials, and release notes with AI assistance. Generate multiple output formats from a single input.',
      fullDescription: 'The Communications Builder empowers teams to create comprehensive, professional documentation with minimal effort. Simply describe your feature or change, upload screenshots, and let AI generate perfectly formatted release notes, training guides, email announcements, FAQ documents, and quick reference cards - all from a single input.',
      url: 'https://trainbuilder.cmgfinancial.ai/',
      category: 'Marketing',
      thumbnailUrl: 'https://trainbuilder.cmgfinancial.ai/api/og',
      videoUrl: '/videos/communications-builder-demo.mp4',
      accentColor: 'blue',
      features: [
        'Multi-format output generation (Release Notes, Training Guides, FAQs)',
        'AI-powered content creation and formatting',
        'Screenshot and document integration',
        'Professional email templates',
        'Quick reference card generation',
        'Consistent branding across all materials',
      ],
    },
  ];

  const handleAddTool = async (toolData: any) => {
    try {
      // Save tool to API
      const response = await fetch('/api/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: toolData.title,
          description: toolData.description,
          fullDescription: toolData.fullDescription,
          url: toolData.url,
          category: toolData.category,
          thumbnailUrl: toolData.thumbnailUrl,
          videoUrl: toolData.videoUrl,
          accentColor: toolData.accentColor || 'green',
          features: toolData.features,
        }),
      });

      if (!response.ok) throw new Error('Failed to add tool');

      const data = await response.json();

      // Add new tool to local state
      setTools(prev => [...prev, data.tool]);
    } catch (error) {
      console.error('Error adding tool:', error);
      alert('Failed to add tool. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-dark-500">
      {/* Tools Dashboard Section */}
      <section id="tools" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Your Tools <span className="gradient-text">Dashboard</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Access all of your essential tools in one place. Click on any tool to launch it in a new window.
            </p>
          </div>

          {/* Tool Cards Grid */}
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-green"></div>
              <p className="text-gray-400 mt-4">Loading tools...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {(tools.length > 0 ? tools : fallbackTools).map((tool, index) => (
                <ToolCard
                  key={tool.id || index}
                  title={tool.title}
                  description={tool.description}
                  url={tool.url}
                  category={tool.category}
                  thumbnailUrl={tool.thumbnailUrl}
                  videoUrl={tool.videoUrl}
                  icon={getToolIcon(tool.category)}
                  accentColor={tool.accentColor}
                  fullDescription={tool.fullDescription}
                  features={tool.features}
                />
              ))}
            </div>
          )}

          {/* Coming Soon Section */}
          <div className="mt-20 text-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-accent-purple/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-gradient-to-br from-dark-300 to-dark-400 rounded-2xl p-12 border border-white/10 group-hover:border-accent-purple transition-all duration-500">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-accent-purple/10 border border-accent-purple/30 mb-6">
                  <svg className="w-10 h-10 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white mb-3">More Tools Coming Soon</h3>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                  We&apos;re constantly expanding our suite of tools. Check back regularly for new additions and exciting features!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-green/10 via-transparent to-accent-blue/10"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-green/10 border border-accent-green/30 mb-6">
            <svg className="w-8 h-8 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Need Help?</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            If you have questions about any of our tools or need technical support, our team is here to help.
          </p>
          <a
            href="mailto:support@cmgfinancial.com"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-xl text-dark-500 bg-gradient-to-r from-accent-green to-accent-blue hover:shadow-neon-green transition-all duration-300 transform hover:scale-105"
          >
            Contact Support
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </a>
        </div>
      </section>

      {/* Floating Add Tool Button */}
      <button
        onClick={() => setIsWizardOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-accent-green to-accent-blue rounded-full shadow-neon-green hover:scale-110 transition-all duration-300 z-40 flex items-center justify-center group"
        title="Add New Tool"
      >
        <svg className="w-8 h-8 text-dark-500 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>

      {/* Add Tool Wizard */}
      <AddToolWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSubmit={handleAddTool}
      />
    </div>
  );
}
