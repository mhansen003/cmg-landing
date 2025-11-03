import { NextRequest, NextResponse } from 'next/server';

const TOOLS_KEY = 'cmg-tools';

// Lazy load KV only if configured
const getKV = async () => {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return null;
  }

  try {
    const { kv } = await import('@vercel/kv');
    return kv;
  } catch (error) {
    console.error('Failed to import @vercel/kv:', error);
    return null;
  }
};

// Default tools to return when KV is not available
const DEFAULT_TOOLS = [
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
    title: 'Bank Statement Analyzer',
    description: 'AI-powered income verification at your fingertips. Upload bank statements and get automatic transaction analysis, recurring deposit identification, and qualifying income calculations.',
    fullDescription: 'Meet your Bank Statement Analyzer—AI-powered income verification at your fingertips. Automatically extracts transaction data, identifies recurring deposits, flags compliance concerns, and calculates qualifying income using agency guidelines. Whether it\'s self-employed borrowers or complex income scenarios, get accurate analysis and actionable recommendations instantly. Smart underwriting made simple.',
    url: 'https://bankanalyzer.cmgfinancial.ai/',
    category: 'Sales',
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
    title: 'Jumbo Guidelines Assistant',
    description: 'Your on-demand guideline expert. Get instant answers to loan scenario questions with intelligent chat combining Fannie, Freddie, and CMG overlays.',
    fullDescription: 'Tired of guideline hunting? The Jumbo Guidelines Assistant combines Fannie, Freddie, and CMG overlays in one intelligent chat. Ask any loan scenario question and get clear answers instantly. Whether it\'s DTI limits, credit requirements, or product eligibility—you\'ll have the right information for every borrower conversation. Your guideline expert, on demand.',
    url: 'https://app-librechat-u2uf7w.azurewebsites.net/c/new?spec=Jumbo+Guidelines+Assistant',
    category: 'Sales',
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
    title: 'AI Chatbots',
    description: 'Access powerful AI chatbots for research, writing, coding, and problem-solving. Multiple models available including GPT-4, Claude, and more.',
    fullDescription: 'The AI Chatbots platform provides access to multiple state-of-the-art language models in one unified interface. Perfect for research, content creation, code generation, data analysis, and complex problem-solving. Switch between different AI models to find the best fit for your task.',
    url: 'https://app-librechat-u2uf7w.azurewebsites.net/c/new',
    category: 'Sales',
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
];

// GET - Fetch all tools
export async function GET() {
  try {
    const kv = await getKV();

    // If KV is not configured, return default tools
    if (!kv) {
      console.log('KV not configured, returning default tools');
      return NextResponse.json({ tools: DEFAULT_TOOLS });
    }

    // Try to use KV
    const tools = await kv.get(TOOLS_KEY) || [];
    return NextResponse.json({ tools });
  } catch (error) {
    console.error('Error fetching tools:', error);
    // Return default tools if KV fails
    return NextResponse.json({ tools: DEFAULT_TOOLS });
  }
}

// POST - Add a new tool
export async function POST(request: NextRequest) {
  let toolWithMetadata;

  try {
    const newTool = await request.json();

    // Add tool metadata
    toolWithMetadata = {
      ...newTool,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    const kv = await getKV();

    // If KV is not configured, return tool without persistence
    if (!kv) {
      console.log('KV not configured, returning tool without persistence');
      return NextResponse.json({
        success: true,
        tool: toolWithMetadata,
        warning: 'Tool not persisted - configure Vercel KV for persistence'
      });
    }

    // Get existing tools
    const tools = (await kv.get(TOOLS_KEY) as any[]) || [];
    tools.push(toolWithMetadata);

    // Save back to KV
    await kv.set(TOOLS_KEY, tools);

    return NextResponse.json({ success: true, tool: toolWithMetadata });
  } catch (error) {
    console.error('Error adding tool:', error);

    // Return success anyway with the tool (just not persisted)
    return NextResponse.json({
      success: true,
      tool: toolWithMetadata || { error: 'Unable to parse tool data' },
      warning: 'Tool not persisted due to database error'
    });
  }
}
