/**
 * Add Chatbots to Vercel KV (Production)
 *
 * Run with: tsx scripts/add-chatbots-to-vercel-kv.ts
 */

import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const newChatbots = [
  {
    title: 'General GPT-5 Chatbot',
    description: 'Access the latest GPT-5 model for advanced AI conversations, analysis, and problem-solving. Perfect for complex scenarios requiring cutting-edge AI capabilities.',
    fullDescription: 'The General GPT-5 Chatbot provides access to OpenAI\'s most advanced language model. With enhanced reasoning, longer context windows, and improved accuracy, GPT-5 excels at complex analysis, creative content generation, technical problem-solving, and nuanced conversations. Ideal for loan officers who need powerful AI assistance for complex borrower scenarios, market analysis, or strategic planning.',
    url: 'https://dev.chat.ai.clear.online/c/new?spec=GPT-5',
    category: 'Sales AI Agents',
    isChatbot: true,
    accentColor: 'purple',
    tags: ['ai', 'chatbot', 'gpt-5', 'general-purpose', 'advanced'],
    features: [
      'Latest GPT-5 model with enhanced capabilities',
      'Advanced reasoning and problem-solving',
      'Extended context window for longer conversations',
      'Superior accuracy and nuanced understanding',
      'Ideal for complex loan scenarios',
      'Creative content generation',
    ],
  },
  {
    title: 'General Claude Sonnet 4.5 Chatbot',
    description: 'Engage with Anthropic\'s Claude Sonnet 4.5 for thoughtful, detailed responses. Excellent for analysis, writing, and conversational AI assistance.',
    fullDescription: 'The General Claude Sonnet 4.5 Chatbot leverages Anthropic\'s flagship model known for its thoughtful, detailed, and nuanced responses. Claude excels at analysis, research, creative writing, and maintaining context over long conversations. Perfect for loan officers who need in-depth analysis of complex borrower situations, detailed explanations of loan products, or help crafting professional communications.',
    url: 'https://dev.chat.ai.clear.online/c/new?spec=Claude+Sonnet+4.5',
    category: 'Sales AI Agents',
    isChatbot: true,
    accentColor: 'purple',
    tags: ['ai', 'chatbot', 'claude', 'anthropic', 'analysis'],
    features: [
      'Claude Sonnet 4.5 - Anthropic\'s flagship model',
      'Thoughtful and detailed responses',
      'Excellent for research and analysis',
      'Long-form content generation',
      'Strong contextual understanding',
      'Professional communication assistance',
    ],
  },
  {
    title: 'General Gemini 2.5 Pro Chatbot',
    description: 'Utilize Google\'s Gemini 2.5 Pro for powerful AI assistance with multimodal capabilities. Great for diverse use cases and comprehensive analysis.',
    fullDescription: 'The General Gemini 2.5 Pro Chatbot provides access to Google\'s advanced multimodal AI model. With strong reasoning capabilities, broad knowledge, and the ability to process multiple types of information, Gemini 2.5 Pro is versatile and powerful. Ideal for loan officers needing comprehensive analysis, market research, document understanding, or versatile AI assistance across various tasks.',
    url: 'https://dev.chat.ai.clear.online/c/new?spec=Gemini+2.5+Pro',
    category: 'Sales AI Agents',
    isChatbot: true,
    accentColor: 'purple',
    tags: ['ai', 'chatbot', 'gemini', 'google', 'multimodal'],
    features: [
      'Google Gemini 2.5 Pro advanced AI',
      'Multimodal processing capabilities',
      'Strong reasoning and analysis',
      'Broad knowledge base',
      'Versatile task handling',
      'Comprehensive research assistance',
    ],
  },
  {
    title: 'USDA Guidelines Assistant',
    description: 'Expert guidance for USDA loan scenarios. Get instant answers about rural development loans, income eligibility, property requirements, and USDA-specific guidelines.',
    fullDescription: 'Navigate USDA loans with confidence using the USDA Guidelines Assistant. This specialized tool provides expert guidance on USDA Rural Development loan programs, including income limits, geographic eligibility, property requirements, and zero-down payment options. Perfect for helping borrowers in rural and suburban areas access homeownership through USDA financing.',
    url: 'https://dev.chat.ai.clear.online/c/new?agent_id=agent_nDW6cv9EYJnlOm6-ilHym',
    category: 'Sales AI Agents',
    isChatbot: true,
    accentColor: 'green',
    tags: ['usda', 'guidelines', 'rural', 'loan-programs', 'zero-down'],
    features: [
      'USDA Rural Development loan expertise',
      'Income eligibility verification',
      'Geographic and property requirements',
      'Zero-down payment guidance',
      'Guarantee fee calculations',
      'Rural and suburban area qualification',
    ],
  },
  {
    title: 'Niche Guidelines Assistant',
    description: 'Specialized guidance for niche and alternative loan programs. Get instant answers about unique financing options, specialty products, and non-traditional lending scenarios.',
    fullDescription: 'Navigate niche and specialty loan programs with the Niche Guidelines Assistant. This tool provides expert guidance on alternative financing options, unique loan products, and non-traditional lending scenarios that fall outside conventional guidelines. Perfect for loan officers working with borrowers who need creative financing solutions or specialty mortgage products.',
    url: 'https://dev.chat.ai.clear.online/c/new?agent_id=agent_BRgTU9O8wclNjpHGuPwAK',
    category: 'Sales AI Agents',
    isChatbot: true,
    accentColor: 'purple',
    tags: ['niche', 'guidelines', 'specialty', 'alternative', 'creative-financing'],
    features: [
      'Niche loan program expertise',
      'Alternative financing strategies',
      'Specialty product guidance',
      'Non-traditional scenario solutions',
      'Creative financing options',
      'Unique borrower situation assistance',
    ],
  },
  {
    title: 'FHA Guidelines Assistant',
    description: 'Comprehensive FHA loan guidance. Get instant answers about FHA requirements, down payments, mortgage insurance, credit guidelines, and property standards.',
    fullDescription: 'Navigate FHA loans with confidence using the FHA Guidelines Assistant. This specialized tool provides expert guidance on FHA loan requirements including minimum credit scores, down payment options, mortgage insurance premiums, debt-to-income ratios, and property condition standards. Perfect for helping first-time homebuyers and borrowers with lower credit scores access homeownership through FHA financing.',
    url: 'https://dev.chat.ai.clear.online/c/new?agent_id=agent_rghnQwuhaXir6gdYNTC3W',
    category: 'Sales AI Agents',
    isChatbot: true,
    accentColor: 'blue',
    tags: ['fha', 'guidelines', 'first-time', 'mortgage-insurance', 'low-down-payment'],
    features: [
      'Comprehensive FHA guideline expertise',
      'Credit score and qualification guidance',
      'Down payment and MIP calculations',
      'DTI ratio requirements',
      'Property condition standards',
      'First-time homebuyer assistance',
    ],
  },
  {
    title: 'DPA Guidelines Assistant',
    description: 'Expert guidance for Down Payment Assistance programs. Get instant answers about DPA eligibility, grant programs, second mortgages, and state/local assistance options.',
    fullDescription: 'Navigate Down Payment Assistance programs with the DPA Guidelines Assistant. This specialized tool provides expert guidance on federal, state, and local DPA programs including grants, forgivable loans, deferred payment loans, and matched savings programs. Perfect for helping borrowers overcome down payment barriers and access homeownership through available assistance programs.',
    url: 'https://dev.chat.ai.clear.online/c/new?agent_id=agent_bDvLFXhfY3XRtnVIkVH1D',
    category: 'Sales AI Agents',
    isChatbot: true,
    accentColor: 'green',
    tags: ['dpa', 'down-payment-assistance', 'grants', 'first-time', 'affordability'],
    features: [
      'Down Payment Assistance expertise',
      'Federal, state, and local program guidance',
      'Grant and forgivable loan options',
      'Eligibility requirement verification',
      'Program combining strategies',
      'Homeownership affordability solutions',
    ],
  },
  {
    title: 'Conventional Guidelines Assistant',
    description: 'Expert guidance for conventional loan scenarios. Get instant answers about Fannie Mae and Freddie Mac guidelines, PMI requirements, and conforming loan limits.',
    fullDescription: 'Navigate conventional loans with confidence using the Conventional Guidelines Assistant. This specialized tool provides expert guidance on Fannie Mae and Freddie Mac guidelines including credit requirements, debt-to-income ratios, private mortgage insurance, reserves, and conforming loan limits. Perfect for standard purchase and refinance scenarios with traditional financing.',
    url: 'https://dev.chat.ai.clear.online/c/new?agent_id=agent_6qWjAb4OjoVtod_ggxyRz',
    category: 'Sales AI Agents',
    isChatbot: true,
    accentColor: 'blue',
    tags: ['conventional', 'guidelines', 'fannie-mae', 'freddie-mac', 'conforming'],
    features: [
      'Fannie Mae and Freddie Mac expertise',
      'Credit score and DTI requirements',
      'PMI guidelines and removal options',
      'Conforming loan limit verification',
      'Reserve requirement guidance',
      'Standard purchase and refinance scenarios',
    ],
  },
  {
    title: 'AIO Simulator',
    description: 'Simulate All-In-One loan scenarios and calculations. Interactive tool for exploring AIO product features, payment structures, and borrower benefits.',
    fullDescription: 'The AIO Simulator provides an interactive environment for exploring All-In-One mortgage product scenarios. Test different payment structures, simulate interest savings, explore equity access features, and understand how the AIO product works for various borrower situations. Perfect for loan officers who want to demonstrate the power and flexibility of the All-In-One mortgage product.',
    url: 'https://dev.chat.ai.clear.online/c/new?agent_id=agent_6qWjAb4OjoVtod_ggxyRz',
    category: 'Sales AI Agents',
    isChatbot: true,
    accentColor: 'purple',
    tags: ['aio', 'all-in-one', 'simulator', 'heloc', 'mortgage'],
    features: [
      'Interactive AIO scenario simulation',
      'Payment structure calculations',
      'Interest savings projections',
      'Equity access demonstrations',
      'Cash flow management scenarios',
      'Borrower benefit illustrations',
    ],
  },
  {
    title: 'AIO Guidelines Assistant',
    description: 'Expert guidance for All-In-One mortgage scenarios. Get instant answers about AIO eligibility, product features, payment options, and borrower qualification.',
    fullDescription: 'Navigate the All-In-One mortgage product with the AIO Guidelines Assistant. This specialized tool provides expert guidance on AIO eligibility requirements, product features, payment flexibility options, equity access provisions, and qualification criteria. Perfect for loan officers helping borrowers understand and qualify for this innovative mortgage solution that combines a first mortgage with a home equity line of credit.',
    url: 'https://dev.chat.ai.clear.online/c/new?agent_id=agent_1e-ZNSX14jE2g2xF-aESl',
    category: 'Sales AI Agents',
    isChatbot: true,
    accentColor: 'purple',
    tags: ['aio', 'all-in-one', 'guidelines', 'heloc', 'hybrid-mortgage'],
    features: [
      'All-In-One product expertise',
      'Eligibility and qualification guidance',
      'Payment flexibility options',
      'Equity access provisions',
      'Interest savings strategies',
      'Hybrid mortgage product education',
    ],
  },
  {
    title: 'Affordable Housing Guidelines Assistant',
    description: 'Expert guidance for affordable housing programs and initiatives. Get instant answers about income-restricted properties, community land trusts, and affordable housing financing.',
    fullDescription: 'Navigate affordable housing programs with the Affordable Housing Guidelines Assistant. This specialized tool provides expert guidance on income-restricted properties, community land trusts, inclusionary zoning programs, housing authority partnerships, and specialized financing for affordable housing. Perfect for loan officers helping borrowers access affordable homeownership opportunities through various housing programs and initiatives.',
    url: 'https://dev.chat.ai.clear.online/c/new?agent_id=agent_tutFOgL-idKat7yTy9Mk9',
    category: 'Sales AI Agents',
    isChatbot: true,
    accentColor: 'green',
    tags: ['affordable-housing', 'income-restricted', 'community', 'programs', 'assistance'],
    features: [
      'Affordable housing program expertise',
      'Income-restricted property guidance',
      'Community land trust assistance',
      'Inclusionary zoning requirements',
      'Housing authority partnerships',
      'Affordable homeownership pathways',
    ],
  },
];

