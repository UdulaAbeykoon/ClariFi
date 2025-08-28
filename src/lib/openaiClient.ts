import OpenAI from 'openai';

// Initialize OpenAI client
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

// Debug API key format
if (apiKey) {
  console.log('🔑 OpenAI API Key format:', {
    length: apiKey.length,
    prefix: apiKey.substring(0, 15) + '...',
    suffix: '...' + apiKey.slice(-10),
    isProjectKey: apiKey.startsWith('sk-proj-'),
    isRegularKey: apiKey.startsWith('sk-') && !apiKey.startsWith('sk-proj-'),
    expectedLength: 'should be around 164 chars for project keys'
  });
  
  // Additional validation
  if (apiKey.startsWith('sk-proj-') && apiKey.length < 150) {
    console.warn('⚠️ API key seems too short for a project key');
  }
} else {
  console.error('❌ No OpenAI API key found in environment');
}

export const openai = apiKey ? new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true // Note: In production, use server-side API
}) : null;

// System prompt for business study assistant
export const systemPrompt = `You are a helpful study assistant specialized in business courses including business valuation, accounting, and marketing. 

Your role is to:
- Explain complex business concepts clearly and concisely
- Summarize textbook chapters and key points
- Define business terms and terminology
- Create study materials like bullet-point notes and quizzes
- Answer questions about business theory and practical applications
- Cite page numbers when provided in user queries

Keep your responses:
- Educational and accurate
- Appropriately detailed for business students
- Well-structured with clear headings when needed
- Practical and applicable to real business scenarios

If users mention specific page numbers or textbook sections, reference them in your responses.`;

// Types
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatResponse {
  content: string | null;
  error: string | null;
}

// Chat completion function with retry logic
export async function getChatCompletion(messages: ChatMessage[], retries: number = 1): Promise<ChatResponse> {
  if (!openai) {
    return {
      content: null,
      error: 'OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your environment variables.'
    };
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      return {
        content: completion.choices[0]?.message?.content || "I couldn't generate a response. Please try again.",
        error: null
      };
    } catch (error: any) {
      console.error(`OpenAI API Error (attempt ${attempt + 1}):`, error);
      
      // Handle specific OpenAI error types
      let errorMessage = 'Failed to get AI response';
      
      if (error?.status === 429) {
        if (attempt < retries) {
          // Wait before retry for rate limit
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        }
        
        const isProjectKey = apiKey?.startsWith('sk-proj-');
        errorMessage = isProjectKey 
          ? '🚫 Rate limit exceeded with project key. Possible issues:\n• Project may not have billing enabled\n• Check project settings at https://platform.openai.com/settings/organization/projects\n• Verify billing at https://platform.openai.com/account/billing\n• Try creating a regular API key instead'
          : 'Rate limit exceeded. Check your OpenAI usage at https://platform.openai.com/usage';
      } else if (error?.status === 401) {
        errorMessage = 'Invalid API key. Please verify your OpenAI API key in the .env file.';
      } else if (error?.status === 403) {
        errorMessage = 'Access forbidden. Please check your OpenAI account permissions and billing status.';
      } else if (error?.status === 500) {
        errorMessage = 'OpenAI server error. Please try again in a moment.';
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      return {
        content: null,
        error: errorMessage
      };
    }
  }

  return {
    content: null,
    error: 'Failed to get AI response after retries'
  };
}

// Check if OpenAI is configured
export const isOpenAIConfigured = () => {
  return !!apiKey;
};