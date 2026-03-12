'use client'

import { useState, useCallback } from 'react'

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: number
  images?: string[]
}

export function useAIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello, I am Nova. How can I assist you today? I have access to your screen and voice signals.',
      timestamp: Date.now(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(async (content: string, options: {
    provider?: string,
    model?: string,
    ocrContext?: string
  } = {}) => {
    const { provider = 'openrouter', model = 'openai/gpt-3.5-turbo', ocrContext = '' } = options

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          provider,
          model,
          ocrContext,
        }),
      })

      if (!response.ok) {
        throw new Error('Neural Uplink Failure: ' + response.statusText)
      }

      // Handle streaming
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      while (true) {
        const { done, value } = await reader!.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue

            try {
              const { content: delta } = JSON.parse(data)
              assistantMessage.content += delta
              setMessages((prev) =>
                prev.map((m) => m.id === assistantMessage.id ? { ...assistantMessage } : m)
              )
            } catch (e) {
              console.error('Parse chunk error:', e)
            }
          }
        }
      }
    } catch (err: any) {
      console.error('AI Error:', err)
      setError(err.message)

      // SAPI Fallback (Offline/Free)
      const fallbackContent = "Neural Uplink unstable. Switching to local transceiver (SAPI). I can help with basic tasks offline."

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fallbackContent,
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // If in Electron, trigger SAPI voice
      if (typeof window !== 'undefined' && (window as any).require) {
        const { ipcRenderer } = (window as any).require('electron')
        ipcRenderer.send('speak-sapi', fallbackContent)
      }
    } finally {
      setIsLoading(false)
    }
  }, [messages])

  const clearChat = useCallback(() => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: 'System cleared. Ready for new signal.',
      timestamp: Date.now(),
    }])
  }, [])

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
  }
}
