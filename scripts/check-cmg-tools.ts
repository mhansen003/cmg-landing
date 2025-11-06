/**
 * Check what's in the cmg-tools key (the correct production key)
 */

import { createClient } from 'redis';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function checkRedis() {
  const redisUrl = process.env.KV_REST_API_URL || process.env.REDIS_URL;

  if (!redisUrl) {
    console.error('❌ No Redis URL found');
    process.exit(1);
  }

  const redis = createClient({ url: redisUrl });
  await redis.connect();

  const toolsData = await redis.get('cmg-tools');
  const tools = toolsData ? JSON.parse(toolsData) : [];

  console.log(`📦 Tools in cmg-tools key: ${tools.length}\n`);

  if (tools.length > 0) {
    console.log('Tools:');
    tools.forEach((tool: any, i: number) => {
      console.log(`${i + 1}. ${tool.title} (${tool.category || 'No category'})`);
    });
  } else {
    console.log('❌ No tools found in cmg-tools key!');
  }

  await redis.quit();
}

checkRedis();
