/**
 * Add "sales" tag to all new chatbots
 */

import { createClient } from 'redis';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const chatbotTitles = [
  'General GPT-5 Chatbot',
  'General Claude Sonnet 4.5 Chatbot',
  'General Gemini 2.5 Pro Chatbot',
  'USDA Guidelines Assistant',
  'Niche Guidelines Assistant',
  'FHA Guidelines Assistant',
  'DPA Guidelines Assistant',
  'Conventional Guidelines Assistant',
  'AIO Simulator',
  'AIO Guidelines Assistant',
  'Affordable Housing Guidelines Assistant',
];

async function addSalesTag() {
  console.log('🏷️  Adding "sales" tag to chatbots...\n');

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

  for (const tool of tools) {
    if (chatbotTitles.includes(tool.title)) {
      // Add "sales" tag if not already present
      if (!tool.tags) {
        tool.tags = [];
      }

      if (!tool.tags.includes('sales')) {
        tool.tags.push('sales');
        console.log(`✅ Added "sales" tag to: ${tool.title}`);
        updatedCount++;
      } else {
        console.log(`⏭️  Already has "sales" tag: ${tool.title}`);
      }
    }
  }

  // Save back to Redis
  await redis.set(TOOLS_KEY, JSON.stringify(tools));

  console.log('\n' + '='.repeat(50));
  console.log('📊 Results');
  console.log('='.repeat(50));
  console.log(`✅ Updated: ${updatedCount} chatbots`);
  console.log('🎉 Done!');

  await redis.quit();
}

addSalesTag();
