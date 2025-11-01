import React from 'react';
import ToolCard from '@/components/ToolCard';

export default function Home() {
  const tools = [
    {
      title: 'Intake Portal',
      description: 'Streamline your application intake process with our comprehensive intake management system. Process new applications, track progress, and manage submissions efficiently.',
      url: 'https://intake.cmgfinancial.ai/',
      category: 'Operations',
      videoUrl: '', // User will provide video
      icon: (
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: 'Train Builder',
      description: 'Create compelling marketing campaigns and training materials with our intuitive Train Builder platform. Design, customize, and deploy professional marketing content.',
      url: 'https://trainbuilder.cmgfinancial.ai/',
      category: 'Marketing',
      videoUrl: '', // User will provide video
      icon: (
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-cmg-darkblue to-cmg-blue text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Welcome to CMG Tools Hub
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Your central portal for accessing CMG Financial&apos;s suite of productivity tools,
              chat bots, change management systems, and marketing platforms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#tools"
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-cmg-blue bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                Explore Tools
                <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
              <a
                href="https://www.cmgfi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-cmg-blue transition-colors duration-200"
              >
                Visit CMG Financial
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Features Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-cmg-blue mb-2">
                {tools.length}+
              </div>
              <div className="text-cmg-gray font-medium">Active Tools</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-cmg-blue mb-2">24/7</div>
              <div className="text-cmg-gray font-medium">Availability</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-cmg-blue mb-2">100%</div>
              <div className="text-cmg-gray font-medium">CMG Employees</div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Dashboard Section */}
      <section id="tools" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-cmg-dark mb-4">
              Our Tools Dashboard
            </h2>
            <p className="text-lg text-cmg-gray max-w-2xl mx-auto">
              Access all of your essential tools in one place. Click on any tool to launch it in a new window.
            </p>
          </div>

          {/* Tool Cards Grid */}
          <div className="space-y-8">
            {tools.map((tool, index) => (
              <ToolCard
                key={index}
                title={tool.title}
                description={tool.description}
                url={tool.url}
                category={tool.category}
                videoUrl={tool.videoUrl}
                icon={tool.icon}
              />
            ))}
          </div>

          {/* Coming Soon Section */}
          <div className="mt-16 text-center">
            <div className="bg-white rounded-lg shadow-md p-8 border-2 border-dashed border-cmg-blue">
              <svg className="w-16 h-16 text-cmg-blue mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <h3 className="text-2xl font-bold text-cmg-dark mb-2">More Tools Coming Soon</h3>
              <p className="text-cmg-gray">
                We&apos;re constantly expanding our suite of tools. Check back regularly for new additions!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-cmg-blue text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            If you have questions about any of our tools or need technical support, our team is here to help.
          </p>
          <a
            href="mailto:support@cmgfinancial.com"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-cmg-blue bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            Contact Support
          </a>
        </div>
      </section>
    </div>
  );
}
