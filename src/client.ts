import fetch from 'node-fetch';
import { RaxAIConfig, ChatRequest, ChatResponse, RaxAIError as RaxAIErrorType } from './types';

export class RaxAI {
  private apiKey: string;
  private baseURL: string;
  private timeout: number;

  constructor(config: RaxAIConfig) {
    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL || 'https://api.rax-ai.com';
    this.timeout = config.timeout || 30000;
  }

  // Simple chat method
  async chat(request: ChatRequest): Promise<ChatResponse> {
    return this.request('/v1/chat/completions', request);
  }

  // Streaming chat (coming soon)
  async *chatStream(request: ChatRequest) {
    request.stream = true;
    // Placeholder for streaming
    yield { content: 'Streaming coming soon...', done: false };
    yield { content: '', done: true };
  }

  // Simple request method with auto-retry
  private async request(endpoint: string, data: any): Promise<any> {
    const url = `${this.baseURL}${endpoint}`;
    
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(url, {
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
          const error = new RaxAIError(result as RaxAIErrorType, response.status);
          
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
      } catch (error) {
        if (error instanceof RaxAIError || attempt === 2) {
          throw error;
        }
        
        // Retry network errors
        await this.sleep(1000 * (attempt + 1));
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

  constructor(error: RaxAIErrorType, status: number) {
    super(error.error.message);
    this.name = 'RaxAIError';
    this.status = status;
    this.type = error.error.type;
  }
}
