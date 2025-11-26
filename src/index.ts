/**
 * Rax AI SDK - Official JavaScript/TypeScript SDK for Rax AI Platform
 * 
 * @packageDocumentation
 * @module rax-ai
 * 
 * @example Basic Usage
 * ```typescript
 * import { RaxAI } from 'rax-ai';
 * 
 * const rax = new RaxAI({ apiKey: 'your-api-key' });
 * 
 * const response = await rax.chat({
 *   model: 'rax-4.0',
 *   messages: [{ role: 'user', content: 'Hello!' }]
 * });
 * 
 * console.log(response.choices[0].message.content);
 * ```
 * 
 * @example Error Handling
 * ```typescript
 * import { RaxAI, RaxAIError } from 'rax-ai';
 * 
 * try {
 *   const response = await rax.chat({ ... });
 * } catch (error) {
 *   if (error instanceof RaxAIError) {
 *     console.error('API Error:', error.message);
 *   }
 * }
 * ```
 */

// Main client export
export { RaxAI, RaxAIError } from './client';

// Type exports
export type { 
  RaxAIConfig, 
  ChatMessage, 
  ChatRequest, 
  ChatResponse,
  ChatChoice,
  TokenUsage,
  Model,
  UsageStats,
  DailyUsage,
  StreamChunk,
  RaxAIError as RaxAIErrorType
} from './types';

// Default export for convenience
import { RaxAI } from './client';
export default RaxAI;
