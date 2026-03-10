'use client'

import React, { useState, useEffect } from 'react'
import { X, Minus, Maximize2, Move } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface FloatingWindowProps {
  children: React.ReactNode
  title?: string
  className?: string
  showControls?: boolean
}

export function FloatingWindow({
  children,
  title = 'Nova AI',
  className,
  showControls = true,
}: FloatingWindowProps) {
  const [isMinimized, setIsMinimized] = useState(false)

  const handleMinimize = () => {
    if (window.require) {
      const { ipcRenderer } = window.require('electron')
      ipcRenderer.send('minimize-window')
    } else {
      setIsMinimized(!isMinimized)
    }
  }

  const handleClose = () => {
    if (window.require) {
      const { ipcRenderer } = window.require('electron')
      ipcRenderer.send('close-window')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'flex flex-col overflow-hidden h-screen w-screen border-cyber-border-bright border glass transition-all duration-300',
        className
      )}
    >
      {/* Header / Drag Region */}
      <div className="flex items-center justify-between px-3 h-10 bg-cyber-dark/80 border-b border-cyber-border drag-region select-none">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyber-blue animate-pulse shadow-neon" />
          <span className="text-xs font-bold tracking-widest text-cyber-blue uppercase neon-text">
            {title}
          </span>
        </div>

        {showControls && (
          <div className="flex items-center gap-1 no-drag">
            <button
              onClick={handleMinimize}
              className="p-1 hover:bg-cyber-blue/10 rounded transition-colors"
            >
              <Minus size={14} className="text-cyber-blue" />
            </button>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-red-500/20 rounded transition-colors group"
            >
              <X size={14} className="text-cyber-blue group-hover:text-red-400" />
            </button>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className={cn(
        "flex-1 relative overflow-hidden transition-all duration-300",
        isMinimized ? "h-0 opacity-0" : "h-full opacity-100"
      )}>
        <div className="absolute inset-0 bg-neon-glow pointer-events-none opacity-50" />
        {children}
      </div>

      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
        <div className="w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[100] bg-[length:100%_2px,3px_100%]" />
        <div className="w-full h-1 bg-cyber-blue/20 absolute animate-scanline" />
      </div>
    </motion.div>
  )
}
