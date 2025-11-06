import { createClient } from 'redis';

async function updateADOVideo() {
  const client = createClient({
    url: process.env.REDIS_URL
  });

  try {
    await client.connect();
    console.log('Connected to Redis');

    // Get all tools
    const toolsData = await client.get('cmg-tools');
    if (!toolsData) {
      console.log('No tools found in Redis');
      return;
    }

    const tools = JSON.parse(toolsData);
    console.log(`Found ${tools.length} tools`);

    // Find ADO Explorer tool (search for various possible names)
    const adoTool = tools.find((t: any) =>
      t.title?.toLowerCase().includes('ado') ||
      t.title?.toLowerCase().includes('azure devops') ||
      t.title?.toLowerCase().includes('explorer')
    );

    if (!adoTool) {
      console.log('\n❌ ADO Explorer tool not found in database');
      console.log('\nAvailable tools:');
      tools.forEach((t: any, i: number) => {
        console.log(`  ${i + 1}. ${t.title} (ID: ${t.id})`);
      });
      return;
    }

    console.log(`\n✅ Found tool: "${adoTool.title}" (ID: ${adoTool.id})`);
    console.log(`   Current video: ${adoTool.videoUrl || 'none'}`);

    // Update video URL
    const toolIndex = tools.findIndex((t: any) => t.id === adoTool.id);
    tools[toolIndex] = {
      ...tools[toolIndex],
      videoUrl: '/videos/ado-explorer-demo.mp4',
      updatedAt: new Date().toISOString(),
    };

    // Save back to Redis
    await client.set('cmg-tools', JSON.stringify(tools));
    console.log(`\n✅ Updated video URL to: /videos/ado-explorer-demo.mp4`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.quit();
  }
}

updateADOVideo();
