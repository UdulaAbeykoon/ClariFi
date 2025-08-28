import Cerebras from '@cerebras/cerebras_cloud_sdk';

// Initialize Cerebras client
const apiKey = import.meta.env.VITE_CEREBRAS_API_KEY;

// Debug API key format
if (apiKey) {
  console.log('🧠 Cerebras API Key format:', {
    length: apiKey.length,
    prefix: apiKey.substring(0, 10) + '...',
    suffix: '...' + apiKey.slice(-6),
    isValidFormat: apiKey.startsWith('csk-')
  });
} else {
  console.error('❌ No Cerebras API key found in environment');
}

export const cerebras = apiKey ? new Cerebras({
  apiKey: apiKey,
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

interface ChatOptions {
  temperature?: number;
  max_tokens?: number;
  useSystemPrompt?: boolean;
}

// Chat completion function with retry logic
export async function getChatCompletion(messages: ChatMessage[], options: ChatOptions = {}, retries: number = 1): Promise<ChatResponse> {
  if (!cerebras) {
    return {
      content: null,
      error: 'Cerebras API key not configured. Please add VITE_CEREBRAS_API_KEY to your environment variables.'
    };
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const completion = await cerebras.chat.completions.create({
        model: "llama3.1-8b", // Fast and efficient Cerebras model
        messages: options.useSystemPrompt !== false 
          ? [{ role: "system", content: systemPrompt }, ...messages]
          : messages,
        max_tokens: options.max_tokens || 1000,
        temperature: options.temperature || 0.7,
      });

      return {
        content: completion.choices[0]?.message?.content || "I couldn't generate a response. Please try again.",
        error: null
      };
    } catch (error: any) {
      console.error(`Cerebras API Error (attempt ${attempt + 1}):`, error);
      
      // Handle specific Cerebras error types
      let errorMessage = 'Failed to get AI response';
      
      if (error?.status === 429) {
        if (attempt < retries) {
          // Wait before retry for rate limit
          await new Promise(resolve => setTimeout(resolve, 2000));
          continue;
        }
        errorMessage = '🚫 Rate limit exceeded. Please wait a moment and try again.';
      } else if (error?.status === 401) {
        errorMessage = 'Invalid Cerebras API key. Please verify your API key in the .env file.';
      } else if (error?.status === 403) {
        errorMessage = 'Access forbidden. Please check your Cerebras account permissions.';
      } else if (error?.status === 500) {
        errorMessage = 'Cerebras server error. Please try again in a moment.';
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

// Check if Cerebras is configured
export const isCerebrasConfigured = () => {
  return !!apiKey;
};