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
    getModels(): Promise<{
        data: Array<{
            id: string;
            name: string;
        }>;
    }>;
    getUsage(startDate?: string, endDate?: string): Promise<any>;
    validateKey(): Promise<boolean>;
    getConfig(): {
        baseURL: string;
        timeout: number;
    };
    private request;
    private sleep;
}
export declare class RaxAIError extends Error {
    status: number;
    type: string;
    code?: string;
    constructor(error: RaxAIErrorType, status: number);
    toJSON(): {
        name: string;
        message: string;
        status: number;
        type: string;
        code: string | undefined;
    };
}
//# sourceMappingURL=client.d.ts.map