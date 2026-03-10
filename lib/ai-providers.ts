export interface AIModel {
  id: string;
  name: string;
  isFree: boolean;
  description?: string;
  maxTokens?: number;
}

export interface AIProvider {
  id: string;
  name: string;
  baseUrl: string;
  requiresApiKey: boolean;
  models: AIModel[];
}

export const AI_PROVIDERS: Record<string, AIProvider> = {
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    requiresApiKey: true,
    models: [
      { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo', isFree: true },
      { id: 'meta-llama/llama-3-8b-instruct', name: 'Llama 3 8B', isFree: true },
      { id: 'mistralai/mistral-7b-instruct', name: 'Mistral 7B', isFree: true },
      { id: 'openai/gpt-4o', name: 'GPT-4o', isFree: false },
      { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', isFree: false },
    ],
  },
  openai: {
    id: 'openai',
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    requiresApiKey: true,
    models: [
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', isFree: false },
      { id: 'gpt-4o', name: 'GPT-4o', isFree: false },
    ],
  },
};

export function getProvider(providerId: string): AIProvider | undefined {
  return AI_PROVIDERS[providerId];
}
