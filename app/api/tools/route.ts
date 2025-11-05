import { NextRequest, NextResponse } from 'next/server';
import { Tool } from '@/types/tool';
import { getSessionFromRequest } from '@/lib/auth';
import { isAdmin, getDefaultStatus } from '@/lib/permissions';
import { sendPendingApprovalEmail } from '@/lib/email-service';

const TOOLS_KEY = 'cmg-tools';

// Lazy load Redis client only if configured
const getRedis = async () => {
  if (!process.env.REDIS_URL) {
    return null;
  }

  try {
    const { createClient } = await import('redis');
    const client = createClient({
      url: process.env.REDIS_URL
    });

    await client.connect();
    return client;
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
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
    videoUrl: '/videos/va-guidelines-demo.mp4',
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

// GET - Fetch tools (filtered by status)
export async function GET(request: NextRequest) {
  let redis = null;
  try {
    redis = await getRedis();

    // Get session to check admin status
    const session = getSessionFromRequest(request);
    const userIsAdmin = isAdmin(session?.email);

    // Get query params
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'published', 'pending', 'unpublished', 'rejected', or 'all'

    // If Redis is not configured, return default tools (all as published)
    if (!redis) {
      console.log('Redis not configured, returning default tools');
      const defaultWithStatus = DEFAULT_TOOLS.map(tool => ({
        ...tool,
        status: 'published',
        createdBy: 'system',
      }));
      return NextResponse.json({ tools: defaultWithStatus });
    }

    // Try to use Redis
    const toolsData = await redis.get(TOOLS_KEY);
    let tools = toolsData ? JSON.parse(toolsData) : [];

    // Filter by status
    if (status === 'pending') {
      // Only admin can see pending items
      if (userIsAdmin) {
        tools = tools.filter((t: any) => t.status === 'pending');
      } else {
        tools = [];
      }
    } else if (status === 'unpublished') {
      // Only admin can see unpublished items
      if (userIsAdmin) {
        tools = tools.filter((t: any) => t.status === 'unpublished');
      } else {
        tools = [];
      }
    } else if (status === 'rejected') {
      // Users can see their own rejected tools
      if (session?.email) {
        tools = tools.filter((t: any) => t.status === 'rejected' && t.createdBy === session.email);
      } else {
        tools = [];
      }
    } else if (status === 'all') {
      // Only admin can see all items
      if (!userIsAdmin) {
        tools = tools.filter((t: any) => t.status === 'published' || !t.status);
      }
    } else {
      // Default: only show published tools
      tools = tools.filter((t: any) => t.status === 'published' || !t.status);
    }

    return NextResponse.json({ tools, isAdmin: userIsAdmin });
  } catch (error) {
    console.error('Error fetching tools:', error);
    // Return default tools if Redis fails
    const defaultWithStatus = DEFAULT_TOOLS.map(tool => ({
      ...tool,
      status: 'published',
      createdBy: 'system',
    }));
    return NextResponse.json({ tools: defaultWithStatus });
  } finally {
    // Cleanup: disconnect Redis client
    if (redis) {
      try {
        await redis.quit();
      } catch (err) {
        console.error('Error closing Redis connection:', err);
      }
    }
  }
}

// POST - Add a new tool
export async function POST(request: NextRequest) {
  let toolWithMetadata;
  let redis = null;

  try {
    const newTool = await request.json();

    // Get session to check permissions
    const session = getSessionFromRequest(request);
    const userEmail = session?.email;
    const toolStatus = getDefaultStatus(userEmail);

    console.log(`[Tool Creation] User: ${userEmail}, Status: ${toolStatus}`);

    // Add tool metadata
    toolWithMetadata = {
      ...newTool,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      createdBy: userEmail || 'anonymous',
      status: toolStatus,
      approvedBy: toolStatus === 'published' ? userEmail : null,
      approvedAt: toolStatus === 'published' ? new Date().toISOString() : null,
      upvotes: 0,
      downvotes: 0,
      rating: 0,
      ratingCount: 0,
    };

    console.log(`[Tool Creation] Created tool "${toolWithMetadata.title}" with status: ${toolWithMetadata.status}`);

    redis = await getRedis();

    // If Redis is not configured, return tool without persistence
    if (!redis) {
      console.log('Redis not configured, returning tool without persistence');
      return NextResponse.json({
        success: true,
        tool: toolWithMetadata,
        warning: 'Tool not persisted - configure Redis for persistence'
      });
    }

    // Get existing tools
    const toolsData = await redis.get(TOOLS_KEY);
    const tools = toolsData ? JSON.parse(toolsData) : [];
    tools.push(toolWithMetadata);

    // Save back to Redis
    await redis.set(TOOLS_KEY, JSON.stringify(tools));

    // Send email notification if tool is pending approval
    if (toolWithMetadata.status === 'pending') {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://product.cmgfinancial.ai';

      console.log(`[Email] Sending approval email for tool "${toolWithMetadata.title}" to admins`);
      console.log(`[Email] SMTP configured: ${!!process.env.SMTP_HOST && !!process.env.SMTP_USER}`);

      // Send email asynchronously (don't block response)
      sendPendingApprovalEmail(
        {
          toolId: toolWithMetadata.id,
          title: toolWithMetadata.title,
          description: toolWithMetadata.description,
          category: toolWithMetadata.category,
          url: toolWithMetadata.url,
          createdBy: toolWithMetadata.createdBy,
          thumbnailUrl: toolWithMetadata.thumbnailUrl,
        },
        siteUrl
      ).then((success) => {
        console.log(`[Email] Approval email ${success ? 'sent successfully' : 'failed to send'}`);
      }).catch((err) => {
        console.error('[Email] Failed to send approval email (non-blocking):', err);
      });
    } else {
      console.log(`[Email] Skipping email notification, tool status is: ${toolWithMetadata.status}`);
    }

    return NextResponse.json({ success: true, tool: toolWithMetadata });
  } catch (error) {
    console.error('Error adding tool:', error);

    // Return success anyway with the tool (just not persisted)
    return NextResponse.json({
      success: true,
      tool: toolWithMetadata || { error: 'Unable to parse tool data' },
      warning: 'Tool not persisted due to database error'
    });
  } finally {
    // Cleanup: disconnect Redis client
    if (redis) {
      try {
        await redis.quit();
      } catch (err) {
        console.error('Error closing Redis connection:', err);
      }
    }
  }
}
