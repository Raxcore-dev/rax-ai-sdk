"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaxAIError = exports.RaxAI = void 0;
// Main client export
var client_1 = require("./client");
Object.defineProperty(exports, "RaxAI", { enumerable: true, get: function () { return client_1.RaxAI; } });
Object.defineProperty(exports, "RaxAIError", { enumerable: true, get: function () { return client_1.RaxAIError; } });
// Default export for convenience
const client_2 = require("./client");
exports.default = client_2.RaxAI;
//# sourceMappingURL=index.js.map