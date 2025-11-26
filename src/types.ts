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
  top_p?: number;
  stream?: boolean;
  user?: string;
}

export interface ChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: ChatMessage;
    finish_reason: 'stop' | 'length' | 'content_filter';
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface Model {
  id: string;
  name: string;
  description?: string;
  context_length?: number;
}

export interface UsageStats {
  total_requests: number;
  total_tokens: number;
  total_cost: number;
  period: {
    start: string;
    end: string;
  };
  daily_breakdown?: Array<{
    date: string;
    requests: number;
    tokens: number;
    cost: number;
  }>;
}

export interface RaxAIError {
  error: {
    message: string;
    type: 'authentication_error' | 'rate_limit_exceeded' | 'invalid_request_error' | 'server_error' | 'network_error';
    code?: string;
  };
}
