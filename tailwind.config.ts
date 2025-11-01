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
        cmg: {
          blue: '#0066CC',
          darkblue: '#003d7a',
          gray: '#6B7280',
          lightgray: '#F3F4F6',
          dark: '#1F2937',
        },
      },
    },
  },
  plugins: [],
}
export default config
