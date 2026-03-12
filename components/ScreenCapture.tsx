'use client'

import React, { useState } from 'react'
import { Camera, Trash2, FileText, Send, Loader2, Maximize2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Screenshot } from '@/hooks/useScreenCapture'
import { cn } from '@/lib/utils'
import { performOCR } from '@/lib/ocr'

interface ScreenCaptureProps {
  screenshots: Screenshot[]
  isCapturing: boolean
  onCapture: () => Promise<Screenshot | undefined>
  onDelete: (id: string) => void
  onUpdateOCR: (id: string, text: string) => void
  onSendToChat: (ocrText: string) => void
}

export function ScreenCapture({
  screenshots,
  isCapturing,
  onCapture,
  onDelete,
  onUpdateOCR,
  onSendToChat,
}: ScreenCaptureProps) {
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [progress, setProgress] = useState<number>(0)

  const handleProcessOCR = async (screenshot: Screenshot) => {
    setProcessingId(screenshot.id)
    setProgress(0)
    try {
      const text = await performOCR(screenshot.source, (p) => setProgress(p))
      onUpdateOCR(screenshot.id, text)
    } catch (error) {
      console.error('OCR Process error:', error)
    } finally {
      setProcessingId(null)
      setProgress(0)
    }
  }

  return (
    <div className="flex flex-col h-full bg-cyber-black/90 p-4 space-y-4 overflow-hidden">
      {/* Header with Capture Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-bold tracking-widest uppercase text-cyber-blue/60">
          Uplink Signal / Screen Capture
        </h3>
        <button
          onClick={() => onCapture()}
          disabled={isCapturing}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded text-[10px] font-bold tracking-widest uppercase transition-all shadow-neon",
            isCapturing
              ? "bg-cyber-blue/10 text-cyber-blue cursor-not-allowed"
              : "bg-cyber-blue text-cyber-black hover:bg-cyber-cyan"
          )}
        >
          {isCapturing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Camera className="w-3 h-3" />}
          Capture Screen
        </button>
      </div>

      {/* Screenshot Grid */}
      <div className="flex-1 overflow-y-auto cyber-scroll pr-2 space-y-4">
        {screenshots.length === 0 ? (
          <div className="h-48 border border-dashed border-cyber-border rounded flex flex-col items-center justify-center text-cyber-blue/30 space-y-2">
            <Camera className="w-8 h-8 opacity-20" />
            <p className="text-[10px] uppercase tracking-tighter">No signal captured</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {screenshots.map((screenshot) => (
              <motion.div
                key={screenshot.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group relative bg-cyber-dark/80 border border-cyber-border rounded overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="aspect-video relative overflow-hidden bg-black/50">
                  <img
                    src={screenshot.source}
                    alt="Capture"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />

                  {/* Overlay Controls */}
                  <div className="absolute inset-0 bg-cyber-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    {!screenshot.ocrText && processingId !== screenshot.id && (
                      <button
                        onClick={() => handleProcessOCR(screenshot)}
                        className="p-2 bg-cyber-blue text-cyber-black rounded hover:bg-cyber-cyan shadow-neon transition-all"
                        title="Extract Text"
                      >
                        <FileText size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => onDelete(screenshot.id)}
                      className="p-2 bg-red-500 text-white rounded hover:bg-red-600 shadow-lg transition-all"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Processing State */}
                  {processingId === screenshot.id && (
                    <div className="absolute inset-0 bg-cyber-black/80 flex flex-col items-center justify-center space-y-3 p-4">
                      <div className="w-full h-1 bg-cyber-blue/10 rounded overflow-hidden relative">
                        <motion.div
                          className="h-full bg-cyber-blue shadow-neon"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-cyber-blue font-bold tracking-widest uppercase animate-pulse">
                        Neural Extraction: {progress}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Info & OCR Text */}
                <div className="p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] text-cyber-blue/40 uppercase">
                      TS: {new Date(screenshot.timestamp).toLocaleTimeString()}
                    </span>
                    {screenshot.ocrText && (
                      <span className="text-[8px] text-green-400 uppercase font-bold flex items-center gap-1">
                        <span className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
                        Text Extracted
                      </span>
                    )}
                  </div>

                  {screenshot.ocrText && (
                    <div className="relative group/text">
                      <div className="max-h-24 overflow-y-auto cyber-scroll bg-cyber-black/40 border border-cyber-border rounded p-2 text-[10px] text-cyber-blue/60 leading-relaxed font-mono whitespace-pre-wrap">
                        {screenshot.ocrText}
                      </div>
                      <button
                        onClick={() => onSendToChat(screenshot.ocrText!)}
                        className="absolute bottom-2 right-2 p-1.5 bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/30 rounded hover:bg-cyber-blue hover:text-cyber-black transition-all shadow-neon"
                        title="Send to AI Console"
                      >
                        <Send size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-2 border-t border-cyber-border flex items-center justify-between text-[8px] text-cyber-blue/30 uppercase tracking-widest">
        <span>Max: 10/10 Signals</span>
        <span>Stealth: ENABLED</span>
      </div>
    </div>
  )
}
