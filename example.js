/**
 * Rax AI SDK Example
 * 
 * This example demonstrates how to use the Rax AI SDK.
 * Run: node example.js
 * 
 * Make sure to:
 * 1. Build the SDK first: npm run build
 * 2. Set your API key below or use environment variable RAX_AI_API_KEY
 */

const { RaxAI } = require('./dist/index.js');

// Configuration
const API_KEY = process.env.RAX_AI_API_KEY || 'your-api-key-here';
const BASE_URL = process.env.RAX_AI_BASE_URL || 'https://ai.raxcore.dev/api';

async function main() {
  console.log('🚀 Rax AI SDK Example\n');

  // Initialize the client
  const rax = new RaxAI({
    apiKey: API_KEY,
    baseURL: BASE_URL,
    timeout: 30000
  });

  try {
    // 1. Validate API Key
    console.log('🔑 Validating API key...');
    const isValid = await rax.validateKey();
    console.log(`   Key valid: ${isValid}\n`);

    if (!isValid) {
      console.error('❌ Invalid API key. Get one at https://ai.raxcore.dev');
      return;
    }

    // 2. Get Available Models
    console.log('📋 Getting available models...');
    const models = await rax.getModels();
    console.log('   Available models:');
    models.data.forEach(model => {
      console.log(`   - ${model.id}: ${model.name}`);
    });
    console.log();

    // 3. Simple Chat Completion
    console.log('💬 Testing chat completion...');
    const chatResponse = await rax.chat({
      model: 'rax-4.0',
      messages: [
        { role: 'user', content: 'Hello! What is 2 + 2?' }
      ],
      max_tokens: 100,
      temperature: 0.7
    });

    console.log('   Response:', chatResponse.choices[0].message.content);
    console.log(`   Tokens used: ${chatResponse.usage.total_tokens}`);
    console.log();

    // 4. Chat with System Message
    console.log('💬 Testing chat with system message...');
    const assistantResponse = await rax.chat({
      model: 'rax-4.0',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that responds in JSON format.' },
        { role: 'user', content: 'Give me a JSON object with name "Rax AI" and version "1.0"' }
      ],
      max_tokens: 200,
      temperature: 0.3
    });

    console.log('   Response:', assistantResponse.choices[0].message.content);
    console.log();

    // 5. Get Usage Statistics
    console.log('📊 Getting usage statistics...');
    const usage = await rax.getUsage();
    console.log(`   Total requests: ${usage.total_requests}`);
    console.log(`   Total tokens: ${usage.total_tokens}`);
    console.log(`   Estimated cost: $${usage.total_cost.toFixed(4)}`);
    console.log();

    // 6. Get Client Configuration
    console.log('⚙️  Client configuration:');
    const config = rax.getConfig();
    console.log(`   Base URL: ${config.baseURL}`);
    console.log(`   Timeout: ${config.timeout}ms`);
    console.log();

    console.log('✅ All tests completed successfully!');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.status) {
      console.error('   Status:', error.status);
      console.error('   Type:', error.type);
    }
    if (error.isRateLimited && error.isRateLimited()) {
      console.error('   Rate limited. Please wait and retry.');
    }
    if (error.isAuthError && error.isAuthError()) {
      console.error('   Authentication error. Check your API key.');
    }
  }
}

// Run the example
main().catch(console.error);
