'use client'

import { FloatingWindow } from '../components/FloatingWindow'
import { ChatInterface } from '../components/ChatInterface'
import { ScreenCapture } from '../components/ScreenCapture'
import { ModelSelector } from '../components/ModelSelector'
import { SettingsPanel } from '../components/SettingsPanel'
import { useState, useEffect, useRef } from 'react'
import { Settings as SettingsIcon, Shield, Mic, Cpu, Monitor, Zap, Minimize2, Command, ArrowRight } from 'lucide-react'
import { cn } from '../lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useAIChat } from '../hooks/useAIChat'
import { useVoiceRecognition } from '../hooks/useVoiceRecognition'
import { useScreenCapture } from '../hooks/useScreenCapture'
import { useSettings } from '../hooks/useSettings'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'chat' | 'screen' | 'voice' | 'settings' | 'models'>('chat')
  const [isExpanded, setIsExpanded] = useState(false)
  const [commandValue, setCommandValue] = useState('')

  const { messages, isLoading: isChatLoading, sendMessage, clearChat } = useAIChat()
  const { isListening, transcript, interimTranscript, startListening, stopListening, resetTranscript } = useVoiceRecognition()
  const { screenshots, isCapturing, captureScreen, deleteScreenshot, updateScreenshotOCR } = useScreenCapture()
  const { settings, updateSettings } = useSettings()

  const inputRef = useRef<HTMLInputElement>(null)

  // Electron IPC Listeners
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).require) {
      const { ipcRenderer } = (window as any).require('electron')

      const handleToggleVoice = () => {
        setIsExpanded(true)
        setActiveTab('voice')
      }
      const handleCaptureScreen = () => {
        setIsExpanded(true)
        setActiveTab('screen')
        captureScreen()
      }
      const handleClearChat = () => clearChat()
      const handleFocusCommand = () => {
        setIsExpanded(true)
        inputRef.current?.focus()
      }

      ipcRenderer.on('toggle-voice', handleToggleVoice)
      ipcRenderer.on('capture-screen', handleCaptureScreen)
      ipcRenderer.on('clear-chat', handleClearChat)
      ipcRenderer.on('focus-command', handleFocusCommand)

      return () => {
        ipcRenderer.removeListener('toggle-voice', handleToggleVoice)
        ipcRenderer.removeListener('capture-screen', handleCaptureScreen)
        ipcRenderer.removeListener('clear-chat', handleClearChat)
        ipcRenderer.removeListener('focus-command', handleFocusCommand)
      }
    }
  }, [captureScreen, clearChat])

  // Window Resize Logic
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).require) {
      const { ipcRenderer } = (window as any).require('electron')
      if (isExpanded) {
        ipcRenderer.send('resize-window', { width: 450, height: 600 })
      } else {
        ipcRenderer.send('resize-window', { width: 80, height: 80 })
      }
    }
  }, [isExpanded])

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commandValue.trim() || isChatLoading) return

    sendMessage(commandValue, {
      provider: settings.aiProvider,
      model: settings.aiModel,
    })
    setCommandValue('')
    setActiveTab('chat')
  }

  return (
    <main className="h-screen w-screen overflow-hidden bg-transparent font-sans selection:bg-cyber-blue/30 selection:text-cyber-cyan">
      {/* Launcher (FAB) */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-4 right-4 z-[9999] no-drag"
          >
            <button
              onClick={() => setIsExpanded(true)}
              className="w-14 h-14 rounded-2xl glass border-cyber-border-bright flex items-center justify-center shadow-neon hover:border-cyber-blue transition-all group overflow-hidden"
            >
              <div className="absolute inset-0 bg-cyber-blue/5 animate-pulse-slow" />
              <Zap className="relative z-10 w-6 h-6 text-cyber-blue group-hover:scale-110 transition-transform" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main UI Window */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            className="h-full w-full flex flex-col p-4"
          >
            <div className="flex-1 glass border-cyber-border-bright rounded-3xl flex flex-col overflow-hidden shadow-neon-bright relative">

              <div className="p-4 bg-cyber-black/40 border-b border-cyber-border drag-region">
                <form onSubmit={handleCommandSubmit} className="relative flex items-center no-drag">
                  <div className="absolute left-3 text-cyber-blue/40">
                    <Command size={16} />
                  </div>
                  <input
                    ref={inputRef}
                    value={commandValue}
                    onChange={(e) => setCommandValue(e.target.value)}
                    placeholder="Search or ask Nova..."
                    className="w-full bg-cyber-black/40 border border-cyber-border focus:border-cyber-blue/60 rounded-xl py-3 pl-10 pr-12 text-sm text-cyber-blue placeholder:text-cyber-blue/20 outline-none transition-all"
                  />
                  <div className="absolute right-3 flex items-center gap-2">
                    {commandValue.length > 0 && (
                      <button type="submit" className="text-cyber-blue hover:text-cyber-cyan transition-colors">
                        <ArrowRight size={18} />
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="flex items-center gap-1 px-4 py-2 bg-cyber-black/20 border-b border-cyber-border no-drag shrink-0">
                {[
                  { id: 'chat', icon: Cpu, label: 'Console' },
                  { id: 'screen', icon: Monitor, label: 'Signal' },
                  { id: 'voice', icon: Mic, label: 'Neural' },
                  { id: 'models', icon: Zap, label: 'Pulse' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 transition-all",
                      activeTab === tab.id
                        ? "bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20 shadow-neon"
                        : "text-cyber-blue/30 hover:text-cyber-blue/60 hover:bg-cyber-blue/5"
                    )}
                  >
                    <tab.icon size={12} />
                    {tab.label}
                  </button>
                ))}
                <div className="flex-1" />
                <button
                  onClick={() => setActiveTab('settings')}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    activeTab === 'settings' ? "text-cyber-blue bg-cyber-blue/10 border border-cyber-blue/20" : "text-cyber-blue/30 hover:text-cyber-blue/60"
                  )}
                >
                  <SettingsIcon size={14} />
                </button>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 text-cyber-blue/30 hover:text-cyber-blue transition-all"
                >
                  <Minimize2 size={14} />
                </button>
              </div>

              <div className="flex-1 overflow-hidden relative">
                <AnimatePresence mode="wait">
                  {activeTab === 'chat' && (
                    <motion.div key="chat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-full">
                      <ChatInterface messages={messages} isLoading={isChatLoading} onSendMessage={(content) => sendMessage(content)} />
                    </motion.div>
                  )}
                  {activeTab === 'screen' && (
                    <motion.div key="screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                      <ScreenCapture screenshots={screenshots} isCapturing={isCapturing} onCapture={captureScreen} onDelete={deleteScreenshot} onUpdateOCR={updateScreenshotOCR} onSendToChat={(ocrText) => { sendMessage(ocrText); setActiveTab('chat') }} />
                    </motion.div>
                  )}
                  {activeTab === 'voice' && (
                    <motion.div key="voice" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="h-full flex items-center justify-center p-6 text-center">
                      <div className="space-y-6 w-full max-w-sm">
                        <div onClick={isListening ? () => stopListening(null) : () => startListening()} className={cn("w-20 h-20 rounded-3xl border-2 flex items-center justify-center relative mx-auto cursor-pointer transition-all duration-500", isListening ? "bg-cyber-blue/20 border-cyber-blue shadow-neon" : "bg-cyber-black/40 border-cyber-border hover:border-cyber-blue/40")}>
                          <Mic className={cn("text-cyber-blue", isListening && "scale-110")} size={28} />
                          {isListening && <div className="absolute inset-0 border-2 border-cyber-blue rounded-3xl animate-ping opacity-20" />}
                        </div>
                        <p className="text-[10px] font-bold text-cyber-blue tracking-widest uppercase">Neural Uplink {isListening ? 'Active' : 'Ready'}</p>
                        <div className="glass border-cyber-border p-4 rounded-2xl min-h-[80px] text-left">
                          <p className="text-xs text-cyber-blue/80 font-mono italic">{transcript || interimTranscript || 'Waiting for signal...'}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  {activeTab === 'models' && (
                    <motion.div key="models" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full p-4 cyber-scroll overflow-y-auto">
                      <ModelSelector selectedProvider={settings.aiProvider} selectedModel={settings.aiModel} onProviderChange={(id) => updateSettings({ aiProvider: id })} onModelChange={(id) => updateSettings({ aiModel: id })} freeModeOnly={settings.freeMode} />
                    </motion.div>
                  )}
                  {activeTab === 'settings' && (
                    <motion.div key="settings" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full">
                      <SettingsPanel settings={settings} updateSettings={updateSettings} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="h-8 bg-cyber-dark/60 border-t border-cyber-border flex items-center justify-between px-4 shrink-0 no-drag">
                <div className="flex items-center gap-3">
                  <div className={cn("w-1.5 h-1.5 rounded-full shadow-neon", isChatLoading ? "bg-cyber-blue animate-pulse" : "bg-green-500")} />
                  <span className="text-[8px] font-bold tracking-[0.2em] text-cyber-blue/40 uppercase">Stable Uplink</span>
                </div>
                <span className="text-[8px] font-bold tracking-[0.2em] text-cyber-blue/40 uppercase">Nova Core v1.0</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-[-1] bg-[linear-gradient(rgba(0,242,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,242,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
    </main>
  )
}
