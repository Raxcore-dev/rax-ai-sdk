export { RaxAI, RaxAIError } from './client';
export type { 
  RaxAIConfig, 
  ChatMessage, 
  ChatRequest, 
  ChatResponse,
  Model,
  UsageStats
} from './types';

// Default export for convenience
import { RaxAI } from './client';
export default RaxAI;
