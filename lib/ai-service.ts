import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate intelligent tags for a tool using OpenAI
 * Returns 3-7 relevant tags based on tool characteristics
 */
export async function generateToolTags(
  title: string,
  description: string,
  fullDescription: string,
  category: string,
  url: string
): Promise<string[]> {
  try {
    const prompt = `You are an expert at categorizing business tools for a mortgage company (CMG Financial).

Analyze this tool and suggest 3-7 relevant tags for search and categorization:

Title: ${title}
Category: ${category}
Description: ${description}
Full Description: ${fullDescription || 'N/A'}
URL: ${url}

Choose tags from these categories (you can also suggest new ones if highly relevant):

**Departments:**
- Sales
- Operations
- Underwriting
- Processing
- Closing
- IT/Technology
- HR/People
- Marketing
- Finance
- Legal/Compliance
- Executive/Management

**User Types:**
- Loan Officers
- Loan Officer Assistants
- Branch Managers
- Underwriters
- Processors
- Closers
- Operations Staff
- Marketing Team
- HR Team
- IT Team
- Executives

**Functions:**
- Communication
- Documentation
- Training
- Analytics
- Reporting
- Automation
- AI/Machine Learning
- Customer Service
- Lead Generation
- CRM
- Workflow Management
- Data Management
- Compliance
- Integration
- Collaboration

**Specific Use Cases:**
- Loan Origination
- Document Processing
- Guideline Research
- Income Verification
- Property Valuation
- Rate Shopping
- Pipeline Management
- Borrower Communication
- Team Coordination
- Change Management

Return ONLY a JSON array of 3-7 tag strings, nothing else.
Example: ["Sales", "Loan Officers", "AI/Machine Learning", "Guideline Research", "Automation"]

Focus on the most relevant and useful tags for helping users discover this tool through search.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a tagging expert for business software tools. Return only valid JSON arrays.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const response = completion.choices[0]?.message?.content?.trim();
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Parse JSON response
    const tags = JSON.parse(response);

    // Validate and sanitize
    if (!Array.isArray(tags)) {
      throw new Error('Invalid response format');
    }

    // Ensure 3-7 tags
    const sanitizedTags = tags
      .filter((tag) => typeof tag === 'string' && tag.trim().length > 0)
      .map((tag) => tag.trim())
      .slice(0, 7);

    if (sanitizedTags.length < 3) {
      // Fallback to basic tags based on category
      return [category, 'Tools', 'CMG'];
    }

    return sanitizedTags;
  } catch (error) {
    console.error('Error generating tags with OpenAI:', error);

    // Fallback: Return basic tags based on category and title
    const fallbackTags = [category];

    // Add common tags based on keywords
    const text = `${title} ${description} ${fullDescription}`.toLowerCase();

    if (text.includes('ai') || text.includes('artificial intelligence')) {
      fallbackTags.push('AI/Machine Learning');
    }
    if (text.includes('loan officer') || text.includes('lo')) {
      fallbackTags.push('Loan Officers');
    }
    if (text.includes('sales')) {
      fallbackTags.push('Sales');
    }
    if (text.includes('document')) {
      fallbackTags.push('Document Processing');
    }
    if (text.includes('guideline')) {
      fallbackTags.push('Guideline Research');
    }
    if (text.includes('automation') || text.includes('automated')) {
      fallbackTags.push('Automation');
    }

    // Ensure at least 3 tags
    while (fallbackTags.length < 3) {
      fallbackTags.push('Tools');
    }

    return fallbackTags.slice(0, 7);
  }
}

/**
 * Capture a screenshot of a URL using a screenshot API
 * Returns the screenshot URL or null if failed
 */
export async function captureScreenshot(url: string): Promise<string | null> {
  try {
    // Using ScreenshotAPI.net (free tier: 100 screenshots/month)
    // Alternative: ApiFlash, ScreenshotOne, etc.
    const screenshotApiKey = process.env.SCREENSHOT_API_KEY;

    if (!screenshotApiKey) {
      console.warn('SCREENSHOT_API_KEY not configured, skipping screenshot capture');
      return null;
    }

    // Screenshot API endpoint
    const apiUrl = new URL('https://shot.screenshotapi.net/screenshot');
    apiUrl.searchParams.append('token', screenshotApiKey);
    apiUrl.searchParams.append('url', url);
    apiUrl.searchParams.append('output', 'json');
    apiUrl.searchParams.append('file_type', 'png');
    apiUrl.searchParams.append('wait_for_event', 'load');
    apiUrl.searchParams.append('width', '1920');
    apiUrl.searchParams.append('height', '1080');
    apiUrl.searchParams.append('fresh', 'true'); // Don't use cached screenshots

    const response = await fetch(apiUrl.toString());

    if (!response.ok) {
      throw new Error(`Screenshot API error: ${response.statusText}`);
    }

    const data = await response.json();

    // The API returns a screenshot URL
    if (data.screenshot) {
      return data.screenshot;
    }

    throw new Error('No screenshot URL in response');
  } catch (error) {
    console.error('Error capturing screenshot:', error);
    return null;
  }
}

/**
 * Alternative screenshot method using Puppeteer-based service
 * This would require a separate service deployment
 */
export async function captureScreenshotPuppeteer(url: string): Promise<string | null> {
  try {
    // If you deploy a custom Puppeteer service, use this endpoint
    const screenshotServiceUrl = process.env.SCREENSHOT_SERVICE_URL;

    if (!screenshotServiceUrl) {
      console.warn('SCREENSHOT_SERVICE_URL not configured');
      return null;
    }

    const response = await fetch(screenshotServiceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        width: 1920,
        height: 1080,
        format: 'png',
      }),
    });

    if (!response.ok) {
      throw new Error(`Screenshot service error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.screenshotUrl || null;
  } catch (error) {
    console.error('Error capturing screenshot with Puppeteer service:', error);
    return null;
  }
}
