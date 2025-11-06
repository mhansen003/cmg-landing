# Chatbot Personality Feature

## Overview

The Chatbot Personality feature allows users to select a custom personality/prompt when launching chatbot tools. This enables dynamic chatbot behavior based on pre-configured personality templates managed in a separate admin system.

## Architecture

```
User clicks "Launch Chatbot"
  ↓
PersonalityModal opens
  ↓
Fetches personalities from API endpoint
  ↓
User selects a personality
  ↓
Chatbot launched with personality URL parameter
```

## Files Modified/Created

### 1. **Type Definitions** (`types/tool.ts`)
- Added `isChatbot?: boolean` flag to Tool interface
- Created `Personality` interface for personality objects

```typescript
export interface Tool {
  // ... existing fields
  isChatbot?: boolean; // Flag to identify chatbot tools
}

export interface Personality {
  id: string;
  name: string;
  description: string;
  promptUrl: string; // URL that returns the personality prompt
  icon?: string;
  createdAt: string;
  publishedPrompts?: number;
}
```

### 2. **PersonalityModal Component** (`components/PersonalityModal.tsx`)
A new modal component that:
- Fetches available personalities from `/api/personalities`
- Displays them in a selectable list
- Passes selected personality URL to launch handler
- Matches the design system with custom colors and animations

### 3. **API Endpoint** (`app/api/personalities/route.ts`)
**CURRENTLY A PLACEHOLDER** - Returns mock data based on your screenshot.

**You need to replace this with your actual endpoint!**

### 4. **ToolCard Component** (`components/ToolCard.tsx`)
Updated to:
- Accept `isChatbot` prop
- Show PersonalityModal when launching chatbot tools
- Pass personality URL as query parameter

## How It Works

### 1. Marking a Tool as a Chatbot

When creating or editing a tool, set `isChatbot: true`:

```typescript
{
  id: 'sales-bot-1',
  title: 'Sales Assistant Bot',
  description: 'AI-powered sales support',
  url: 'https://chatbot.cmgfinancial.ai/',
  isChatbot: true, // This flag enables personality selection
  // ... other fields
}
```

### 2. Launch Flow

When a user clicks "Launch Chatbot" on a chatbot tool:

1. **PersonalityModal opens**
2. **Personalities are fetched** from `/api/personalities`
3. **User selects a personality** from the list
4. **Chatbot launches** with URL like:
   ```
   https://chatbot.cmgfinancial.ai/?personality=https://your-api.com/prompts/executive-briefing
   ```

### 3. URL Parameter Format

The personality URL is passed as a query parameter named `personality`:

```
{chatbot-base-url}?personality={encoded-personality-url}
```

Example:
```
https://chatbot.cmgfinancial.ai/?personality=https%3A%2F%2Fyour-api.com%2Fprompts%2Fexecutive-briefing
```

Your chatbot application should:
1. Read the `personality` parameter from the URL
2. Fetch the prompt from that URL
3. Use it to configure the chatbot's behavior

## Wiring Up Your Actual API

### Step 1: Update the API Endpoint

Edit `app/api/personalities/route.ts` and replace the placeholder with your real endpoint:

```typescript
export async function GET(request: NextRequest) {
  try {
    // Replace this with your actual API call
    const response = await fetch('https://your-personality-api.com/api/personalities', {
      headers: {
        'Authorization': `Bearer ${process.env.PERSONALITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch personalities');
    }

    const data = await response.json();

    return NextResponse.json({
      personalities: data.personalities,
    });
  } catch (error) {
    console.error('Error fetching personalities:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch personalities',
        personalities: [],
      },
      { status: 500 }
    );
  }
}
```

### Step 2: Add Environment Variables

Add your API credentials to `.env.local`:

```bash
PERSONALITY_API_KEY=your_api_key_here
PERSONALITY_API_URL=https://your-personality-api.com
```

### Step 3: Update Vercel Environment Variables

For production deployment:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add `PERSONALITY_API_KEY` and `PERSONALITY_API_URL`
3. Redeploy the application

## Expected API Response Format

Your personality API should return data in this format:

```json
{
  "personalities": [
    {
      "id": "1",
      "name": "Executive Briefing (CMG)",
      "description": "Professional executive communication style",
      "promptUrl": "https://your-api.com/prompts/executive-briefing",
      "icon": "📊",
      "createdAt": "11/5/2025",
      "publishedPrompts": 7
    },
    {
      "id": "2",
      "name": "Teaching Assistant",
      "description": "Patient, educational approach",
      "promptUrl": "https://your-api.com/prompts/teaching-assistant",
      "icon": "🎓",
      "createdAt": "12/31/2023",
      "publishedPrompts": 0
    }
  ]
}
```

### Required Fields:
- `id` - Unique identifier
- `name` - Display name for the personality
- `description` - Brief description shown to user
- `promptUrl` - URL that returns the personality prompt

### Optional Fields:
- `icon` - Emoji or icon identifier
- `createdAt` - Creation date
- `publishedPrompts` - Count of published prompts

## Chatbot Integration

Your chatbot application needs to handle the personality parameter:

### Example Implementation (Pseudocode)

```javascript
// In your chatbot application
const urlParams = new URLSearchParams(window.location.search);
const personalityUrl = urlParams.get('personality');

if (personalityUrl) {
  // Fetch the personality prompt
  const response = await fetch(personalityUrl);
  const promptData = await response.json();

  // Configure chatbot with this personality
  chatbot.setSystemPrompt(promptData.prompt);
}
```

## Testing the Feature

### 1. Add a Test Chatbot Tool

In your tool management system or database, add a test tool:

```typescript
{
  id: 'test-chatbot',
  title: 'Test Sales Bot',
  description: 'Test chatbot for personality selection',
  url: 'https://your-chatbot.com',
  isChatbot: true,
  category: 'Sales AI Agents',
  // ... other required fields
}
```

### 2. Test the Flow

1. Navigate to the tools page
2. Find your chatbot tool (it should say "Launch Chatbot" instead of "Launch Tool")
3. Click the "Launch Chatbot" button
4. Verify the PersonalityModal opens
5. Select a personality
6. Verify the chatbot launches with the correct URL parameter

### 3. Verify URL Construction

Open browser console and check the launched URL includes the personality parameter:

```
https://your-chatbot.com?personality=https%3A%2F%2Fyour-api.com%2Fprompts%2Fexecutive-briefing
```

## UI Features

### PersonalityModal Features:
- ✅ Fetches personalities automatically when opened
- ✅ Shows loading state with spinner
- ✅ Displays error state with retry button
- ✅ Empty state when no personalities available
- ✅ Scrollable list for many personalities
- ✅ Visual selection indicator
- ✅ Custom accent color support
- ✅ Responsive design
- ✅ Keyboard navigation support

### ToolCard Updates:
- ✅ "Launch Chatbot" button text for chatbot tools
- ✅ Opens PersonalityModal instead of direct launch
- ✅ Preserves existing phone number handling
- ✅ Maintains all existing functionality (voting, rating, sharing)

## Database Schema Update

If you're storing tools in a database, add the `isChatbot` field:

### Redis/Vercel KV:
```typescript
// When creating/updating tools
await kv.set(`tool:${toolId}`, {
  // ... existing fields
  isChatbot: true,
});
```

### SQL:
```sql
ALTER TABLE tools
ADD COLUMN is_chatbot BOOLEAN DEFAULT FALSE;
```

## Troubleshooting

### Issue: PersonalityModal not showing
- Verify `isChatbot: true` is set on the tool
- Check browser console for errors
- Verify the API endpoint is accessible

### Issue: No personalities loading
- Check `/api/personalities` endpoint response
- Verify environment variables are set
- Check network tab for API errors

### Issue: URL parameter not working
- Verify URL construction in browser console
- Check chatbot application for personality parameter handling
- Ensure personality URL is properly encoded

## Future Enhancements

Possible improvements:
- [ ] Cache personalities in localStorage
- [ ] Add personality search/filter
- [ ] Show personality preview
- [ ] Remember last selected personality per user
- [ ] Add personality favorites
- [ ] Support personality categories

## Support

For questions or issues with this feature:
1. Check this documentation
2. Review the code comments in the modified files
3. Test with mock data first before connecting real API
4. Contact the development team

---

🤖 Generated with Claude Code