async function addToVercelKV() {
  console.log('🚀 Adding Chatbots to Vercel KV (Production)...\n');
  console.log(`Total chatbots to add: ${newChatbots.length}\n`);

  // Check for Vercel KV credentials
  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;

  if (!kvUrl || !kvToken) {
    console.error('❌ Error: Vercel KV credentials not found');
    console.error('   Missing: KV_REST_API_URL or KV_REST_API_TOKEN in .env.local');
    process.exit(1);
  }

  console.log('📡 Connecting to Vercel KV...');

  try {
    // Get existing tools from Vercel KV
    const getResponse = await fetch(`${kvUrl}/get/tools`, {
      headers: {
        Authorization: `Bearer ${kvToken}`,
      },
    });

    const getData = await getResponse.json();
    const tools = getData.result ? JSON.parse(getData.result) : [];

    console.log(`✅ Connected to Vercel KV`);
    console.log(`📦 Current tools in production: ${tools.length}\n`);

    // Add each chatbot
    let addedCount = 0;
    for (const bot of newChatbots) {
      const toolWithMetadata = {
        ...bot,
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString(),
        createdBy: 'admin@cmgfinancial.com',
        status: 'published',
        approvedBy: 'admin@cmgfinancial.com',
        approvedAt: new Date().toISOString(),
        upvotes: 0,
        downvotes: 0,
        rating: 0,
        ratingCount: 0,
      };

      tools.push(toolWithMetadata);
      console.log(`✅ Added: ${bot.title}`);
      addedCount++;

      // Small delay
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Save back to Vercel KV
    console.log('\n💾 Saving to Vercel KV...');
    const setResponse = await fetch(`${kvUrl}/set/tools`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${kvToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(JSON.stringify(tools)),
    });

    if (!setResponse.ok) {
      throw new Error(`Failed to save to Vercel KV: ${setResponse.statusText}`);
    }

    console.log('✅ Saved to Vercel KV\n');

    console.log('='.repeat(50));
    console.log('📊 Results Summary');
    console.log('='.repeat(50));
    console.log(`✅ Successfully added: ${addedCount} chatbots`);
    console.log(`📦 Total tools in production: ${tools.length}`);
    console.log('\n🎉 Bulk add to production complete!');
    console.log('\n🌐 View at: https://your-site.vercel.app/tools');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addToVercelKV();
