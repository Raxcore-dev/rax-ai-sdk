import { RaxAIConfig, ChatRequest, ChatResponse, RaxAIError as RaxAIErrorType, Model, UsageStats, StreamChunk } from './types';
/**
 * RaxAI - Official SDK Client for Rax AI Platform
 *
 * @example
 * ```typescript
 * import { RaxAI } from 'rax-ai';
 *
 * const rax = new RaxAI({ apiKey: 'your-api-key' });
 *
 * const response = await rax.chat({
 *   model: 'rax-4.0',
 *   messages: [{ role: 'user', content: 'Hello!' }]
 * });
 * ```
 */
export declare class RaxAI {
    private apiKey;
    private baseURL;
    private timeout;
    /**
     * Create a new RaxAI client instance
     *
     * @param config - Configuration options for the client
     * @param config.apiKey - Your Rax AI API key (required)
     * @param config.baseURL - API base URL (default: https://ai.raxcore.dev/api)
     * @param config.timeout - Request timeout in milliseconds (default: 30000)
     */
    constructor(config: RaxAIConfig);
    /**
     * Send a chat completion request
     *
     * @param request - Chat request parameters
     * @returns Promise<ChatResponse> - The completion response
     *
     * @example
     * ```typescript
     * const response = await rax.chat({
     *   model: 'rax-4.0',
     *   messages: [
     *     { role: 'system', content: 'You are a helpful assistant.' },
     *     { role: 'user', content: 'Explain quantum computing' }
     *   ],
     *   temperature: 0.7,
     *   max_tokens: 1000
     * });
     * console.log(response.choices[0].message.content);
     * ```
     */
    chat(request: ChatRequest): Promise<ChatResponse>;
    /**
     * Send a streaming chat completion request
     * Returns an async generator that yields chunks as they arrive
     *
     * @param request - Chat request parameters (stream will be set automatically)
     * @yields StreamChunk - Chunks of the response as they arrive
     *
     * @example
     * ```typescript
     * for await (const chunk of rax.chatStream({
     *   model: 'rax-4.0',
     *   messages: [{ role: 'user', content: 'Tell me a story' }]
     * })) {
     *   process.stdout.write(chunk.content);
     * }
     * ```
     */
    chatStream(request: ChatRequest): AsyncGenerator<StreamChunk>;
    /**
     * Get available models
     *
     * @returns Promise with list of available models
     *
     * @example
     * ```typescript
     * const models = await rax.getModels();
     * models.data.forEach(model => {
     *   console.log(`${model.id}: ${model.name}`);
     * });
     * ```
     */
    getModels(): Promise<{
        object: string;
        data: Model[];
    }>;
    /**
     * Get usage statistics for your API key
     *
     * @param startDate - Optional start date (ISO 8601 format)
     * @param endDate - Optional end date (ISO 8601 format)
     * @returns Promise<UsageStats> - Usage statistics
     *
     * @example
     * ```typescript
     * // Get all-time usage
     * const usage = await rax.getUsage();
     *
     * // Get usage for specific date range
     * const monthlyUsage = await rax.getUsage('2024-01-01', '2024-01-31');
     * console.log(`Total requests: ${monthlyUsage.total_requests}`);
     * ```
     */
    getUsage(startDate?: string, endDate?: string): Promise<UsageStats>;
    /**
     * Validate the API key
     *
     * @returns Promise<boolean> - True if the API key is valid
     *
     * @example
     * ```typescript
     * const isValid = await rax.validateKey();
     * if (!isValid) {
     *   console.error('Invalid API key');
     * }
     * ```
     */
    validateKey(): Promise<boolean>;
    /**
     * Get current client configuration
     *
     * @returns Configuration object with baseURL and timeout
     */
    getConfig(): {
        baseURL: string;
        timeout: number;
    };
    /**
     * Update the API key
     *
     * @param apiKey - New API key to use
     */
    setApiKey(apiKey: string): void;
    /**
     * Core request method with automatic retry logic
     *
     * Features:
     * - 3 automatic retries for network/server errors
     * - Exponential backoff (1s, 2s, 4s delays)
     * - No retry for client errors (4xx)
     * - Timeout handling with AbortController
     */
    private request;
    private sleep;
}
/**
 * Custom error class for Rax AI API errors
 *
 * @example
 * ```typescript
 * try {
 *   await rax.chat({ ... });
 * } catch (error) {
 *   if (error instanceof RaxAIError) {
 *     console.error('API Error:', error.message);
 *     console.error('Status:', error.status);
 *     console.error('Type:', error.type);
 *   }
 * }
 * ```
 */
export declare class RaxAIError extends Error {
    /** HTTP status code */
    status: number;
    /** Error type classification */
    type: string;
    /** Optional error code */
    code?: string;
    constructor(error: RaxAIErrorType, status: number);
    /**
     * Convert error to JSON for logging
     */
    toJSON(): Record<string, any>;
    /**
     * Check if error is due to rate limiting
     */
    isRateLimited(): boolean;
    /**
     * Check if error is due to authentication
     */
    isAuthError(): boolean;
    /**
     * Check if error is a server error (retryable)
     */
    isServerError(): boolean;
}
//# sourceMappingURL=client.d.ts.map