'use client'

import { FloatingWindow } from '../components/FloatingWindow'
import { ChatInterface } from '../components/ChatInterface'
import { ScreenCapture } from '../components/ScreenCapture'
import { ModelSelector } from '../components/ModelSelector'
import { SettingsPanel } from '../components/SettingsPanel'
import { ControlBar } from '../components/ControlBar'
import { useState, useEffect, useRef } from 'react'
import { Settings as SettingsIcon, Mic, Cpu, Monitor, Zap, Minimize2 } from 'lucide-react'
import { cn } from '../lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { useAIChat } from '../hooks/useAIChat'
import { useVoiceRecognition } from '../hooks/useVoiceRecognition'
import { useScreenCapture } from '../hooks/useScreenCapture'
import { useSettings } from '../hooks/useSettings'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'chat' | 'screen' | 'voice' | 'settings' | 'models'>('chat')
  const [isExpanded, setIsExpanded] = useState(false)

  const { messages, isLoading: isChatLoading, sendMessage, clearChat } = useAIChat()
  const { isListening, transcript, interimTranscript, startListening, stopListening, resetTranscript } = useVoiceRecognition()
  const { screenshots, isCapturing, captureScreen, deleteScreenshot, updateScreenshotOCR } = useScreenCapture()
  const { settings, updateSettings } = useSettings()

  // Electron IPC Listeners
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).require) {
      const { ipcRenderer } = (window as any).require('electron')

      const handleToggleVoice = () => { setIsExpanded(true); setActiveTab('voice') }
      const handleCaptureScreen = () => { setIsExpanded(true); setActiveTab('screen'); captureScreen() }
      const handleClearChat = () => clearChat()
      const handleFocusCommand = () => setIsExpanded(true)

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
        ipcRenderer.send('resize-window', { width: 480, height: 650 })
      } else {
        ipcRenderer.send('resize-window', { width: 80, height: 80 })
      }
    }
  }, [isExpanded])

  return (
    <main className="h-screen w-screen overflow-hidden bg-transparent font-sans selection:bg-blue-600/30">
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
              className="w-14 h-14 rounded-2xl bg-[#252529]/90 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-2xl hover:border-white/20 transition-all group overflow-hidden"
            >
              <div className="absolute inset-0 bg-blue-500/5 animate-pulse-slow" />
              <Zap className="relative z-10 w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="currentColor" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main UI Window */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="h-full w-full flex flex-col p-3"
          >
            {/* Top Control Bar */}
            <ControlBar onClose={() => setIsExpanded(false)} />

            {/* Chat/Content Window */}
            <div className="flex-1 bg-[#1e1e22]/95 backdrop-blur-3xl border border-white/[0.08] rounded-[2.5rem] flex flex-col overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] relative">

              <div className="flex-1 overflow-hidden relative">
                <AnimatePresence mode="wait">
                  {activeTab === 'chat' && (
                    <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full font-medium">
                      <ChatInterface
                        messages={messages}
                        isLoading={isChatLoading}
                        onSendMessage={(content) => sendMessage(content)}
                        onCaptureScreen={captureScreen}
                      />
                    </motion.div>
                  )}
                  {activeTab === 'screen' && (
                    <motion.div key="screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                      <ScreenCapture screenshots={screenshots} isCapturing={isCapturing} onCapture={captureScreen} onDelete={deleteScreenshot} onUpdateOCR={updateScreenshotOCR} onSendToChat={(ocrText) => { sendMessage(ocrText); setActiveTab('chat') }} />
                    </motion.div>
                  )}
                  {activeTab === 'voice' && (
                    <motion.div key="voice" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex items-center justify-center p-6 text-center">
                      <div className="space-y-6 w-full max-w-sm">
                        <div onClick={isListening ? () => stopListening(null) : () => startListening()} className={cn("w-20 h-20 rounded-3xl border-2 flex items-center justify-center relative mx-auto cursor-pointer transition-all duration-500", isListening ? "bg-blue-600/20 border-blue-500 shadow-lg" : "bg-white/[0.03] border-white/10 hover:border-white/20")}>
                          <Mic className={cn("text-white", isListening && "scale-110")} size={28} />
                          {isListening && <div className="absolute inset-0 border-2 border-blue-500 rounded-3xl animate-ping opacity-20" />}
                        </div>
                        <p className="text-[11px] font-bold text-white/90 uppercase tracking-widest">{isListening ? 'Neural Uplink Active' : 'Transceiver Ready'}</p>
                        <div className="bg-white/[0.03] border border-white/[0.08] p-5 rounded-[2rem] min-h-[100px] text-left shadow-inner">
                          <p className="text-[13px] text-white/80 leading-relaxed italic">{transcript || interimTranscript || 'Waiting for signal...'}</p>
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
                    <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                      <SettingsPanel settings={settings} updateSettings={updateSettings} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Navigation Pills */}
              <div className="flex items-center justify-center gap-1.5 px-4 py-5 bg-transparent shrink-0 border-t border-white/[0.05]">
                {[
                  { id: 'chat', label: 'Chat' },
                  { id: 'screen', label: 'Screen' },
                  { id: 'voice', label: 'Voice' },
                  { id: 'models', label: 'Models' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "px-4 py-2 rounded-full text-[11px] font-bold tracking-tight uppercase transition-all",
                      activeTab === tab.id
                        ? "bg-white/10 text-white border border-white/10 shadow-lg"
                        : "text-white/30 hover:text-white/60 hover:bg-white/5"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
                <div className="w-[1px] h-4 bg-white/10 mx-2" />
                <button
                  onClick={() => setActiveTab('settings')}
                  className={cn(
                    "p-2 rounded-full transition-all",
                    activeTab === 'settings' ? "text-white bg-white/10" : "text-white/30 hover:text-white/60"
                  )}
                >
                  <SettingsIcon size={15} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
