'use client';

import React, { useState, useEffect } from 'react';
import ToolCard from '@/components/ToolCard';
import AddToolWizard from '@/components/AddToolWizard';
import CategorySection from '@/components/CategorySection';

// Helper function to get icon for a tool based on category
const getToolIcon = (category?: string) => {
  const icons: Record<string, React.ReactNode> = {
    'CMG Product': (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
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
    'Sales AI Agents': (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
    ),
    'Sales Voice Agents': (
      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
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
  const [prefilledCategory, setPrefilledCategory] = useState<string | null>(null);
  const [tools, setTools] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryColors, setCategoryColors] = useState<Record<string, string>>({
    'CMG Product': '#00FF88',
    'Sales AI Agents': '#A855F7',
    'Sales Voice Agents': '#FF6B35',
    'Operations': '#00D4FF',
    'Marketing': '#FB923C',
    'Engineering': '#06B6D4',
  });

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
      category: 'CMG Product',
      videoUrl: '/videos/change-management-intake-demo.mp4',
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
      category: 'CMG Product',
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
      title: 'Document Classification',
      description: 'AI-powered document management automation for CLEAR Docs. Automatically classify, split, and organize mortgage documents with intelligent automation.',
      fullDescription: 'The Document Classification system introduces AI into CLEAR Docs to automate and improve document management tasks. Using Gemini AI, it intelligently classifies and splits bulk document packages, automatically organizing them by type (CRED, INC, ASSET, PROP) and reducing the need for manual review. Perfect for mortgage document processing workflows.',
      url: 'https://cleardocs.cmgfinancial.ai/',
      category: 'CMG Product',
      videoUrl: '/videos/document-classification-demo.mp4',
      accentColor: 'purple',
      features: [
        'AI-powered document intelligent automation',
        'Flexible uploads: single or bulk document packages',
        'Smart splitting: automatic document separation',
        'Real-time user notifications via UI refresh',
        'Integration with CLEAR Docs drop zone',
        'Automatic categorization (CRED, INC, ASSET, PROP)',
      ],
    },
    {
      title: 'CMG DocuMind',
      description: 'The future of mortgage document processing. Review loans, extract data automatically, and assign AI agents to fix document problems with intelligent automation.',
      fullDescription: 'CMG DocuMind revolutionizes mortgage document processing with cutting-edge AI technology. Instantly review complete loan files, automatically extract critical data points, identify missing or problematic documents, and assign specialized AI agents to resolve issues. DocuMind reduces processing time from hours to minutes while improving accuracy and compliance. The intelligent system learns from each loan, continuously improving its document understanding and problem-solving capabilities.',
      url: 'https://cmg-docu-mind.vercel.app/',
      category: 'CMG Product',
      videoUrl: '/videos/cmg-documind-demo.mp4',
      accentColor: 'blue',
      features: [
        'Complete loan file review and analysis',
        'Automatic data extraction from documents',
        'AI-powered problem detection',
        'Intelligent agent assignment for issue resolution',
        'Real-time processing status tracking',
        'Continuous learning and improvement',
      ],
    },
    {
      title: 'Bank Statement Analyzer',
      description: 'AI-powered income verification at your fingertips. Upload bank statements and get automatic transaction analysis, recurring deposit identification, and qualifying income calculations.',
      fullDescription: 'Meet your Bank Statement Analyzer—AI-powered income verification at your fingertips. Automatically extracts transaction data, identifies recurring deposits, flags compliance concerns, and calculates qualifying income using agency guidelines. Whether it\'s self-employed borrowers or complex income scenarios, get accurate analysis and actionable recommendations instantly. Smart underwriting made simple.',
      url: 'https://app-librechat-u2uf7w.azurewebsites.net/c/new?spec=Bank+Statement+Analyzer',
      category: 'Sales AI Agents',
      videoUrl: '/videos/bank-statement-analyzer-demo.mp4',
      accentColor: 'green',
      features: [
        'Automatic transaction data extraction',
        'Recurring deposit identification',
        'Compliance concern flagging',
        'Qualifying income calculation using agency guidelines',
        'Self-employed borrower income analysis',
        'Actionable recommendations for complex scenarios',
      ],
    },
    {
      title: 'Construction Guidelines Assistant',
      description: 'Your construction loan expert on demand. Get instant answers about construction-to-perm guidelines, draw schedules, builder requirements, and budget specifications.',
      fullDescription: 'Navigate construction loan complexity with confidence. The Construction Guidelines Assistant provides instant answers to construction-to-perm scenarios, draw schedules, inspection requirements, builder qualifications, and budget guidelines. Whether you\'re handling new construction, major renovations, or lot-land transactions, get accurate CMG construction policy guidance instantly. Your construction loan expert, always available.',
      url: 'https://app-librechat-u2uf7w.azurewebsites.net/c/new?spec=Construction+Guidelines+Assistant',
      category: 'Sales AI Agents',
      videoUrl: '/videos/construction-guidelines-demo.mp4',
      accentColor: 'purple',
      features: [
        'Construction-to-perm guideline expertise',
        'Draw schedule and inspection requirements',
        'Builder qualification specifications',
        'Budget and cost breakdown guidance',
        'New construction and renovation scenarios',
        'Lot-land transaction policy guidance',
      ],
    },
    {
      title: 'Jumbo Guidelines Assistant',
      description: 'Your on-demand guideline expert. Get instant answers to loan scenario questions with intelligent chat combining Fannie, Freddie, and CMG overlays.',
      fullDescription: 'Tired of guideline hunting? The Jumbo Guidelines Assistant combines Fannie, Freddie, and CMG overlays in one intelligent chat. Ask any loan scenario question and get clear answers instantly. Whether it\'s DTI limits, credit requirements, or product eligibility—you\'ll have the right information for every borrower conversation. Your guideline expert, on demand.',
      url: 'https://app-librechat-u2uf7w.azurewebsites.net/c/new?spec=Jumbo+Guidelines+Assistant',
      category: 'Sales AI Agents',
      videoUrl: '/videos/jumbo-guidelines-demo.mp4',
      accentColor: 'blue',
      features: [
        'Combined Fannie, Freddie, and CMG overlay guidelines',
        'Instant answers to loan scenario questions',
        'DTI limits and qualification guidance',
        'Credit requirement specifications',
        'Product eligibility information',
        'On-demand guideline expertise for borrower conversations',
      ],
    },
    {
      title: 'Non-QM Guidelines Assistant',
      description: 'Expert guidance for Non-QM loan scenarios. Get instant answers about alternative documentation, credit flexibility, and specialized underwriting requirements.',
      fullDescription: 'Navigate the Non-QM landscape with confidence using the Non-QM Guidelines Assistant. This specialized tool provides expert guidance on alternative documentation requirements, credit flexibility options, debt-to-income considerations, and asset-based qualification strategies. Perfect for self-employed borrowers, foreign nationals, and unique income scenarios that fall outside conventional guidelines.',
      url: 'https://app-librechat-u2uf7w.azurewebsites.net/c/new?spec=Non-QM+Guidelines+Assistant',
      category: 'Sales AI Agents',
      videoUrl: '/videos/non-qm-guidelines-demo.mp4',
      accentColor: 'green',
      features: [
        'Alternative documentation strategies',
        'Credit flexibility and exception guidance',
        'Debt-to-income calculation methods',
        'Asset-based qualification scenarios',
        'Self-employed borrower solutions',
        'Foreign national lending requirements',
      ],
    },
    {
      title: 'VA Guidelines Assistant',
      description: 'Specialized guidance for VA loan scenarios. Get instant answers about VA eligibility, funding fees, occupancy requirements, and veteran-specific lending guidelines.',
      fullDescription: 'Navigate VA loans with confidence using the VA Guidelines Assistant. This specialized tool provides expert guidance on VA eligibility requirements, Certificate of Eligibility (COE) verification, funding fee calculations, occupancy and residual income requirements, and property condition standards. Perfect for helping veterans, active-duty service members, and eligible spouses achieve homeownership through their VA benefits.',
      url: 'https://app-librechat-u2uf7w.azurewebsites.net/c/new?spec=VA+Guidelines+Assistant',
      category: 'Sales AI Agents',
      accentColor: 'purple',
      features: [
        'VA eligibility and entitlement guidance',
        'Certificate of Eligibility (COE) assistance',
        'Funding fee calculation and exemptions',
        'Residual income requirement analysis',
        'Occupancy and property condition standards',
        'Benefits for veterans and active-duty service members',
      ],
    },
    {
      title: 'AI Chatbots',
      description: 'Access powerful AI chatbots for research, writing, coding, and problem-solving. Multiple models available including GPT-4, Claude, and more.',
      fullDescription: 'The AI Chatbots platform provides access to multiple state-of-the-art language models in one unified interface. Perfect for research, content creation, code generation, data analysis, and complex problem-solving. Switch between different AI models to find the best fit for your task.',
      url: 'https://app-librechat-u2uf7w.azurewebsites.net/c/new',
      category: 'Sales AI Agents',
      videoUrl: '/videos/ai-chatbots-demo.mp4',
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
    {
      title: 'Agentic LO Voice Agent',
      description: 'Your AI-powered loan officer assistant available 24/7 via phone. Call anytime to get instant answers about loan products, rates, and qualification requirements.',
      fullDescription: 'Meet your Agentic LO Voice Agent—an intelligent AI assistant that understands mortgage lending inside and out. Simply call (949) 785-4613 and speak naturally about your loan scenarios, product questions, or borrower situations. The AI agent provides instant, accurate guidance on rates, programs, qualification criteria, and next steps. Available 24/7 with human-like conversation and deep mortgage expertise.',
      url: 'tel:+19497854613',
      category: 'Sales Voice Agents',
      videoUrl: '/videos/lo-voice-agent-demo.mp4',
      accentColor: 'purple',
      features: [
        '24/7 availability via phone call',
        'Natural voice conversation with AI',
        'Instant loan product recommendations',
        'Rate and program information',
        'Qualification requirement guidance',
        'Human-like interaction and understanding',
      ],
    },
  ];

  const handleOpenWizard = (category?: string) => {
    setPrefilledCategory(category || null);
    setIsWizardOpen(true);
  };

  const handleCloseWizard = () => {
    setIsWizardOpen(false);
    setPrefilledCategory(null);
  };

  const handleAddTool = async (toolData: any) => {
    try {
      const category = toolData.category || prefilledCategory;

      // Update category color if provided
      if (toolData.categoryColor && category) {
        setCategoryColors(prev => ({
          ...prev,
          [category]: toolData.categoryColor,
        }));
      }

      // Save tool to API
      const response = await fetch('/api/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: toolData.title,
          description: toolData.description,
          fullDescription: toolData.fullDescription,
          url: toolData.url,
          category: category,
          thumbnailUrl: toolData.thumbnailUrl,
          videoUrl: toolData.videoUrl,
          categoryColor: toolData.categoryColor,
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
              Your <span className="gradient-text">AI Tools</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Access all of your essential AI tools in one place. Click on any tool to launch it in a new window.
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
                <CategorySection
                  key={category}
                  category={category}
                  categoryTools={categoryTools}
                  categoryIcon={getToolIcon(category)}
                  categoryColor={categoryColors[category]}
                  onAddTool={handleOpenWizard}
                  getToolIcon={getToolIcon}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Floating Add Tool Button */}
      <button
        onClick={() => handleOpenWizard()}
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
