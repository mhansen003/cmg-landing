/**
 * Add videos to remaining 8 chatbots
 */

import { createClient } from 'redis';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const videoMappings = [
  {
    title: 'USDA Guidelines Assistant',
    videoUrl: '/videos/usda-guidelines-demo.mp4',
  },
  {
    title: 'Niche Guidelines Assistant',
    videoUrl: '/videos/niche-guidelines-demo.mp4',
  },
  {
    title: 'FHA Guidelines Assistant',
    videoUrl: '/videos/fha-guidelines-demo.mp4',
  },
  {
    title: 'DPA Guidelines Assistant',
    videoUrl: '/videos/dpa-guidelines-demo.mp4',
  },
  {
    title: 'Conventional Guidelines Assistant',
    videoUrl: '/videos/conventional-guidelines-demo.mp4',
  },
  {
    title: 'AIO Simulator',
    videoUrl: '/videos/aio-simulator-demo.mp4',
  },
  {
    title: 'AIO Guidelines Assistant',
    videoUrl: '/videos/aio-guidelines-demo.mp4',
  },
  {
    title: 'Affordable Housing Guidelines Assistant',
    videoUrl: '/videos/affordable-housing-guidelines-demo.mp4',
  },
];

async function addVideos() {
  console.log('🎥 Adding videos to remaining 8 chatbots...\n');

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
  console.log('🎉 All 11 chatbots now have videos!');

  await redis.quit();
}

addVideos();
