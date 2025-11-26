import { RaxAIConfig, ChatCompletionRequest, ChatCompletionResponse, RaxAIError, StreamChunk } from './types';
export declare class RaxAI {
    private apiKey;
    private baseURL;
    private timeout;
    private retries;
    private retryDelay;
    constructor(config: RaxAIConfig);
    chat: {
        completions: {
            create: (request: ChatCompletionRequest) => Promise<ChatCompletionResponse>;
            createStream: (request: ChatCompletionRequest) => AsyncGenerator<StreamChunk>;
        };
    };
    models: {
        list: () => Promise<{
            data: Array<{
                id: string;
                object: string;
                created: number;
            }>;
        }>;
    };
    usage: {
        get: (startDate?: string, endDate?: string) => Promise<any>;
    };
    private makeRequest;
    private generateRequestId;
    private delay;
    validateApiKey(): Promise<boolean>;
    getConfig(): Partial<RaxAIConfig>;
}
export declare class RaxAIAPIError extends Error {
    status: number;
    type: string;
    code?: string;
    requestId?: string;
    constructor(error: RaxAIError, status: number, requestId?: string);
    toJSON(): {
        name: string;
        message: string;
        status: number;
        type: string;
        code: string | undefined;
        requestId: string | undefined;
    };
}
//# sourceMappingURL=client.d.ts.map