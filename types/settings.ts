export interface Settings {
  freeMode: boolean
  theme: 'light' | 'dark'
  voiceProvider: 'web-speech' | 'groq'
  aiProvider: string
  aiModel: string
  openrouterApiKey: string
  openaiApiKey: string
  anthropicApiKey: string
  groqApiKey: string
  incognitoMode: boolean
  autoSendTranscript: boolean
  speechLanguage: string
  alwaysOnTop: boolean
}

export const DEFAULT_SETTINGS: Settings = {
  freeMode: true,
  theme: 'dark',
  voiceProvider: 'web-speech',
  aiProvider: 'openrouter',
  aiModel: 'openai/gpt-3.5-turbo',
  openrouterApiKey: '',
  openaiApiKey: '',
  anthropicApiKey: '',
  groqApiKey: '',
  incognitoMode: false,
  autoSendTranscript: false,
  speechLanguage: 'en-US',
  alwaysOnTop: true,
}
