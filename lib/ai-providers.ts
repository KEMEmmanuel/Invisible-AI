import { AIProvider, AIModel } from '@/types/ai'

export const AI_PROVIDERS: Record<string, AIProvider> = {
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    requiresApiKey: true,
    models: [
      {
        id: 'openai/gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        description: 'Fast, efficient, free tier available',
        isFree: true,
        maxTokens: 4096,
      },
      {
        id: 'meta-llama/llama-3-8b-instruct',
        name: 'Llama 3 8B',
        description: 'Open source, free on OpenRouter',
        isFree: true,
        maxTokens: 8192,
      },
      {
        id: 'mistral/mistral-7b-instruct',
        name: 'Mistral 7B',
        description: 'High quality, free on OpenRouter',
        isFree: true,
        maxTokens: 8192,
      },
      {
        id: 'openai/gpt-4-turbo',
        name: 'GPT-4 Turbo',
        description: 'Most capable, requires paid key',
        isFree: false,
        maxTokens: 128000,
      },
      {
        id: 'anthropic/claude-3-opus',
        name: 'Claude 3 Opus',
        description: 'Exceptional reasoning, requires paid key',
        isFree: false,
        maxTokens: 200000,
      },
    ],
  },
  openai: {
    id: 'openai',
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    requiresApiKey: true,
    models: [
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        description: 'Fast, efficient, affordable',
        isFree: false,
        maxTokens: 4096,
      },
      {
        id: 'gpt-4-turbo-preview',
        name: 'GPT-4 Turbo',
        description: 'Most capable model',
        isFree: false,
        maxTokens: 128000,
      },
      {
        id: 'gpt-4',
        name: 'GPT-4',
        description: 'Advanced reasoning',
        isFree: false,
        maxTokens: 8192,
      },
    ],
  },
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    requiresApiKey: true,
    models: [
      {
        id: 'claude-3-opus-20240229',
        name: 'Claude 3 Opus',
        description: 'Most capable Claude model',
        isFree: false,
        maxTokens: 200000,
      },
      {
        id: 'claude-3-sonnet-20240229',
        name: 'Claude 3 Sonnet',
        description: 'Balanced performance',
        isFree: false,
        maxTokens: 200000,
      },
      {
        id: 'claude-3-haiku-20240307',
        name: 'Claude 3 Haiku',
        description: 'Fast and lightweight',
        isFree: false,
        maxTokens: 200000,
      },
    ],
  },
  groq: {
    id: 'groq',
    name: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    requiresApiKey: true,
    models: [
      {
        id: 'llama3-70b-8192',
        name: 'Llama 3 70B',
        description: 'Fast inference on Groq',
        isFree: false,
        maxTokens: 8192,
      },
      {
        id: 'llama3-8b-8192',
        name: 'Llama 3 8B',
        description: 'Very fast on Groq',
        isFree: false,
        maxTokens: 8192,
      },
      {
        id: 'mixtral-8x7b-32768',
        name: 'Mixtral 8x7B',
        description: 'Mixture of experts',
        isFree: false,
        maxTokens: 32768,
      },
    ],
  },
}

export function getProvider(providerId: string): AIProvider | undefined {
  return AI_PROVIDERS[providerId]
}

export function getModel(providerId: string, modelId: string): AIModel | undefined {
  const provider = getProvider(providerId)
  return provider?.models.find((m) => m.id === modelId)
}

export function getFreeModels(): AIModel[] {
  const freeModels: AIModel[] = []
  Object.values(AI_PROVIDERS).forEach((provider) => {
    provider.models
      .filter((model) => model.isFree)
      .forEach((model) => freeModels.push(model))
  })
  return freeModels
}

export function getFreeProviders(): string[] {
  return Object.values(AI_PROVIDERS)
    .filter((provider) => provider.models.some((m) => m.isFree))
    .map((p) => p.id)
}
