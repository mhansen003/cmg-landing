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
    Engineering: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    Sales: (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
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
    {
      title: 'AI Chatbots',
      description: 'Access powerful AI chatbots for research, writing, coding, and problem-solving. Multiple models available including GPT-4, Claude, and more.',
      fullDescription: 'The AI Chatbots platform provides access to multiple state-of-the-art language models in one unified interface. Perfect for research, content creation, code generation, data analysis, and complex problem-solving. Switch between different AI models to find the best fit for your task.',
      url: 'https://app-librechat-u2uf7w.azurewebsites.net/c/new',
      category: 'Sales',
      thumbnailUrl: 'https://app-librechat-u2uf7w.azurewebsites.net/api/og',
      accentColor: 'purple',
      features: [
        'Multiple AI models (GPT-4, Claude, Gemini)',
        'Conversation history and management',
        'Code generation and debugging',
        'Research and analysis assistance',
        'Document summarization',
        'Multi-language support',
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

          {/* Tool Cards by Category - Netflix Style */}
          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-green"></div>
              <p className="text-gray-400 mt-4">Loading tools...</p>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Group tools by category */}
              {Object.entries(
                (tools.length > 0 ? tools : fallbackTools).reduce((acc: Record<string, any[]>, tool) => {
                  const category = tool.category || 'Other';
                  if (!acc[category]) acc[category] = [];
                  acc[category].push(tool);
                  return acc;
                }, {})
              ).map(([category, categoryTools]) => (
                <div key={category} className="space-y-4">
                  {/* Category Header */}
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {getToolIcon(category)}
                    </div>
                    <h3 className="text-2xl font-bold text-white">{category}</h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent"></div>
                  </div>

                  {/* Horizontal Scrolling Tool Cards */}
                  <div className="relative group/scroll">
                    <div className="overflow-x-auto overflow-y-hidden scrollbar-hide pb-4">
                      <div className="flex space-x-6 min-w-max px-1">
                        {categoryTools.map((tool, index) => (
                          <div key={tool.id || index} className="w-[450px] flex-shrink-0">
                            <ToolCard
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
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
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
