const { RaxAI } = require('./dist/index.js');

// Simple example usage
async function testSDK() {
  const rax = new RaxAI({
    apiKey: 'your-api-key-here',
    baseURL: 'http://localhost:3000/api' // Point to your local dev server
  });

  try {
    const response = await rax.chat({
      model: 'rax-4.0',
      messages: [
        { role: 'user', content: 'Hello from the simplified SDK!' }
      ],
      max_tokens: 50
    });

    console.log('✅ SDK Response:', response.choices[0].message.content);
  } catch (error) {
    console.error('❌ SDK Error:', error.message);
  }
}

// Uncomment to test (make sure your server is running first)
// testSDK();
