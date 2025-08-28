// Simple Node.js script to test your Cerebras API key
// Run with: node test-cerebras-key.js

import Cerebras from '@cerebras/cerebras_cloud_sdk';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const apiKey = process.env.VITE_CEREBRAS_API_KEY;

if (!apiKey) {
  console.error('❌ No Cerebras API key found in .env file');
  process.exit(1);
}

console.log('🧠 Testing Cerebras API key:', {
  length: apiKey.length,
  prefix: apiKey.substring(0, 10) + '...',
  isValidFormat: apiKey.startsWith('csk-'),
});

const cerebras = new Cerebras({ apiKey });

async function testKey() {
  try {
    console.log('📡 Testing Cerebras connection...');
    
    // Simple test request
    const response = await cerebras.chat.completions.create({
      model: 'llama3.1-8b',
      messages: [{ role: 'user', content: 'Hello, respond with just "Cerebras API key works!"' }],
      max_tokens: 15,
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