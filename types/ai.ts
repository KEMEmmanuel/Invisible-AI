export interface AIProvider {
  id: string
  name: string
  baseUrl: string
  requiresApiKey: boolean
  models: AIModel[]
}

export interface AIModel {
  id: string
  name: string
  description?: string
  isFree: boolean
  maxTokens?: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  images?: any[]
}

export interface ChatRequest {
  messages: ChatMessage[]
  provider: string
  model: string
  apiKey?: string
  ocrContext?: string
}

export interface StreamingChunk {
  content: string
  done: boolean
}
