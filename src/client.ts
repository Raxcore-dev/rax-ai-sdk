import { 
  RaxAIConfig, 
  ChatRequest, 
  ChatResponse, 
  RaxAIError as RaxAIErrorType,
  Model,
  UsageStats,
  StreamChunk
} from './types';

// Version constant for SDK identification - keep in sync with package.json
const SDK_VERSION = '1.2.0';

/**
 * RaxAI - Official SDK Client for Rax AI Platform
 * 
 * @example
 * ```typescript
 * import { RaxAI } from 'rax-ai';
 * 
 * const rax = new RaxAI({ apiKey: 'your-api-key' });
 * 
 * const response = await rax.chat({
 *   model: 'rax-4.0',
 *   messages: [{ role: 'user', content: 'Hello!' }]
 * });
 * ```
 */
export class RaxAI {
  private apiKey: string;
  private baseURL: string;
  private timeout: number;

  /**
   * Create a new RaxAI client instance
   * 
   * @param config - Configuration options for the client
   * @param config.apiKey - Your Rax AI API key (required)
   * @param config.baseURL - API base URL (default: https://ai.raxcore.dev/api)
   * @param config.timeout - Request timeout in milliseconds (default: 30000)
   */
  constructor(config: RaxAIConfig) {
    if (!config.apiKey) {
      throw new Error('API key is required. Get one at https://ai.raxcore.dev');
    }
    this.apiKey = config.apiKey;
    this.baseURL = (config.baseURL || 'https://ai.raxcore.dev/api').replace(/\/$/, '');
    this.timeout = config.timeout || 30000;
  }

  /**
   * Send a chat completion request
   * 
   * @param request - Chat request parameters
   * @returns Promise<ChatResponse> - The completion response
   * 
   * @example
   * ```typescript
   * const response = await rax.chat({
   *   model: 'rax-4.0',
   *   messages: [
   *     { role: 'system', content: 'You are a helpful assistant.' },
   *     { role: 'user', content: 'Explain quantum computing' }
   *   ],
   *   temperature: 0.7,
   *   max_tokens: 1000
   * });
   * console.log(response.choices[0].message.content);
   * ```
   */
  async chat(request: ChatRequest): Promise<ChatResponse> {
    if (!request.messages || request.messages.length === 0) {
      throw new Error('Messages array is required and must not be empty');
    }
    return this.request<ChatResponse>('/v1/chat/completions', request);
  }

