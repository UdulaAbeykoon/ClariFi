import { cerebras } from './cerebrasClient';

// Simple test to validate Cerebras connection
export async function testCerebrasConnection() {
  if (!cerebras) {
    console.log('❌ Cerebras not configured');
    return false;
  }

  try {
    // Simple test call to validate the API key
    const completion = await cerebras.chat.completions.create({
      model: "llama3.1-8b",
      messages: [{ role: "user", content: "Hello, respond with just 'Cerebras works!'" }],
      max_tokens: 10,
      temperature: 0.1,
    });

    console.log('✅ Cerebras connection successful:', completion.choices[0]?.message?.content);
    return true;
  } catch (error: any) {
    console.error('❌ Cerebras connection failed:', {
      status: error?.status,
      message: error?.message,
      type: error?.type,
      code: error?.code
    });
    return false;
  }
}