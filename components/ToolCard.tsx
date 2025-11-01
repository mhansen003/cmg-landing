import React from 'react';
import Image from 'next/image';

interface ToolCardProps {
  title: string;
  description: string;
  url: string;
  thumbnailUrl?: string;
  icon?: React.ReactNode;
  category?: string;
  accentColor?: 'green' | 'blue' | 'purple';
}

const ToolCard: React.FC<ToolCardProps> = ({
  title,
  description,
  url,
  thumbnailUrl,
  icon,
  category,
  accentColor = 'green',
}) => {
  const accentColors = {
    green: {
      border: 'border-accent-green',
      bg: 'bg-accent-green',
      shadow: 'shadow-neon-green',
      text: 'text-accent-green',
      hover: 'group-hover:border-accent-green',
      glow: 'bg-accent-green/20',
    },
    blue: {
      border: 'border-accent-blue',
      bg: 'bg-accent-blue',
      shadow: 'shadow-neon-blue',
      text: 'text-accent-blue',
      hover: 'group-hover:border-accent-blue',
      glow: 'bg-accent-blue/20',
    },
    purple: {
      border: 'border-accent-purple',
      bg: 'bg-accent-purple',
      shadow: 'shadow-neon-purple',
      text: 'text-accent-purple',
      hover: 'group-hover:border-accent-purple',
      glow: 'bg-accent-purple/20',
    },
  };

  const colors = accentColors[accentColor];

  return (
    <div className="group relative">
      {/* Glow effect on hover */}
      <div className={`absolute -inset-0.5 ${colors.glow} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500`}></div>

      <div className={`relative bg-gradient-to-br from-dark-300 to-dark-400 rounded-2xl overflow-hidden border ${colors.hover} border-white/10 transition-all duration-500 group-hover:scale-[1.02]`}>
        <div className="grid lg:grid-cols-2 gap-0">
          {/* Left side - Content */}
          <div className="p-8 flex flex-col justify-between relative z-10">
            <div>
              {/* Category Badge */}
              {category && (
                <div className="inline-flex items-center space-x-2 mb-4">
                  <span className={`px-3 py-1 text-xs font-bold ${colors.text} bg-white/5 rounded-full border ${colors.border} backdrop-blur-sm`}>
                    {category}
                  </span>
                </div>
              )}

              {/* Icon and Title */}
              <div className="flex items-start space-x-4 mb-6">
                {icon && (
                  <div className="relative flex-shrink-0">
                    <div className={`absolute inset-0 ${colors.bg} blur-md opacity-50`}></div>
                    <div className={`relative w-14 h-14 bg-gradient-to-br from-${accentColor === 'green' ? 'accent-green' : accentColor === 'blue' ? 'accent-blue' : 'accent-purple'} to-dark-300 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                      {icon}
                    </div>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:${colors.text} transition-colors duration-300">
                    {title}
                  </h3>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {description}
              </p>
            </div>

            {/* Launch Button */}
            <div>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center w-full px-6 py-3.5 text-sm font-bold rounded-xl text-dark-500 ${colors.bg} hover:${colors.shadow} transition-all duration-300 transform hover:scale-105 hover:translate-y-[-2px] relative overflow-hidden group/button`}
              >
                <span className="relative z-10 flex items-center">
                  Launch Tool
                  <svg
                    className="ml-2 w-5 h-5 transform group-hover/button:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-white/20 transform translate-x-[-100%] group-hover/button:translate-x-[100%] transition-transform duration-700"></div>
              </a>
            </div>
          </div>

          {/* Right side - Screenshot/Thumbnail */}
          <div className="relative bg-dark-500 flex items-center justify-center p-6 min-h-[300px] lg:min-h-[400px]">
            {thumbnailUrl ? (
              <div className="relative w-full h-full rounded-lg overflow-hidden border border-white/10 shadow-2xl group-hover:border-white/20 transition-all duration-500 transform group-hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-dark-500/50 z-10"></div>
                <Image
                  src={thumbnailUrl}
                  alt={`${title} screenshot`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Scan line effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent transform translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-3000 z-20"></div>
              </div>
            ) : (
              <div className={`w-full h-full rounded-lg bg-gradient-to-br from-dark-400 to-dark-500 flex items-center justify-center border ${colors.border}`}>
                <svg
                  className={`w-24 h-24 ${colors.text} opacity-30`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}

            {/* Corner accent */}
            <div className={`absolute top-0 right-0 w-20 h-20 ${colors.bg} opacity-10 blur-3xl`}></div>
            <div className={`absolute bottom-0 left-0 w-20 h-20 ${colors.bg} opacity-10 blur-3xl`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
