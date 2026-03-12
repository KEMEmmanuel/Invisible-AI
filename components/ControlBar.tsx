'use client'

import React from 'react'
import { ChevronDown, Pause, Square, MoreVertical, X, GripVertical } from 'lucide-react'
import { cn } from '../lib/utils'

interface ControlBarProps {
  onClose: () => void
}

export function ControlBar({ onClose }: ControlBarProps) {
  return (
    <div className="flex items-center justify-center mb-3 no-drag select-none">
      <div className="flex items-center gap-2">
        {/* Main Control Pill */}
        <div className="h-9 px-3 flex items-center gap-3 bg-[#1e1e22]/95 backdrop-blur-xl border border-cyber-blue/20 rounded-full shadow-[0_0_20px_rgba(0,242,255,0.1)] transition-all duration-500">
          <div className="flex items-center gap-1 cursor-pointer hover:bg-white/5 px-2 py-1 rounded-full transition-all group">
            <div className="w-1.5 h-1.5 rounded-full bg-cyber-blue animate-pulse shadow-neon mr-1" />
            <span className="text-[10px] font-semibold text-white/90 whitespace-nowrap">Nova for Stealth</span>
            <ChevronDown size={12} className="text-white/40 group-hover:text-white transition-colors" />
          </div>

          <div className="w-[1px] h-3 bg-white/10" />

          <div className="flex items-center gap-1">
            <button className="p-1.5 hover:bg-white/10 rounded-full transition-all text-white/80">
              <Pause size={13} fill="currentColor" />
            </button>
            <button className="p-1.5 hover:bg-white/10 rounded-full transition-all text-white/80">
              <div className="w-2.5 h-2.5 bg-white rounded-sm" />
            </button>
          </div>

          <div className="w-[1px] h-3 bg-white/10" />

          <div className="flex items-center gap-1 text-white/30">
            <GripVertical size={14} />
          </div>
        </div>

        {/* Close Button Circle */}
        <button
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center bg-[#3a3a3e]/90 backdrop-blur-xl border border-white/5 rounded-full hover:bg-white/10 group transition-all shadow-2xl"
        >
          <X size={14} className="text-white/60 group-hover:text-white" />
        </button>
      </div>
    </div>
  )
}
