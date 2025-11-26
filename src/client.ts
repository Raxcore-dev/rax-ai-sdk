import fetch from 'node-fetch';
import { RaxAIConfig, ChatRequest, ChatResponse, RaxAIError as RaxAIErrorType } from './types';

export class RaxAI {
  private apiKey: string;
  private baseURL: string;
  private timeout: number;

  constructor(config: RaxAIConfig) {
    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL || 'https://ai.raxcore.dev/api';
    this.timeout = config.timeout || 30000;
  }

  // Main chat method
  async chat(request: ChatRequest): Promise<ChatResponse> {
    return this.request('/v1/chat/completions', request);
  }

  // Streaming chat
  async *chatStream(request: ChatRequest) {
    request.stream = true;
    // TODO: Implement actual streaming
    yield { content: 'Streaming coming soon...', done: false };
    yield { content: '', done: true };
  }

  // Models API - Important for platform integration
  async getModels(): Promise<{ data: Array<{ id: string; name: string }> }> {
    return this.request('/v1/models', {}, 'GET');
  }

  // Usage tracking - Important for analytics
  async getUsage(startDate?: string, endDate?: string): Promise<any> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    const endpoint = params.toString() ? `/v1/usage?${params}` : '/v1/usage';
    return this.request(endpoint, {}, 'GET');
  }

  // API key validation - Important for platform
  async validateKey(): Promise<boolean> {
    try {
      await this.getModels();
      return true;
    } catch {
      return false;
    }
  }

  // Get current configuration
  getConfig(): { baseURL: string; timeout: number } {
    return {
      baseURL: this.baseURL,
      timeout: this.timeout
    };
  }

  // Core request method with smart retry
  private async request(endpoint: string, data: any, method: string = 'POST'): Promise<any> {
    const url = `${this.baseURL}${endpoint}`;
    
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const requestOptions: any = {
          method,
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'User-Agent': 'rax-ai-sdk/1.0.0',
            'X-Platform': 'rax-ai'
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
          const error = new RaxAIError(result as RaxAIErrorType, response.status);
          
          // Don't retry client errors (4xx)
          if (response.status >= 400 && response.status < 500) {
            throw error;
          }
          
          // Retry server errors (5xx)
          if (attempt < 2) {
            await this.sleep(1000 * Math.pow(2, attempt));
            continue;
          }
          
          throw error;
        }

        return result;
      } catch (error) {
        if (error instanceof RaxAIError || attempt === 2) {
          throw error;
        }
        
        // Retry network errors with exponential backoff
        await this.sleep(1000 * Math.pow(2, attempt));
      }
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export class RaxAIError extends Error {
  public status: number;
  public type: string;
  public code?: string;

  constructor(error: RaxAIErrorType, status: number) {
    super(error.error.message);
    this.name = 'RaxAIError';
    this.status = status;
    this.type = error.error.type;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      type: this.type,
      code: this.code
    };
  }
}
