"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaxAIError = exports.RaxAI = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
class RaxAI {
    constructor(config) {
        this.apiKey = config.apiKey;
        this.baseURL = config.baseURL || 'https://api.rax-ai.com';
        this.timeout = config.timeout || 30000;
    }
    // Simple chat method
    async chat(request) {
        return this.request('/v1/chat/completions', request);
    }
    // Streaming chat (coming soon)
    async *chatStream(request) {
        request.stream = true;
        // Placeholder for streaming
        yield { content: 'Streaming coming soon...', done: false };
        yield { content: '', done: true };
    }
    // Simple request method with auto-retry
    async request(endpoint, data) {
        const url = `${this.baseURL}${endpoint}`;
        for (let attempt = 0; attempt < 3; attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.timeout);
                const response = await (0, node_fetch_1.default)(url, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                        'User-Agent': 'rax-ai-sdk/1.0.0'
                    },
                    body: JSON.stringify(data),
                    signal: controller.signal
                });
                clearTimeout(timeoutId);
                const result = await response.json();
                if (!response.ok) {
                    const error = new RaxAIError(result, response.status);
                    // Don't retry client errors
                    if (response.status < 500) {
                        throw error;
                    }
                    // Retry server errors
                    if (attempt < 2) {
                        await this.sleep(1000 * (attempt + 1));
                        continue;
                    }
                    throw error;
                }
                return result;
            }
            catch (error) {
                if (error instanceof RaxAIError || attempt === 2) {
                    throw error;
                }
                // Retry network errors
                await this.sleep(1000 * (attempt + 1));
            }
        }
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
exports.RaxAI = RaxAI;
class RaxAIError extends Error {
    constructor(error, status) {
        super(error.error.message);
        this.name = 'RaxAIError';
        this.status = status;
        this.type = error.error.type;
    }
}
exports.RaxAIError = RaxAIError;
//# sourceMappingURL=client.js.map