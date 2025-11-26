"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaxAIAPIError = exports.RaxAI = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
class RaxAI {
    constructor(config) {
        this.chat = {
            completions: {
                create: async (request) => {
                    if (request.stream) {
                        throw new RaxAIAPIError({
                            error: {
                                message: 'Streaming not supported in this method. Use createStream() instead.',
                                type: 'invalid_request_error'
                            }
                        }, 400);
                    }
                    return this.makeRequest('/v1/chat/completions', request);
                },
                createStream: async function* (request) {
                    // Streaming implementation placeholder
                    yield {
                        id: 'stream_' + Date.now(),
                        object: 'chat.completion.chunk',
                        created: Math.floor(Date.now() / 1000),
                        model: request.model,
                        choices: [{
                                index: 0,
                                delta: { content: 'Streaming coming soon...' },
                                finish_reason: null
                            }]
                    };
                }
            }
        };
        this.models = {
            list: async () => {
                return this.makeRequest('/v1/models', {});
            }
        };
        this.usage = {
            get: async (startDate, endDate) => {
                const params = new URLSearchParams();
                if (startDate)
                    params.append('start_date', startDate);
                if (endDate)
                    params.append('end_date', endDate);
                return this.makeRequest(`/v1/usage?${params.toString()}`, {}, 'GET');
            }
        };
        this.apiKey = config.apiKey;
        this.baseURL = config.baseURL || 'https://api.rax-ai.com';
        this.timeout = config.timeout || 30000;
        this.retries = config.retries || 3;
        this.retryDelay = config.retryDelay || 1000;
    }
    async makeRequest(endpoint, data, method = 'POST') {
        const url = `${this.baseURL}${endpoint}`;
        let lastError = null;
        for (let attempt = 0; attempt <= this.retries; attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.timeout);
                const requestOptions = {
                    method,
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                        'User-Agent': `rax-ai-sdk/1.0.0`,
                        'X-SDK-Version': '1.0.0',
                        'X-Request-ID': this.generateRequestId()
                    },
                    signal: controller.signal
                };
                if (method !== 'GET') {
                    requestOptions.body = JSON.stringify(data);
                }
                const response = await (0, node_fetch_1.default)(url, requestOptions);
                clearTimeout(timeoutId);
                const result = await response.json();
                if (!response.ok) {
                    const error = new RaxAIAPIError(result, response.status);
                    // Don't retry on client errors (4xx)
                    if (response.status >= 400 && response.status < 500) {
                        throw error;
                    }
                    // Retry on server errors (5xx) and rate limits
                    if (attempt < this.retries) {
                        await this.delay(this.retryDelay * Math.pow(2, attempt));
                        continue;
                    }
                    throw error;
                }
                return result;
            }
            catch (error) {
                lastError = error;
                if (error instanceof RaxAIAPIError) {
                    throw error;
                }
                // Retry on network errors
                if (attempt < this.retries) {
                    await this.delay(this.retryDelay * Math.pow(2, attempt));
                    continue;
                }
            }
        }
        throw new RaxAIAPIError({
            error: {
                message: lastError?.message || 'Network error after retries',
                type: 'network_error'
            }
        }, 0);
    }
    generateRequestId() {
        return 'req_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    // Utility methods
    async validateApiKey() {
        try {
            await this.models.list();
            return true;
        }
        catch {
            return false;
        }
    }
    getConfig() {
        return {
            baseURL: this.baseURL,
            timeout: this.timeout,
            retries: this.retries,
            retryDelay: this.retryDelay
        };
    }
}
exports.RaxAI = RaxAI;
class RaxAIAPIError extends Error {
    constructor(error, status, requestId) {
        super(error.error.message);
        this.name = 'RaxAIAPIError';
        this.status = status;
        this.type = error.error.type;
        this.code = error.error.code;
        this.requestId = requestId;
    }
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            status: this.status,
            type: this.type,
            code: this.code,
            requestId: this.requestId
        };
    }
}
exports.RaxAIAPIError = RaxAIAPIError;
//# sourceMappingURL=client.js.map