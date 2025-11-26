# 🚀 Rax AI SDK

[![npm version](https://badge.fury.io/js/rax-ai-sdk.svg)](https://www.npmjs.com/package/rax-ai-sdk)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

**Official SDK for Rax AI Platform - Simple, powerful, and integrated.**

## Install

```bash
npm install rax-ai-sdk
```

## Quick Start

```typescript
import { RaxAI } from 'rax-ai-sdk';

const rax = new RaxAI({
  apiKey: 'your-api-key'
});

const response = await rax.chat({
  model: 'rax-4.0',
  messages: [
    { role: 'user', content: 'Hello!' }
  ]
});

console.log(response.choices[0].message.content);
```

## Features

- ✅ **Simple API** - Clean, intuitive methods
- ✅ **Platform Integration** - Built for ai.raxcore.dev
- ✅ **Auto Retry** - Smart error handling with exponential backoff
- ✅ **TypeScript** - Full type safety
- ✅ **Models API** - List and manage available models
- ✅ **Usage Tracking** - Monitor your API consumption
- ✅ **Streaming** - Real-time response streaming (coming soon)

## Configuration

```typescript
const rax = new RaxAI({
  apiKey: 'your-key',
  baseURL: 'https://ai.raxcore.dev/api', // default
  timeout: 30000 // 30s default
});
```

## Core Methods

### Chat Completions
```typescript
const response = await rax.chat({
  model: 'rax-4.0',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Explain quantum computing' }
  ],
  max_tokens: 150,
  temperature: 0.7,
  top_p: 0.9
});
```

### Streaming Chat
```typescript
for await (const chunk of rax.chatStream({
  model: 'rax-4.0',
  messages: [{ role: 'user', content: 'Tell me a story...' }]
})) {
  if (!chunk.done) {
    process.stdout.write(chunk.content);
  }
}
```

### Models Management
```typescript
// Get available models
const models = await rax.getModels();
console.log(models.data);

// Validate API key
const isValid = await rax.validateKey();
console.log('Key valid:', isValid);
```

### Usage Analytics
```typescript
// Get current usage
const usage = await rax.getUsage();
console.log('Total requests:', usage.total_requests);
console.log('Total tokens:', usage.total_tokens);

// Get usage for date range
const monthlyUsage = await rax.getUsage('2024-01-01', '2024-01-31');
console.log('Monthly breakdown:', monthlyUsage.daily_breakdown);
```

## Platform Integration

### Environment Variables
```bash
# .env
RAX_AI_API_KEY=rax_xxxxxxxxxxxxxxxxxxxxx
RAX_AI_BASE_URL=https://ai.raxcore.dev/api
```

### Next.js Integration
```typescript
// app/api/chat/route.ts
import { RaxAI } from 'rax-ai-sdk';

const rax = new RaxAI({ 
  apiKey: process.env.RAX_AI_API_KEY!,
  baseURL: process.env.RAX_AI_BASE_URL
});

export async function POST(request: Request) {
  const { message } = await request.json();
  
  const response = await rax.chat({
    model: 'rax-4.0',
    messages: [{ role: 'user', content: message }]
  });
  
  return Response.json(response);
}
```

### Express.js Integration
```typescript
import { RaxAI } from 'rax-ai-sdk';

const rax = new RaxAI({ apiKey: process.env.RAX_AI_API_KEY! });

app.post('/chat', async (req, res) => {
  try {
    const response = await rax.chat({
      model: 'rax-4.0',
      messages: req.body.messages
    });
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Error Handling

```typescript
import { RaxAI, RaxAIError } from 'rax-ai-sdk';

try {
  const response = await rax.chat({...});
} catch (error) {
  if (error instanceof RaxAIError) {
    console.error('API Error:', error.message);
    console.error('Status:', error.status);
    console.error('Type:', error.type);
    console.error('Details:', error.toJSON());
  }
}
```

## Advanced Usage

### Configuration Management
```typescript
// Get current config
const config = rax.getConfig();
console.log('Base URL:', config.baseURL);
console.log('Timeout:', config.timeout);
```

### Custom Headers
The SDK automatically includes platform identification headers for better analytics and support.

### Retry Logic
- **3 automatic retries** for network errors
- **Exponential backoff** (1s, 2s, 4s delays)
- **Smart error classification** (no retry for 4xx errors)
- **Timeout handling** with abort controllers

## Get Your API Key

1. Visit [ai.raxcore.dev](https://ai.raxcore.dev)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new key
5. Start building!

## TypeScript Support

Full TypeScript definitions included:

```typescript
import type { 
  ChatMessage, 
  ChatRequest, 
  ChatResponse,
  Model,
  UsageStats
} from 'rax-ai-sdk';
```

## Examples Repository

Check out example implementations:
- Next.js chatbot
- Express.js API
- React streaming chat
- Vue.js integration

## Support

- 📖 [Documentation](https://ai.raxcore.dev/docs)
- 🎮 [Playground](https://ai.raxcore.dev/playground)
- 📊 [Dashboard](https://ai.raxcore.dev/dashboard)
- 🐛 [Issues](https://github.com/Raxcore-dev/rax-ai-sdk/issues)

---

**Built for the Rax AI Platform at [ai.raxcore.dev](https://ai.raxcore.dev)**
