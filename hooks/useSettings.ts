'use client'

import { useState, useEffect } from 'react'
import { encryptApiKey, decryptApiKey } from '@/lib/encryption'

export interface Settings {
  freeMode: boolean
  theme: 'cyber-cyan' | 'cyber-blue'
  voiceProvider: 'web-speech' | 'sapi'
  aiProvider: string
  aiModel: string
  openrouterApiKey: string
  openaiApiKey: string
  incognitoMode: boolean
  autoSendTranscript: boolean
}

const DEFAULT_SETTINGS: Settings = {
  freeMode: true,
  theme: 'cyber-cyan',
  voiceProvider: 'web-speech',
  aiProvider: 'openrouter',
  aiModel: 'openai/gpt-3.5-turbo',
  openrouterApiKey: '',
  openaiApiKey: '',
  incognitoMode: false,
  autoSendTranscript: false,
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const loadSettings = async () => {
      const stored = localStorage.getItem('nova-ai-settings')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          // Decrypt API keys if they exist
          if (parsed.openrouterApiKey) {
            parsed.openrouterApiKey = await decryptApiKey(parsed.openrouterApiKey)
          }
          if (parsed.openaiApiKey) {
            parsed.openaiApiKey = await decryptApiKey(parsed.openaiApiKey)
          }
          setSettings({ ...DEFAULT_SETTINGS, ...parsed })
        } catch (e) {
          console.error('Failed to load settings:', e)
        }
      }
      setIsLoaded(true)
    }
    loadSettings()
  }, [])

  const updateSettings = async (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)

    // Prepare for storage (encrypt sensitive data)
    const toStore = { ...updated }
    if (toStore.openrouterApiKey) {
      toStore.openrouterApiKey = await encryptApiKey(toStore.openrouterApiKey)
    }
    if (toStore.openaiApiKey) {
      toStore.openaiApiKey = await encryptApiKey(toStore.openaiApiKey)
    }

    localStorage.setItem('nova-ai-settings', JSON.stringify(toStore))
  }

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS)
    localStorage.removeItem('nova-ai-settings')
  }

  return {
    settings,
    isLoaded,
    updateSettings,
    resetSettings,
  }
}
