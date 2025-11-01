# CMG Tools Hub

A comprehensive landing page for CMG Financial employees to access various tools, chatbots, change management systems, and marketing platforms.

## Features

- **Professional Header & Footer** - Styled to match CMG Financial branding
- **Tool Dashboard** - Easy-to-navigate tile-based interface
- **Tool Cards** - Each tool includes:
  - Description
  - Video demo support
  - Launch button (opens in new window)
  - Category badges
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Modern Tech Stack** - Built with Next.js 15, React 19, TypeScript, and Tailwind CSS

## Current Tools

1. **Intake Portal** - Application intake management system
   - URL: https://intake.cmgfinancial.ai/

2. **Train Builder** - Marketing campaign and training material creator
   - URL: https://trainbuilder.cmgfinancial.ai/

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

## Adding New Tools

To add a new tool to the dashboard, edit `app/page.tsx` and add a new object to the `tools` array:

```typescript
{
  title: 'Your Tool Name',
  description: 'Description of what your tool does',
  url: 'https://yourtool.cmgfinancial.ai/',
  category: 'Category Name',
  videoUrl: '/path/to/video.mp4', // Optional
  icon: (<svg>...</svg>), // Optional icon
}
```

## Adding Videos

1. Place video files in the `public` folder
2. Update the `videoUrl` property in the tool configuration
3. Supported formats: MP4, WebM

## Deployment

This project is configured for deployment on Vercel:

1. Push code to GitHub
2. Connect repository to Vercel
3. Vercel will automatically deploy on push to main branch

## Project Structure

```
cmg-landing/
├── app/
│   ├── layout.tsx      # Root layout with Header/Footer
│   ├── page.tsx        # Home page with tools dashboard
│   └── globals.css     # Global styles
├── components/
│   ├── Header.tsx      # Header component
│   ├── Footer.tsx      # Footer component
│   └── ToolCard.tsx    # Reusable tool card component
├── public/             # Static assets (videos, images)
└── package.json        # Dependencies and scripts
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Support

For questions or issues, contact the CMG IT team.

## License

Internal use only - CMG Financial
