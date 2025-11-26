export interface RaxAIConfig {
    apiKey: string;
    baseURL?: string;
    timeout?: number;
    retries?: number;
    retryDelay?: number;
}
export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
    name?: string;
}
export interface ChatCompletionRequest {
    model: string;
    messages: ChatMessage[];
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
    stop?: string | string[];
    stream?: boolean;
    user?: string;
}
export interface ChatCompletionResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Array<{
        index: number;
        message: ChatMessage;
        finish_reason: 'stop' | 'length' | 'content_filter' | 'function_call';
    }>;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}
export interface StreamChunk {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Array<{
        index: number;
        delta: {
            role?: string;
            content?: string;
        };
        finish_reason: string | null;
    }>;
}
export interface RaxAIError {
    error: {
        message: string;
        type: 'authentication_error' | 'rate_limit_exceeded' | 'invalid_request_error' | 'server_error' | 'network_error';
        code?: string;
        param?: string;
    };
}
export interface Model {
    id: string;
    object: string;
    created: number;
    owned_by: string;
}
export interface UsageData {
    total_requests: number;
    total_tokens: number;
    total_cost: number;
    date_range: {
        start: string;
        end: string;
    };
    breakdown: Array<{
        date: string;
        requests: number;
        tokens: number;
        cost: number;
    }>;
}
//# sourceMappingURL=types.d.ts.map