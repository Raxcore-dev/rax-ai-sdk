export interface RaxAIConfig {
    apiKey: string;
    baseURL?: string;
    timeout?: number;
}
export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
export interface ChatRequest {
    model: string;
    messages: ChatMessage[];
    max_tokens?: number;
    temperature?: number;
    stream?: boolean;
}
export interface ChatResponse {
    id: string;
    model: string;
    choices: Array<{
        message: ChatMessage;
        finish_reason: string;
    }>;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}
export interface RaxAIError {
    error: {
        message: string;
        type: string;
    };
}
//# sourceMappingURL=types.d.ts.map