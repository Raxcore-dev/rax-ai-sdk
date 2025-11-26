import { RaxAIConfig, ChatRequest, ChatResponse, RaxAIError as RaxAIErrorType } from './types';
export declare class RaxAI {
    private apiKey;
    private baseURL;
    private timeout;
    constructor(config: RaxAIConfig);
    chat(request: ChatRequest): Promise<ChatResponse>;
    chatStream(request: ChatRequest): AsyncGenerator<{
        content: string;
        done: boolean;
    }, void, unknown>;
    private request;
    private sleep;
}
export declare class RaxAIError extends Error {
    status: number;
    type: string;
    constructor(error: RaxAIErrorType, status: number);
}
//# sourceMappingURL=client.d.ts.map