  /**
   * Send a streaming chat completion request
   * Returns an async generator that yields chunks as they arrive
   * 
   * @param request - Chat request parameters (stream will be set automatically)
   * @yields StreamChunk - Chunks of the response as they arrive
   * 
   * @example
   * ```typescript
   * for await (const chunk of rax.chatStream({
   *   model: 'rax-4.0',
   *   messages: [{ role: 'user', content: 'Tell me a story' }]
   * })) {
   *   process.stdout.write(chunk.content);
   * }
   * ```
   */
  async *chatStream(request: ChatRequest): AsyncGenerator<StreamChunk> {
    const streamRequest = { ...request, stream: true };
    
    const url = `${this.baseURL}/v1/chat/completions`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': `rax-ai/${SDK_VERSION}`,
          'X-Platform': 'rax-ai',
          'Accept': 'text/event-stream'
        },
        body: JSON.stringify(streamRequest),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: 'Unknown error', type: 'server_error' } }));
        throw new RaxAIError(errorData as RaxAIErrorType, response.status);
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          yield { content: '', done: true };
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              yield { content: '', done: true };
              return;
            }
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || '';
              if (content) {
                yield { content, done: false };
              }
            } catch {
              // Skip invalid JSON lines
            }
          }
        }
      }
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof RaxAIError) throw error;
      throw new Error(`Stream error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get available models
   * 
   * @returns Promise with list of available models
   * 
   * @example
   * ```typescript
   * const models = await rax.getModels();
   * models.data.forEach(model => {
   *   console.log(`${model.id}: ${model.name}`);
   * });
   * ```
   */
  async getModels(): Promise<{ object: string; data: Model[] }> {
    return this.request<{ object: string; data: Model[] }>('/v1/models', {}, 'GET');
  }

  /**
   * Get usage statistics for your API key
   * 
   * @param startDate - Optional start date (ISO 8601 format)
   * @param endDate - Optional end date (ISO 8601 format)
   * @returns Promise<UsageStats> - Usage statistics
   * 
   * @example
   * ```typescript
   * // Get all-time usage
   * const usage = await rax.getUsage();
   * 
   * // Get usage for specific date range
   * const monthlyUsage = await rax.getUsage('2024-01-01', '2024-01-31');
   * console.log(`Total requests: ${monthlyUsage.total_requests}`);
   * ```
   */
  async getUsage(startDate?: string, endDate?: string): Promise<UsageStats> {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    const endpoint = params.toString() ? `/v1/usage?${params}` : '/v1/usage';
    return this.request<UsageStats>(endpoint, {}, 'GET');
  }

  /**
   * Validate the API key
   * 
   * @returns Promise<boolean> - True if the API key is valid
   * 
   * @example
   * ```typescript
   * const isValid = await rax.validateKey();
   * if (!isValid) {
   *   console.error('Invalid API key');
   * }
   * ```
   */
  async validateKey(): Promise<boolean> {
    try {
      await this.getModels();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get current client configuration
   * 
   * @returns Configuration object with baseURL and timeout
   */
  getConfig(): { baseURL: string; timeout: number } {
    return {
      baseURL: this.baseURL,
      timeout: this.timeout
    };
  }

  /**
   * Update the API key
   * 
   * @param apiKey - New API key to use
   */
  setApiKey(apiKey: string): void {
    if (!apiKey) {
      throw new Error('API key is required');
    }
    this.apiKey = apiKey;
  }

  /**
   * Core request method with automatic retry logic
   * 
   * Features:
   * - 3 automatic retries for network/server errors
   * - Exponential backoff (1s, 2s, 4s delays)
   * - No retry for client errors (4xx)
   * - Timeout handling with AbortController
   */
  private async request<T>(endpoint: string, data: any, method: string = 'POST'): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    for (let attempt = 0; attempt < 3; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      try {
        const requestOptions: RequestInit = {
          method,
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'User-Agent': `rax-ai/${SDK_VERSION}`,
            'X-Platform': 'rax-ai'
          },
          signal: controller.signal
        };

        if (method !== 'GET' && data && Object.keys(data).length > 0) {
          requestOptions.body = JSON.stringify(data);
        }

        const response = await fetch(url, requestOptions);
        clearTimeout(timeoutId);

        const result = await response.json() as T | RaxAIErrorType;

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

        return result as T;
      } catch (error) {
        clearTimeout(timeoutId);
        
        if (error instanceof RaxAIError) {
          throw error;
        }
        
        // Handle abort/timeout
        if (error instanceof Error && error.name === 'AbortError') {
          if (attempt < 2) {
            await this.sleep(1000 * Math.pow(2, attempt));
            continue;
          }
          throw new Error(`Request timeout after ${this.timeout}ms`);
        }
        
        // Retry network errors with exponential backoff
        if (attempt < 2) {
          await this.sleep(1000 * Math.pow(2, attempt));
          continue;
        }
        
        throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    throw new Error('Request failed after 3 attempts');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Custom error class for Rax AI API errors
 * 
 * @example
 * ```typescript
 * try {
 *   await rax.chat({ ... });
 * } catch (error) {
 *   if (error instanceof RaxAIError) {
 *     console.error('API Error:', error.message);
 *     console.error('Status:', error.status);
 *     console.error('Type:', error.type);
 *   }
 * }
 * ```
 */
export class RaxAIError extends Error {
  /** HTTP status code */
  public status: number;
  /** Error type classification */
  public type: string;
  /** Optional error code */
  public code?: string;

  constructor(error: RaxAIErrorType, status: number) {
    const message = error?.error?.message || 'Unknown error occurred';
    super(message);
    this.name = 'RaxAIError';
    this.status = status;
    this.type = error?.error?.type || 'unknown_error';
    this.code = error?.error?.code;
  }

  /**
   * Convert error to JSON for logging
   */
  toJSON(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      type: this.type,
      code: this.code
    };
  }

  /**
   * Check if error is due to rate limiting
   */
  isRateLimited(): boolean {
    return this.status === 429 || this.type === 'rate_limit_exceeded';
  }

  /**
   * Check if error is due to authentication
   */
  isAuthError(): boolean {
    return this.status === 401 || this.type === 'authentication_error';
  }

  /**
   * Check if error is a server error (retryable)
   */
  isServerError(): boolean {
    return this.status >= 500;
  }
}
