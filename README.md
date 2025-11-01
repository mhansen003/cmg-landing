# CMG Tools Hub

A comprehensive, high-tech dark mode landing page for CMG Financial employees to access various tools, chatbots, change management systems, and marketing platforms.

## Features

- **Premium Dark Theme** - Inspired by Robinhood and Steam with neon accents
- **Interactive Tool Cards** - Vote up/down, share, and view detailed information
- **AI-Powered Tool Generation** - Add new tools with AI-generated descriptions
- **Screenshot Previews** - Full-screen modal with tool details
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Modern Tech Stack** - Next.js 15, React 19, TypeScript, and Tailwind CSS

## Current Tools

1. **Change Management Intake** - AI-powered intake management system
   - URL: https://intake.cmgfinancial.ai/

2. **Communications Builder** - Marketing and training material creator
   - URL: https://trainbuilder.cmgfinancial.ai/

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- OpenAI API key (for tool generation feature)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local and add your OpenAI API key

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file in the root directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

**To get your OpenAI API key:**
1. Go to https://platform.openai.com/api-keys
2. Create a new secret key
3. Copy and paste it into `.env.local`

### Building for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

## Adding New Tools

### Method 1: Using the AI Wizard (Recommended)

1. Click the **floating + button** in the bottom right
2. Enter the tool's URL
3. (Optional) Upload a demo video
4. Click "**Generate Tool Details**" - AI will analyze the URL and create:
   - Tool title
   - Description
   - Category
   - Features list
   - Accent color
5. Review and click "**Confirm & Add Tool**"

### Method 2: Manual Addition

Edit `app/page.tsx` and add a new object to the `tools` array:

```typescript
{
  title: 'Your Tool Name',
  description: 'Brief description',
  fullDescription: 'Detailed description for the modal',
  url: 'https://yourtool.cmgfinancial.ai/',
  category: 'Operations', // or Marketing, Engineering, etc.
  thumbnailUrl: 'https://yourtool.cmgfinancial.ai/api/og',
  accentColor: 'green', // or blue, purple
  features: [
    'Feature 1',
    'Feature 2',
    'Feature 3',
    'Feature 4',
    'Feature 5',
    'Feature 6',
  ],
  icon: (
    <svg>...</svg> // Your custom icon
  ),
}
```

## Interactive Features

### Voting System
- Click 👍 to vote up or 👎 to vote down
- Click again to remove your vote
- Vote counts displayed in real-time

### Share Functionality
- Click the share button to copy the link
- Native share API on mobile devices
- Toast notification confirms link copied

### Details Modal
- Click "Details" button or screenshot thumbnail
- View full tool description and features
- Large screenshot preview
- Launch tool directly from modal

## Project Structure

```
cmg-landing/
├── app/
│   ├── api/
│   │   └── generate-tool/     # OpenAI integration for tool generation
│   │       └── route.ts
│   ├── layout.tsx             # Root layout with Header/Footer
│   ├── page.tsx               # Home page with tools dashboard
│   └── globals.css            # Global styles and animations
├── components/
│   ├── Header.tsx             # Header with glassmorphism
│   ├── Footer.tsx             # Footer with links
│   ├── ToolCard.tsx           # Interactive tool card
│   ├── ToolDetailModal.tsx    # Full-screen tool details
│   └── AddToolWizard.tsx      # AI-powered tool creation wizard
├── public/                    # Static assets (videos, images)
└── package.json               # Dependencies and scripts
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom dark theme
- **AI**: OpenAI GPT-4 for tool generation
- **Deployment**: Vercel

## Deployment

This project is configured for deployment on Vercel:

1. Push code to GitHub
2. Connect repository to Vercel
3. Add `OPENAI_API_KEY` to Vercel environment variables
4. Vercel will automatically deploy on push to main branch

**Setting environment variables in Vercel:**
1. Go to your project in Vercel Dashboard
2. Navigate to Settings → Environment Variables
3. Add `OPENAI_API_KEY` with your OpenAI key
4. Redeploy the project

## Design Features

### Dark Theme
- Deep blacks (#0D0D0D, #121212) for true OLED dark mode
- Neon accent colors (green, blue, purple) for highlights
- Glassmorphism effects with backdrop blur
- Custom scrollbar styling

### Animations
- Smooth transitions (300ms standard)
- Hover scale effects on cards
- Scan line animation on screenshots
- Pulsing badges and indicators
- Gradient text effects

### Accessibility
- High contrast ratios
- Keyboard navigation support
- Screen reader friendly
- Touch-friendly button sizes

## Support

For questions or issues:
- Check the [Deployment Guide](DEPLOYMENT.md)
- Contact the CMG IT team
- File an issue on GitHub

## License

Internal use only - CMG Financial

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
