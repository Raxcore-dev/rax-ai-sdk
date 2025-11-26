/**
 * Rax AI SDK Type Definitions
 * @module rax-ai/types
 */
/**
 * Configuration options for the RaxAI client
 */
export interface RaxAIConfig {
    /** Your Rax AI API key (required). Get one at https://ai.raxcore.dev */
    apiKey: string;
    /** API base URL (default: https://ai.raxcore.dev/api) */
    baseURL?: string;
    /** Request timeout in milliseconds (default: 30000) */
    timeout?: number;
}
/**
 * Chat message object
 */
export interface ChatMessage {
    /** Role of the message sender */
    role: 'system' | 'user' | 'assistant';
    /** Content of the message */
    content: string;
}
/**
 * Chat completion request parameters
 */
export interface ChatRequest {
    /** Model to use (rax-4.0 or rax-4.5) */
    model: 'rax-4.0' | 'rax-4.5';
    /** Array of messages in the conversation */
    messages: ChatMessage[];
    /** Maximum tokens to generate (1-4096, default: 1000) */
    max_tokens?: number;
    /** Sampling temperature (0-2, default: 0.7) */
    temperature?: number;
    /** Top-p sampling parameter (0-1) */
    top_p?: number;
    /** Enable streaming response */
    stream?: boolean;
    /** Optional user identifier for tracking */
    user?: string;
}
/**
 * Chat completion response
 */
export interface ChatResponse {
    /** Unique response identifier */
    id: string;
    /** Object type (always 'chat.completion') */
    object: string;
    /** Unix timestamp of creation */
    created: number;
    /** Model used for completion */
    model: string;
    /** Array of completion choices */
    choices: ChatChoice[];
    /** Token usage statistics */
    usage: TokenUsage;
}
/**
 * Individual chat choice in a response
 */
export interface ChatChoice {
    /** Index of the choice */
    index: number;
    /** Generated message */
    message: ChatMessage;
    /** Reason the completion stopped */
    finish_reason: 'stop' | 'length' | 'content_filter';
}
/**
 * Token usage statistics
 */
export interface TokenUsage {
    /** Tokens used in the prompt */
    prompt_tokens: number;
    /** Tokens generated in the completion */
    completion_tokens: number;
    /** Total tokens used */
    total_tokens: number;
}
/**
 * Model information
 */
export interface Model {
    /** Model identifier (e.g., 'rax-4.0') */
    id: string;
    /** Human-readable model name */
    name: string;
    /** Model description */
    description?: string;
    /** Maximum context length in tokens */
    context_length?: number;
    /** Model owner */
    owned_by?: string;
}
/**
 * Usage statistics response
 */
export interface UsageStats {
    /** Total number of API requests */
    total_requests: number;
    /** Total tokens consumed */
    total_tokens: number;
    /** Estimated total cost */
    total_cost: number;
    /** Time period for the statistics */
    period: {
        /** Start date (ISO 8601) */
        start: string;
        /** End date (ISO 8601) */
        end: string;
    };
    /** Optional daily breakdown of usage */
    daily_breakdown?: DailyUsage[];
}
/**
 * Daily usage breakdown
 */
export interface DailyUsage {
    /** Date (ISO 8601) */
    date: string;
    /** Number of requests */
    requests: number;
    /** Tokens consumed */
    tokens: number;
    /** Cost for the day */
    cost: number;
}
/**
 * Streaming response chunk
 */
export interface StreamChunk {
    /** Content fragment */
    content: string;
    /** Whether this is the final chunk */
    done: boolean;
}
/**
 * API error response format
 */
export interface RaxAIError {
    error: {
        /** Error message */
        message: string;
        /** Error type classification */
        type: 'authentication_error' | 'rate_limit_exceeded' | 'invalid_request_error' | 'server_error' | 'network_error';
        /** Optional error code */
        code?: string;
    };
}
//# sourceMappingURL=types.d.ts.map