# 🚀 Rax AI SDK

[![npm version](https://badge.fury.io/js/rax-ai.svg)](https://www.npmjs.com/package/rax-ai)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Official SDK for Rax AI Platform - Simple, powerful, and production-ready.**

Build AI-powered applications with the Rax AI API. This SDK provides a clean, type-safe interface for chat completions, model management, usage tracking, and more.

## Installation

```bash
npm install rax-ai
```

```bash
yarn add rax-ai
```

```bash
pnpm add rax-ai
```

## Quick Start

```typescript
import { RaxAI } from 'rax-ai';

const rax = new RaxAI({
  apiKey: 'your-api-key' // Get one at https://ai.raxcore.dev
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

- ✅ **Simple API** - Clean, intuitive methods for all operations
- ✅ **Full TypeScript Support** - Complete type definitions included
- ✅ **Auto Retry** - Smart error handling with exponential backoff
- ✅ **Streaming Support** - Real-time response streaming
- ✅ **Models API** - List and validate available models
- ✅ **Usage Tracking** - Monitor your API consumption
- ✅ **Zero Dependencies** - Uses native fetch (Node.js 18+)
- ✅ **Platform Integration** - Built for ai.raxcore.dev

## Configuration

```typescript
const rax = new RaxAI({
  apiKey: 'your-key',           // Required: Your API key
  baseURL: 'https://ai.raxcore.dev/api', // Optional: Custom base URL
  timeout: 30000                // Optional: Request timeout (default: 30s)
});
```

## API Reference

### Chat Completions

Send messages and receive AI-generated responses.

```typescript
const response = await rax.chat({
  model: 'rax-4.0',           // Required: 'rax-4.0' or 'rax-4.5'
  messages: [                  // Required: Conversation messages
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Explain quantum computing' }
  ],
  max_tokens: 1000,           // Optional: Max response length (1-4096)
  temperature: 0.7,           // Optional: Creativity (0-2)
  top_p: 0.9                  // Optional: Nucleus sampling
});

// Access the response
console.log(response.choices[0].message.content);
console.log('Tokens used:', response.usage.total_tokens);
```

### Streaming Responses

Stream responses in real-time for better UX. Streaming shows text as it's generated instead of waiting for the complete response.

```typescript
const stream = await rax.chatStream({
  model: 'rax-4.5',
  messages: [{ role: 'user', content: 'Write a short story about a robot.' }]
});

// Process chunks as they arrive
for await (const chunk of stream) {
  if (chunk.choices[0]?.delta?.content) {
    process.stdout.write(chunk.choices[0].delta.content);
  }
}
```

**Streaming in Next.js API Route:**

```typescript
// app/api/chat/route.ts
import { RaxAI } from 'rax-ai';

const rax = new RaxAI({ apiKey: process.env.RAX_AI_API_KEY! });

export async function POST(request: Request) {
  const { message } = await request.json();
  
  const stream = await rax.chatStream({
    model: 'rax-4.0',
    messages: [{ role: 'user', content: message }]
  });
  
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          controller.enqueue(encoder.encode(content));
        }
      }
      controller.close();
    }
  });
  
  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}
```

### Available Models

Get the list of available models.

```typescript
const models = await rax.getModels();

models.data.forEach(model => {
  console.log(`${model.id}: ${model.name}`);
  console.log(`  Context: ${model.context_length} tokens`);
});
```

**Available Models:**
- `rax-4.0` - Fast and efficient for general tasks
- `rax-4.5` - Advanced reasoning and complex tasks

### Usage Analytics

Track your API usage and costs.

```typescript
// Get all-time usage
const usage = await rax.getUsage();
console.log('Total requests:', usage.total_requests);
console.log('Total tokens:', usage.total_tokens);
console.log('Estimated cost:', usage.total_cost);

// Get usage for a specific date range
const monthlyUsage = await rax.getUsage('2024-01-01', '2024-01-31');
console.log('Daily breakdown:', monthlyUsage.daily_breakdown);
```

### API Key Validation

Check if your API key is valid.

```typescript
const isValid = await rax.validateKey();
if (!isValid) {
  console.error('Invalid API key. Get one at https://ai.raxcore.dev');
}
```

### Configuration Access

Get or update client configuration.

```typescript
// Get current config
const config = rax.getConfig();
console.log('Base URL:', config.baseURL);
console.log('Timeout:', config.timeout);

// Update API key
rax.setApiKey('new-api-key');
```

## Framework Integration

### Next.js (App Router)

```typescript
// app/api/chat/route.ts
import { RaxAI } from 'rax-ai';

