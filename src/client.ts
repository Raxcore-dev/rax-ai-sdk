import fetch from 'node-fetch';
import { RaxAIConfig, ChatCompletionRequest, ChatCompletionResponse, RaxAIError, StreamChunk } from './types';

export class RaxAI {
  private apiKey: string;
  private baseURL: string;
  private timeout: number;
  private retries: number;
  private retryDelay: number;

  constructor(config: RaxAIConfig) {
    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL || 'https://api.rax-ai.com';
    this.timeout = config.timeout || 30000;
    this.retries = config.retries || 3;
    this.retryDelay = config.retryDelay || 1000;
  }

  public chat = {
    completions: {
      create: async (request: ChatCompletionRequest): Promise<ChatCompletionResponse> => {
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

      createStream: async function* (request: ChatCompletionRequest): AsyncGenerator<StreamChunk> {
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

  public models = {
    list: async (): Promise<{ data: Array<{ id: string; object: string; created: number }> }> => {
      return this.makeRequest('/v1/models', {});
    }
  };

  public usage = {
    get: async (startDate?: string, endDate?: string): Promise<any> => {
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      return this.makeRequest(`/v1/usage?${params.toString()}`, {}, 'GET');
    }
  };

  private async makeRequest(endpoint: string, data: any, method: string = 'POST'): Promise<any> {
    const url = `${this.baseURL}${endpoint}`;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const requestOptions: any = {
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

        const response = await fetch(url, requestOptions);
        clearTimeout(timeoutId);

        const result = await response.json();

        if (!response.ok) {
          const error = new RaxAIAPIError(result as RaxAIError, response.status);
          
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
      } catch (error) {
        lastError = error as Error;
        
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

  private generateRequestId(): string {
    return 'req_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Utility methods
  public async validateApiKey(): Promise<boolean> {
    try {
      await this.models.list();
      return true;
    } catch {
      return false;
    }
  }

  public getConfig(): Partial<RaxAIConfig> {
    return {
      baseURL: this.baseURL,
      timeout: this.timeout,
      retries: this.retries,
      retryDelay: this.retryDelay
    };
  }
}

export class RaxAIAPIError extends Error {
  public status: number;
  public type: string;
  public code?: string;
  public requestId?: string;

  constructor(error: RaxAIError, status: number, requestId?: string) {
    super(error.error.message);
    this.name = 'RaxAIAPIError';
    this.status = status;
    this.type = error.error.type;
    this.code = error.error.code;
    this.requestId = requestId;
  }

  public toJSON() {
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
