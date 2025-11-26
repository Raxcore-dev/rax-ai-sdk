const { RaxAI } = require('./dist/index.js');

// Platform-integrated example
async function testSDK() {
  const rax = new RaxAI({
    apiKey: 'your-api-key-here',
    baseURL: 'https://ai.raxcore.dev/api' // Production platform
    // For local development: 'http://localhost:3000/api'
  });

  try {
    console.log('🔑 Validating API key...');
    const isValid = await rax.validateKey();
    console.log('Key valid:', isValid);

    console.log('📋 Getting available models...');
    const models = await rax.getModels();
    console.log('Available models:', models.data);

    console.log('💬 Testing chat...');
    const response = await rax.chat({
      model: 'rax-4.0',
      messages: [
        { role: 'user', content: 'Hello from the integrated SDK!' }
      ],
      max_tokens: 50
    });

    console.log('✅ Chat Response:', response.choices[0].message.content);

    console.log('📊 Getting usage stats...');
    const usage = await rax.getUsage();
    console.log('Total requests:', usage.total_requests);
    console.log('Total tokens:', usage.total_tokens);

  } catch (error) {
    console.error('❌ SDK Error:', error.message);
    if (error.status) {
      console.error('Status:', error.status);
      console.error('Type:', error.type);
    }
  }
}

// Uncomment to test (make sure you have a valid API key)
// testSDK();
