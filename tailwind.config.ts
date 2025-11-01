import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme colors inspired by Robinhood/Steam
        dark: {
          100: '#2A2A2A',
          200: '#1F1F1F',
          300: '#171717',
          400: '#121212',
          500: '#0D0D0D',
          900: '#000000',
        },
        accent: {
          green: '#00FF88',
          'green-dark': '#00CC6E',
          blue: '#00D4FF',
          'blue-dark': '#00A8CC',
          purple: '#A855F7',
          'purple-dark': '#9333EA',
        },
        cmg: {
          green: '#A4D65E', // The CMG brand green from screenshots
          blue: '#00A8CC',
          cyan: '#00D4FF',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-dark': 'linear-gradient(to bottom right, #0D0D0D, #1A1A1A)',
        'gradient-card': 'linear-gradient(135deg, rgba(42, 42, 42, 0.4), rgba(23, 23, 23, 0.4))',
      },
      boxShadow: {
        'neon-green': '0 0 20px rgba(0, 255, 136, 0.3)',
        'neon-blue': '0 0 20px rgba(0, 212, 255, 0.3)',
        'neon-purple': '0 0 20px rgba(168, 85, 247, 0.3)',
        'card-hover': '0 20px 50px rgba(0, 255, 136, 0.15)',
        'inner-glow': 'inset 0 1px 2px rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient': 'gradient 8s linear infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}
export default config
