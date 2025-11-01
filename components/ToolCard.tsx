import React from 'react';

interface ToolCardProps {
  title: string;
  description: string;
  url: string;
  videoUrl?: string;
  icon?: React.ReactNode;
  category?: string;
}

const ToolCard: React.FC<ToolCardProps> = ({
  title,
  description,
  url,
  videoUrl,
  icon,
  category,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200">
      <div className="grid md:grid-cols-2 gap-0">
        {/* Left side - Content */}
        <div className="p-6 flex flex-col justify-between">
          <div>
            {/* Category Badge */}
            {category && (
              <span className="inline-block px-3 py-1 text-xs font-semibold text-cmg-blue bg-blue-50 rounded-full mb-3">
                {category}
              </span>
            )}

            {/* Icon and Title */}
            <div className="flex items-center space-x-3 mb-4">
              {icon && (
                <div className="w-12 h-12 bg-cmg-blue rounded-lg flex items-center justify-center flex-shrink-0">
                  {icon}
                </div>
              )}
              <h3 className="text-2xl font-bold text-cmg-dark">{title}</h3>
            </div>

            {/* Description */}
            <p className="text-cmg-gray text-base leading-relaxed mb-6">
              {description}
            </p>
          </div>

          {/* Launch Button */}
          <div>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-cmg-blue hover:bg-cmg-darkblue transition-colors duration-200 shadow-sm"
            >
              Launch Tool
              <svg
                className="ml-2 -mr-1 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Right side - Video/Preview */}
        <div className="bg-cmg-lightgray flex items-center justify-center p-6">
          {videoUrl ? (
            <div className="w-full h-full min-h-[250px] bg-gray-800 rounded-lg overflow-hidden">
              <video
                className="w-full h-full object-cover"
                controls
                preload="metadata"
                poster="/api/placeholder/400/300"
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <div className="w-full h-full min-h-[250px] bg-gradient-to-br from-cmg-blue to-cmg-darkblue rounded-lg flex items-center justify-center">
              <svg
                className="w-24 h-24 text-white opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
