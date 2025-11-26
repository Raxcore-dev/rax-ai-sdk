# 🚀 Rax AI SDK

[![npm version](https://badge.fury.io/js/rax-ai-sdk.svg)](https://www.npmjs.com/package/rax-ai-sdk)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

**Simple, powerful AI API client. Just works.**

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

- ✅ **Simple API** - One method for chat
- ✅ **Auto Retry** - Handles failures automatically  
- ✅ **TypeScript** - Full type safety
- ✅ **Streaming** - Coming soon
- ✅ **Lightweight** - No bloat

## Configuration

```typescript
const rax = new RaxAI({
  apiKey: 'your-key',
  baseURL: 'https://api.rax-ai.com', // optional
  timeout: 30000 // optional, 30s default
});
```

## Chat Options

```typescript
await rax.chat({
  model: 'rax-4.0',           // required
  messages: [...],            // required
  max_tokens: 100,           // optional
  temperature: 0.7,          // optional
  stream: false              // optional
});
```

## Streaming (Preview)

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

## Error Handling

```typescript
import { RaxAI, RaxAIError } from 'rax-ai-sdk';

try {
  const response = await rax.chat({...});
} catch (error) {
  if (error instanceof RaxAIError) {
    console.error('API Error:', error.message);
    console.error('Status:', error.status);
  }
}
```

## Environment Variables

```bash
# .env
RAX_AI_API_KEY=your-key-here
```

```typescript
const rax = new RaxAI({
  apiKey: process.env.RAX_AI_API_KEY!
});
```

## Get Your API Key

1. Sign up at [Rax AI Dashboard](https://rax-ai.com/dashboard)
2. Create an API key
3. Start building!

## Examples

### Next.js API Route
```typescript
// app/api/chat/route.ts
import { RaxAI } from 'rax-ai-sdk';

const rax = new RaxAI({ apiKey: process.env.RAX_AI_API_KEY! });

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
import { RaxAI } from 'rax-ai-sdk';

const rax = new RaxAI({ apiKey: process.env.RAX_AI_API_KEY! });

app.post('/chat', async (req, res) => {
  const response = await rax.chat({
    model: 'rax-4.0',
    messages: req.body.messages
  });
  
  res.json(response);
});
```

## That's It!

Simple, powerful, and just works. No complexity, no bloat.

---

**Built by [Raxcore](https://github.com/Raxcore-dev)**
