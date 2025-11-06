# Chatbot Tools - Quick Start Guide

## Adding Your First Chatbot Tool

This guide shows you exactly how to add a chatbot tool with personality selection support.

## Step 1: Add the Chatbot Tool to Your System

Depending on how you manage tools in your application, add a tool with the `isChatbot: true` flag:

### Example: Sales Assistant Chatbot

```typescript
{
  id: 'sales-assistant-bot',
  title: 'Sales Assistant Bot',
  description: 'AI-powered sales support for loan officers',
  fullDescription: 'Get instant answers to sales questions, generate email templates, and receive guidance on loan products. This AI assistant is trained on CMG sales materials and best practices.',
  url: 'https://sales-bot.cmgfinancial.ai/',
  category: 'Sales AI Agents',
  isChatbot: true,  // 👈 THIS IS THE KEY FLAG!
  videoUrl: '/videos/sales-bot-demo.mp4',
  thumbnailUrl: '/images/sales-bot-thumb.jpg',
  accentColor: 'purple',
  features: [
    'Instant sales question answers',
    'Email template generation',
    'Loan product guidance',
    'Compliance-aware responses',
    'Real-time chat interface',
    'Personality customization',
  ],
  upvotes: 0,
  downvotes: 0,
  rating: 0,
  ratingCount: 0,
  tags: ['ai', 'sales', 'chatbot', 'assistant'],
  createdAt: new Date().toISOString(),
  status: 'published',
}
```

## Step 2: Update Your Chatbot to Accept Personality Parameter

In your chatbot application (e.g., `sales-bot.cmgfinancial.ai`), add code to read the personality parameter:

### Example Implementation

```typescript
// chatbot-app/src/App.tsx (or wherever you initialize your chatbot)

useEffect(() => {
  const initializeChatbot = async () => {
    // Get personality URL from query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const personalityUrl = urlParams.get('personality');

    if (personalityUrl) {
      try {
        // Fetch the personality prompt
        const response = await fetch(personalityUrl);
        const data = await response.json();

        // Configure chatbot with this personality
        setChatbotConfig({
          systemPrompt: data.prompt,
          temperature: data.temperature || 0.7,
          model: data.model || 'gpt-4',
        });

        console.log('Loaded personality:', data.name);
      } catch (error) {
        console.error('Failed to load personality:', error);
        // Fall back to default personality
      }
    }
  };

  initializeChatbot();
}, []);
```

## Step 3: Wire Up Your Personality API

### Option A: Update the Placeholder Endpoint

Edit `app/api/personalities/route.ts` and replace the mock data with your real API:

```typescript
export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${process.env.PERSONALITY_API_URL}/api/personalities`, {
      headers: {
        'Authorization': `Bearer ${process.env.PERSONALITY_API_KEY}`,
      },
    });

    const data = await response.json();
    return NextResponse.json({ personalities: data.personalities });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ personalities: [] }, { status: 500 });
  }
}
```

### Option B: Use the Mock Data for Testing

The placeholder endpoint already has mock data based on your screenshot. You can test with this immediately!

## Step 4: Test the Flow

1. **Navigate to your tools page**
   ```
   http://localhost:3000/tools
   ```

2. **Find your chatbot tool**
   - Look for the tool with your chatbot name
   - Notice the button says "Launch Chatbot" instead of "Launch Tool"

3. **Click "Launch Chatbot"**
   - A modal should appear with personality options
   - Select a personality (e.g., "Executive Briefing")

4. **Verify the Launch**
   - Click "Launch Chatbot" in the modal
   - A new tab should open with your chatbot
   - Check the URL includes the personality parameter:
     ```
     https://sales-bot.cmgfinancial.ai/?personality=https%3A%2F%2F...
     ```

## Example Personality Prompt Response

Your personality URL should return a JSON response like this:

```json
{
  "id": "executive-briefing",
  "name": "Executive Briefing",
  "prompt": "You are a professional AI assistant specialized in executive communication. Your responses should be:\n\n- Concise and action-oriented\n- Data-driven with clear metrics\n- Strategic in focus\n- Formatted for busy executives\n\nAlways:\n- Lead with the key takeaway\n- Use bullet points for clarity\n- Include relevant data/metrics\n- Suggest next steps\n\nMaintain a professional, confident tone while being approachable.",
  "temperature": 0.7,
  "model": "gpt-4"
}
```

## Adding More Chatbot Tools

Just repeat Step 1 for each chatbot tool. Examples:

### Marketing Content Bot
```typescript
{
  id: 'marketing-content-bot',
  title: 'Marketing Content Generator',
  description: 'Create social media posts, ads, and marketing materials',
  url: 'https://marketing-bot.cmgfinancial.ai/',
  isChatbot: true,  // 👈 Enable personality selection
  category: 'Marketing',
  // ... other fields
}
```

### Training Assistant Bot
```typescript
{
  id: 'training-assistant-bot',
  title: 'Training Assistant',
  description: 'Interactive training and onboarding support',
  url: 'https://training-bot.cmgfinancial.ai/',
  isChatbot: true,  // 👈 Enable personality selection
  category: 'Training',
  // ... other fields
}
```

## Visual Indicators

When `isChatbot: true`:
- ✅ Button text changes to "Launch Chatbot"
- ✅ PersonalityModal opens on click
- ✅ User selects personality before launching
- ✅ Personality URL passed as parameter

When `isChatbot: false` or not set:
- ✅ Button text is "Launch Tool"
- ✅ Tool launches immediately
- ✅ No personality selection

## Troubleshooting Quick Checks

### Chatbot not launching with modal?
```typescript
// Check your tool object:
console.log(tool.isChatbot); // Should be true
```

### Modal appears but no personalities?
```bash
# Test the API endpoint:
curl http://localhost:3000/api/personalities
```

### Personality parameter not received?
```javascript
// In your chatbot app:
console.log(window.location.search);
// Should show: ?personality=https://...
```

## Next Steps

1. ✅ Add your first chatbot tool with `isChatbot: true`
2. ✅ Test with mock personality data
3. ✅ Wire up your real personality API
4. ✅ Update your chatbot to read personality parameter
5. ✅ Add more chatbot tools as needed

## Getting Real Endpoints

Once your personality management system is ready:
1. Get the API endpoint URL
2. Get the authentication credentials
3. Update `app/api/personalities/route.ts`
4. Add credentials to `.env.local`
5. Deploy to Vercel with environment variables

---

🚀 You're ready to launch chatbots with personalities!
