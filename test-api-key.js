// Simple Node.js script to test your OpenAI API key
// Run with: node test-api-key.js

import OpenAI from 'openai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const apiKey = process.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  console.error('❌ No API key found in .env file');
  process.exit(1);
}

console.log('🔑 Testing API key:', {
  length: apiKey.length,
  prefix: apiKey.substring(0, 15) + '...',
  isProjectKey: apiKey.startsWith('sk-proj-'),
});

const openai = new OpenAI({ apiKey });

async function testKey() {
  try {
    console.log('📡 Testing OpenAI connection...');
    
    // Simple test request
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Hello, respond with just "API key works!"' }],
      max_tokens: 10,
    });

    console.log('✅ Success!', response.choices[0]?.message?.content);
    console.log('💰 Usage info:', {
      prompt_tokens: response.usage?.prompt_tokens,
      completion_tokens: response.usage?.completion_tokens,
      total_tokens: response.usage?.total_tokens
    });
  } catch (error) {
    console.error('❌ Error details:', {
      status: error.status,
      message: error.message,
      type: error.type,
      code: error.code
    });
  }
}

testKey();