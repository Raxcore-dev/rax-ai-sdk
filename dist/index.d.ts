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
export { RaxAI, RaxAIError } from './client';
export type { RaxAIConfig, ChatMessage, ChatRequest, ChatResponse, ChatChoice, TokenUsage, Model, UsageStats, DailyUsage, StreamChunk, RaxAIError as RaxAIErrorType } from './types';
import { RaxAI } from './client';
export default RaxAI;
//# sourceMappingURL=index.d.ts.map