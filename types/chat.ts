export interface ScreenshotData {
  id: string
  dataUrl: string
  timestamp: number
  ocrText?: string
  oConfidence?: number
}

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  images?: ScreenshotData[]
  isStreaming?: boolean
}

export interface ChatState {
  messages: Message[]
  isLoading: boolean
  error: string | null
}
