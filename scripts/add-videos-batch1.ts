/**
 * Add videos to first batch of chatbots
 */

import { createClient } from 'redis';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const videoMappings = [
  {
    title: 'General GPT-5 Chatbot',
    videoUrl: '/videos/general-gpt5-chatbot-demo.mp4',
  },
  {
    title: 'General Claude Sonnet 4.5 Chatbot',
    videoUrl: '/videos/general-claude-sonnet-chatbot-demo.mp4',
  },
  {
    title: 'General Gemini 2.5 Pro Chatbot',
    videoUrl: '/videos/general-gemini-chatbot-demo.mp4',
  },
];

async function addVideos() {
  console.log('🎥 Adding videos to chatbots...\n');

  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    console.error('❌ No Redis URL found');
    process.exit(1);
  }

  const redis = createClient({ url: redisUrl });
  await redis.connect();

  const TOOLS_KEY = 'cmg-tools';
  const toolsData = await redis.get(TOOLS_KEY);
  const tools = toolsData ? JSON.parse(toolsData) : [];

  let updatedCount = 0;

  for (const mapping of videoMappings) {
    const tool = tools.find((t: any) => t.title === mapping.title);

    if (tool) {
      tool.videoUrl = mapping.videoUrl;
      console.log(`✅ Added video to: ${mapping.title}`);
      console.log(`   Video: ${mapping.videoUrl}\n`);
      updatedCount++;
    } else {
      console.log(`⚠️  Tool not found: ${mapping.title}\n`);
    }
  }

  // Save back to Redis
  await redis.set(TOOLS_KEY, JSON.stringify(tools));

  console.log('='.repeat(50));
  console.log('📊 Results');
  console.log('='.repeat(50));
  console.log(`✅ Updated: ${updatedCount} chatbots`);
  console.log('🎉 Done!');

  await redis.quit();
}

addVideos();
