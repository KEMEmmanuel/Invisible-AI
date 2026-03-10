'use client'

import { FloatingWindow } from '../components/FloatingWindow'
import { ChatInterface } from '../components/ChatInterface'
import { ScreenCapture } from '../components/ScreenCapture'
import { ModelSelector } from '../components/ModelSelector'
import { SettingsPanel } from '../components/SettingsPanel'
import { FAB } from '../components/FAB'
import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Shield, Mic, Cpu, Monitor, Zap, Minimize2 } from 'lucide-react'
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

      ipcRenderer.on('toggle-voice', handleToggleVoice)
      ipcRenderer.on('capture-screen', handleCaptureScreen)
      ipcRenderer.on('clear-chat', handleClearChat)

      return () => {
        ipcRenderer.removeListener('toggle-voice', handleToggleVoice)
        ipcRenderer.removeListener('capture-screen', handleCaptureScreen)
        ipcRenderer.removeListener('clear-chat', handleClearChat)
      }
    }
  }, [captureScreen, clearChat])

  // Window Resize Logic for FAB -> Window transition
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).require) {
      const { ipcRenderer } = (window as any).require('electron')
      if (isExpanded) {
        ipcRenderer.send('resize-window', { width: 450, height: 700 })
      } else {
        ipcRenderer.send('resize-window', { width: 80, height: 80 })
      }
    }
  }, [isExpanded])

  // Auto-send transcript when finished speaking
  useEffect(() => {
    if (!isListening && transcript && settings.autoSendTranscript) {
      sendMessage(transcript)
      resetTranscript()
    }
  }, [isListening, transcript, settings.autoSendTranscript, sendMessage, resetTranscript])

  return (
    <main className="h-screen w-screen overflow-hidden bg-transparent">
      {/* FAB Launcher */}
      <FAB onClick={() => setIsExpanded(true)} isExpanded={isExpanded} />

      {/* Main UI Window */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 100, y: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 100, y: 100 }}
            className="h-full w-full"
          >
            <FloatingWindow
              title={`Nova AI / Stealth / ${settings.freeMode ? 'Free Mode' : 'Premium'}`}
              showControls={false}
            >
              <div className="flex flex-col h-full">
                {/* Navigation Bar */}
                <div className="flex items-center gap-1 p-1 bg-cyber-dark/50 border-b border-cyber-border no-drag">
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={cn(
                      "px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded transition-all flex items-center gap-2",
                      activeTab === 'chat'
                        ? "bg-cyber-blue/20 text-cyber-blue shadow-neon border border-cyber-border-bright"
                        : "text-cyber-blue/40 hover:text-cyber-blue/60"
                    )}
                  >
                    <Cpu size={12} /> Console
                  </button>
                  <button
                    onClick={() => setActiveTab('screen')}
                    className={cn(
                      "px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded transition-all flex items-center gap-2",
                      activeTab === 'screen'
                        ? "bg-cyber-blue/20 text-cyber-blue shadow-neon border border-cyber-border-bright"
                        : "text-cyber-blue/40 hover:text-cyber-blue/60"
                    )}
                  >
                    <Monitor size={12} /> Screen
                  </button>
                  <button
                    onClick={() => setActiveTab('voice')}
                    className={cn(
                      "px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded transition-all flex items-center gap-2",
                      activeTab === 'voice'
                        ? "bg-cyber-blue/20 text-cyber-blue shadow-neon border border-cyber-border-bright"
                        : "text-cyber-blue/40 hover:text-cyber-blue/60"
                    )}
                  >
                    <Mic size={12} /> Voice
                  </button>
                  <button
                    onClick={() => setActiveTab('models')}
                    className={cn(
                      "px-3 py-1 text-[10px] font-bold tracking-widest uppercase rounded transition-all flex items-center gap-2",
                      activeTab === 'models'
                        ? "bg-cyber-blue/20 text-cyber-blue shadow-neon border border-cyber-border-bright"
                        : "text-cyber-blue/40 hover:text-cyber-blue/60"
                    )}
                  >
                    <Zap size={12} /> Models
                  </button>
                  <div className="flex-1" />
                  <button
                    onClick={() => setActiveTab('settings')}
                    aria-label="Settings"
                    className={cn(
                      "p-1.5 rounded transition-all mr-1",
                      activeTab === 'settings'
                        ? "text-cyber-blue bg-cyber-blue/10 border border-cyber-blue/30"
                        : "text-cyber-blue/40 hover:text-cyber-blue/60"
                    )}
                  >
                    <SettingsIcon size={14} />
                  </button>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="p-1.5 text-cyber-blue/40 hover:text-cyber-blue hover:bg-cyber-blue/10 rounded transition-all"
                    title="Minimize to FAB"
                  >
                    <Minimize2 size={14} />
                  </button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-hidden relative">
                  <AnimatePresence mode="wait">
                    {activeTab === 'chat' && (
                      <motion.div
                        key="chat"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="h-full"
                      >
                        <ChatInterface
                          messages={messages}
                          isLoading={isChatLoading}
                          onSendMessage={(content) => sendMessage(content, {
                            provider: settings.aiProvider,
                            model: settings.aiModel,
                          })}
                        />
                      </motion.div>
                    )}
                    {activeTab === 'screen' && (
                      <motion.div
                        key="screen"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="h-full"
                      >
                        <ScreenCapture
                          screenshots={screenshots}
                          isCapturing={isCapturing}
                          onCapture={captureScreen}
                          onDelete={deleteScreenshot}
                          onUpdateOCR={updateScreenshotOCR}
                          onSendToChat={(ocrText) => {
                            sendMessage("Analyze this screen data:", { ocrContext: ocrText })
                            setActiveTab('chat')
                          }}
                        />
                      </motion.div>
                    )}
                    {activeTab === 'voice' && (
                      <motion.div
                        key="voice"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="h-full flex items-center justify-center bg-cyber-black/90 p-6"
                      >
                        <div className="text-center space-y-8 w-full max-w-sm">
                          <div className="w-32 h-32 rounded-full border-2 border-cyber-blue/20 flex items-center justify-center relative mx-auto group cursor-pointer"
                               onClick={isListening ? () => stopListening(null) : () => startListening()}>
                            <div className={cn(
                              "w-24 h-24 rounded-full border border-cyber-blue/40 flex items-center justify-center shadow-neon transition-all duration-500",
                              isListening ? "bg-cyber-blue/20 scale-110 shadow-[0_0_30px_rgba(0,242,255,0.4)]" : "bg-cyber-blue/5 hover:bg-cyber-blue/10"
                            )}>
                              <Mic className={cn("text-cyber-blue transition-transform", isListening && "scale-125")} size={48} />
                            </div>
                            {isListening && (
                              <div className="absolute inset-0 border-2 border-cyber-blue/60 rounded-full animate-ping [animation-duration:2s]" />
                            )}
                          </div>

                          <div className="space-y-2">
                            <h2 className="text-cyber-blue font-bold tracking-[0.2em] uppercase mb-2">Voice Transceiver</h2>
                            <p className="text-[10px] text-cyber-blue/60 uppercase tracking-widest flex items-center justify-center gap-2">
                              <span className={cn("w-1.5 h-1.5 rounded-full", isListening ? "bg-green-500 animate-pulse shadow-neon" : "bg-red-500")}></span>
                              Status: {isListening ? 'Uplink Established' : 'Inactive'}
                            </p>
                          </div>

                          <div className="bg-cyber-black/60 border border-cyber-border p-4 rounded-lg min-h-[120px] w-full shadow-inner relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-cyber-blue/40 group-hover:h-full transition-all" />
                            <p className="text-xs text-cyber-blue leading-relaxed text-left">
                              {transcript || interimTranscript || <span className="opacity-20 italic font-mono uppercase tracking-tighter">Waiting for voice signal...</span>}
                            </p>
                            {interimTranscript && (
                              <span className="text-[10px] text-cyber-blue/40 italic">...</span>
                            )}
                          </div>

                          <div className="flex justify-center gap-4">
                            <button
                              onClick={resetTranscript}
                              className="text-[10px] font-bold tracking-widest uppercase text-cyber-blue/40 hover:text-cyber-blue transition-colors"
                            >
                              Purge Buffer
                            </button>
                            <button
                              disabled={!transcript || isChatLoading}
                              onClick={() => {
                                sendMessage(transcript)
                                resetTranscript()
                                setActiveTab('chat')
                              }}
                              className="text-[10px] font-bold tracking-widest uppercase text-cyber-blue hover:text-cyber-cyan transition-all disabled:opacity-20"
                            >
                              Transmit Data
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    {activeTab === 'models' && (
                      <motion.div
                        key="models"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="h-full p-4 cyber-scroll overflow-y-auto"
                      >
                        <ModelSelector
                          selectedProvider={settings.aiProvider}
                          selectedModel={settings.aiModel}
                          onProviderChange={(id) => updateSettings({ aiProvider: id })}
                          onModelChange={(id) => updateSettings({ aiModel: id })}
                          freeModeOnly={settings.freeMode}
                        />
                      </motion.div>
                    )}
                    {activeTab === 'settings' && (
                      <motion.div
                        key="settings"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="h-full overflow-hidden"
                      >
                        <SettingsPanel
                          settings={settings}
                          updateSettings={updateSettings}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer Status Bar */}
                <div className="h-6 bg-cyber-dark border-t border-cyber-border flex items-center justify-between px-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyber-blue shadow-neon animate-pulse" />
                    <span className="text-[8px] font-bold tracking-widest text-cyber-blue/60 uppercase">
                      Uplink: {isChatLoading ? 'Transmitting...' : 'Stable'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[8px] font-bold tracking-widest text-cyber-blue/60 uppercase">
                      Encrypted Layer: Active
                    </span>
                    <span className="text-[8px] font-bold tracking-widest text-cyber-blue/60 uppercase">
                      Nova Core v1.0
                    </span>
                  </div>
                </div>
              </div>
            </FloatingWindow>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