const rax = new RaxAI({ 
  apiKey: process.env.RAX_AI_API_KEY!
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

### Express.js

```typescript
import express from 'express';
import { RaxAI } from 'rax-ai';

const app = express();
const rax = new RaxAI({ apiKey: process.env.RAX_AI_API_KEY! });

app.use(express.json());

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

app.listen(3000);
```

### React (Client-side)

```tsx
import { useState } from 'react';

// Note: Don't expose API keys in client code!
// Use a backend API route instead.

function ChatComponent() {
  const [response, setResponse] = useState('');
  
  async function sendMessage(message: string) {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    const data = await res.json();
    setResponse(data.choices[0].message.content);
  }
  
  return <div>{response}</div>;
}
```

## Error Handling

The SDK provides detailed error information and helper methods for debugging.

```typescript
import { RaxAI, RaxAIError } from 'rax-ai';

const rax = new RaxAI({ apiKey: 'rax_your_api_key' });

try {
  const response = await rax.chat({
    model: 'rax-4.0',
    messages: [{ role: 'user', content: 'Hello!' }]
  });
  console.log(response.choices[0].message.content);
} catch (error) {
  if (error instanceof RaxAIError) {
    console.error('API Error:', error.message);
    console.error('Status:', error.status);
    console.error('Code:', error.code);
    
    // Use helper methods to check error type
    if (error.isRateLimited()) {
      console.log('Rate limited. Retry after:', error.retryAfter, 'seconds');
    } else if (error.isAuthError()) {
      console.log('Authentication failed. Check your API key.');
    } else if (error.isServerError()) {
      console.log('Server error. Please retry.');
    }
    
    // Get full error details as JSON
    console.error('Full error:', error.toJSON());
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### RaxAIError Properties

| Property | Type | Description |
|----------|------|-------------|
| `message` | `string` | Human-readable error message |
| `status` | `number` | HTTP status code |
| `code` | `string` | Error code (e.g., 'rate_limit_exceeded') |
| `retryAfter` | `number \| undefined` | Seconds to wait before retrying (rate limits) |

### RaxAIError Helper Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `isRateLimited()` | `boolean` | True if rate limit exceeded (429) |
| `isAuthError()` | `boolean` | True if authentication failed (401) |
| `isServerError()` | `boolean` | True if server error (500+) |
| `toJSON()` | `object` | Full error details as plain object |

### Error Types

| Status | Type | Description |
|--------|------|-------------|
| 400 | `invalid_request_error` | Bad request format |
| 401 | `authentication_error` | Invalid API key |
| 429 | `rate_limit_exceeded` | Too many requests |
| 500 | `server_error` | Internal server error |

## Environment Variables

```bash
# .env
RAX_AI_API_KEY=rax_xxxxxxxxxxxxxxxxxxxxx
RAX_AI_BASE_URL=https://ai.raxcore.dev/api  # Optional
```

## TypeScript Support

Full TypeScript definitions are included:

```typescript
import type { 
  RaxAIConfig,
  ChatMessage, 
  ChatRequest, 
  ChatResponse,
  Model,
  UsageStats,
  StreamChunk
} from 'rax-ai';

// Type-safe usage
const messages: ChatMessage[] = [
  { role: 'system', content: 'You are helpful.' },
  { role: 'user', content: 'Hello!' }
];

const request: ChatRequest = {
  model: 'rax-4.0',
  messages,
  temperature: 0.7
};
```

## Retry Logic

The SDK automatically retries failed requests:

- **3 automatic retries** for network/server errors
- **Exponential backoff** (1s, 2s, 4s delays)
- **No retry** for client errors (4xx)
- **Timeout handling** with configurable duration

## Requirements

- Node.js 18.0.0 or higher (uses native fetch)
- TypeScript 5.0+ (optional, for type support)

## Get Your API Key

1. Visit [ai.raxcore.dev](https://ai.raxcore.dev)
2. Create an account or sign in
3. Navigate to Dashboard → API Keys
4. Create a new key
5. Copy and secure your key

## Support

- 📖 [Documentation](https://ai.raxcore.dev/dashboard/docs)
- 🎮 [Playground](https://ai.raxcore.dev/dashboard/playground)
- 📊 [Dashboard](https://ai.raxcore.dev/dashboard)
- 🐛 [Issues](https://github.com/Raxcore-dev/RaxAI/issues)

## License

MIT © [Raxcore Development Team](https://github.com/Raxcore-dev)

---

**Built for the Rax AI Platform at [ai.raxcore.dev](https://ai.raxcore.dev)**
