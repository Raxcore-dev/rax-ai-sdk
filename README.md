# 🚀 Rax AI SDK - Next-Generation AI API Client

[![npm version](https://badge.fury.io/js/rax-ai-sdk.svg)](https://www.npmjs.com/package/rax-ai-sdk)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/Raxcore-dev/RaxAI.svg?style=social&label=Star)](https://github.com/Raxcore-dev/RaxAI)

**The most advanced AI API client with enterprise features, intelligent retries, and developer-first design.**

Build powerful AI applications with Rax AI's TypeScript-first SDK. Get enterprise-grade reliability, advanced error handling, and seamless integration in one lightweight package.

## 🌟 Why Rax AI SDK?

- ⚡ **Intelligent Retries** - Exponential backoff with smart error handling
- 🔒 **Enterprise Security** - Request IDs, rate limiting, comprehensive logging
- 📊 **Built-in Analytics** - Usage tracking and performance monitoring
- 🎯 **TypeScript First** - Complete type safety and IntelliSense
- 🚀 **Production Ready** - Battle-tested, scalable, reliable
- 🛠️ **Developer Experience** - Intuitive API, rich error messages
- 📈 **Advanced Features** - Streaming, models API, usage analytics

## 📦 Installation

```bash
npm install rax-ai-sdk
# or
yarn add rax-ai-sdk
# or  
pnpm add rax-ai-sdk
```

## ⚡ Quick Start

```typescript
import { RaxAI } from 'rax-ai-sdk';

// Initialize with your API key
const rax = new RaxAI({
  apiKey: 'your-rax-ai-api-key'
});

// Create chat completion
const response = await rax.chat.completions.create({
  model: 'rax-4.0',
  messages: [
    { role: 'user', content: 'Explain quantum computing simply' }
  ]
});

console.log(response.choices[0].message.content);
```

## 🔥 Advanced Features

### Intelligent Configuration
```typescript
const rax = new RaxAI({
  apiKey: process.env.RAX_AI_API_KEY,
  baseURL: 'https://api.rax-ai.com',
  timeout: 60000,      // 60 second timeout
  retries: 3,          // Retry failed requests 3 times
  retryDelay: 1000     // Start with 1s delay, exponential backoff
});
```

### Streaming Responses
```typescript
const stream = rax.chat.completions.createStream({
  model: 'rax-4.0',
  messages: [{ role: 'user', content: 'Write a story...' }]
});

for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content || '');
}
```

### Models Management
```typescript
// List available models
const models = await rax.models.list();
console.log(models.data);

// Validate API key
const isValid = await rax.validateApiKey();
console.log('API Key valid:', isValid);
```

### Usage Analytics
```typescript
// Get usage data for date range
const usage = await rax.usage.get('2024-01-01', '2024-01-31');
console.log('Total requests:', usage.total_requests);
console.log('Total tokens:', usage.total_tokens);
```

### Advanced Error Handling
```typescript
import { RaxAI, RaxAIAPIError } from 'rax-ai-sdk';

try {
  const response = await rax.chat.completions.create({
    model: 'rax-4.0',
    messages: [{ role: 'user', content: 'Hello!' }]
  });
} catch (error) {
  if (error instanceof RaxAIAPIError) {
    console.error(`API Error [${error.status}]:`, error.message);
    console.error('Type:', error.type);
    console.error('Request ID:', error.requestId);
    console.error('Full details:', error.toJSON());
  } else {
    console.error('Network Error:', error.message);
  }
}
```

## 🛠️ Configuration Options

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `apiKey` | `string` | **required** | Your Rax AI API key |
| `baseURL` | `string` | `https://api.rax-ai.com` | API endpoint URL |
| `timeout` | `number` | `30000` | Request timeout (ms) |
| `retries` | `number` | `3` | Number of retry attempts |
| `retryDelay` | `number` | `1000` | Initial retry delay (ms) |

## 📖 API Reference

### Chat Completions

Create intelligent chat completions with advanced AI models.

```typescript
await rax.chat.completions.create(request: ChatCompletionRequest)
await rax.chat.completions.createStream(request: ChatCompletionRequest)
```

#### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `model` | `string` | ✅ | AI model (e.g., 'rax-4.0') |
| `messages` | `ChatMessage[]` | ✅ | Conversation messages |
| `max_tokens` | `number` | ❌ | Maximum tokens to generate |
| `temperature` | `number` | ❌ | Creativity level (0.0-2.0) |
| `top_p` | `number` | ❌ | Nucleus sampling |
| `frequency_penalty` | `number` | ❌ | Frequency penalty (-2.0 to 2.0) |
| `presence_penalty` | `number` | ❌ | Presence penalty (-2.0 to 2.0) |
| `stop` | `string \| string[]` | ❌ | Stop sequences |
| `user` | `string` | ❌ | User identifier |

### Models API

```typescript
// List all available models
const models = await rax.models.list();
```

### Usage API

```typescript
// Get usage statistics
const usage = await rax.usage.get(startDate?, endDate?);
```

## 🔑 Getting Your API Key

1. **Sign up** at [Rax AI Dashboard](https://rax-ai.com/dashboard)
2. **Navigate** to API Keys section  
3. **Create** a new API key
4. **Copy** and use in your application

```bash
# Add to your .env file
RAX_AI_API_KEY=rax_xxxxxxxxxxxxxxxxxxxxx
```

## 🚨 Error Types & Handling

| Error Type | HTTP Status | Description | Retry? |
|------------|-------------|-------------|--------|
| `authentication_error` | 401 | Invalid API key | ❌ |
| `rate_limit_exceeded` | 429 | Too many requests | ✅ |
| `invalid_request_error` | 400 | Bad request | ❌ |
| `server_error` | 500+ | Server issues | ✅ |
| `network_error` | 0 | Connection issues | ✅ |

## 🌐 Framework Examples

### Next.js App Router
```typescript
// app/api/chat/route.ts
import { RaxAI } from 'rax-ai-sdk';

const rax = new RaxAI({ apiKey: process.env.RAX_AI_API_KEY! });

export async function POST(request: Request) {
  const { message } = await request.json();
  
  const response = await rax.chat.completions.create({
    model: 'rax-4.0',
    messages: [{ role: 'user', content: message }]
  });
  
  return Response.json(response);
}
```

### Express.js
```typescript
import express from 'express';
import { RaxAI } from 'rax-ai-sdk';

const app = express();
const rax = new RaxAI({ apiKey: process.env.RAX_AI_API_KEY! });

app.post('/chat', async (req, res) => {
  try {
    const response = await rax.chat.completions.create({
      model: 'rax-4.0',
      messages: req.body.messages
    });
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## 🔧 Utility Methods

```typescript
// Validate API key
const isValid = await rax.validateApiKey();

// Get current configuration
const config = rax.getConfig();
console.log(config);
```

## 📊 Performance Features

- **Automatic Retries** - Exponential backoff for failed requests
- **Request IDs** - Track requests across your application
- **Timeout Handling** - Configurable timeouts with abort controllers
- **Error Classification** - Smart retry logic based on error types
- **Connection Pooling** - Efficient HTTP connection management

## 🚀 Migration Guide

### From Other AI SDKs

Rax AI SDK provides a clean, modern interface:

```typescript
// Simple and intuitive
import { RaxAI } from 'rax-ai-sdk';

const rax = new RaxAI({ apiKey: 'your-key' });

const response = await rax.chat.completions.create({
  model: 'rax-4.0',
  messages: [{ role: 'user', content: 'Hello!' }]
});
```

## 📚 Resources

- 🏠 [Homepage](https://rax-ai.com)
- 📖 [Documentation](https://docs.rax-ai.com)
- 🎮 [Playground](https://rax-ai.com/playground)
- 📊 [Dashboard](https://rax-ai.com/dashboard)
- 💬 [Discord](https://discord.gg/rax-ai)
- 🐛 [Issues](https://github.com/Raxcore-dev/RaxAI/issues)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/Raxcore-dev/RaxAI/blob/main/CONTRIBUTING.md).

## 📄 License

MIT License - see [LICENSE](https://github.com/Raxcore-dev/RaxAI/blob/main/LICENSE) file.

---

<div align="center">

**Built with ❤️ by the [Raxcore Development Team](https://github.com/Raxcore-dev)**

[Get Started](https://rax-ai.com/dashboard) • [Documentation](https://docs.rax-ai.com) • [Community](https://discord.gg/rax-ai)

</div>
