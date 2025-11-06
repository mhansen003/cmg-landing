/**
 * Bulk Add Chatbots to Database
 *
 * Run with: node scripts/bulk-add-chatbots.js
 */

const newChatbots = require('./add-new-chatbots.js');

async function addChatbotsToDatabase() {
  console.log('🤖 Bulk Adding Chatbots to Database...\n');
  console.log(`Total chatbots to add: ${newChatbots.length}\n`);

  const results = {
    success: [],
    failed: [],
  };

  for (let i = 0; i < newChatbots.length; i++) {
    const bot = newChatbots[i];
    console.log(`[${i + 1}/${newChatbots.length}] Adding: ${bot.title}...`);

    try {
      const response = await fetch('http://localhost:3000/api/tools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add your auth token if needed
          // 'Cookie': 'your-session-cookie-here'
        },
        body: JSON.stringify(bot),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`   ✅ Success! ID: ${data.tool?.id}`);
      results.success.push(bot.title);
    } catch (error) {
      console.error(`   ❌ Failed: ${error.message}`);
      results.failed.push({ title: bot.title, error: error.message });
    }

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Results Summary');
  console.log('='.repeat(50));
  console.log(`✅ Successfully added: ${results.success.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);

  if (results.success.length > 0) {
    console.log('\n✅ Success:');
    results.success.forEach(title => console.log(`   - ${title}`));
  }

  if (results.failed.length > 0) {
    console.log('\n❌ Failed:');
    results.failed.forEach(item => console.log(`   - ${item.title}: ${item.error}`));
  }

  console.log('\n🎉 Bulk add complete!');
}

addChatbotsToDatabase().catch(console.error);
