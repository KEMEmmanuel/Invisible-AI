'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { cn } from '../lib/utils'

interface FABProps {
  onClick: () => void
  isExpanded: boolean
}

export function FAB({ onClick, isExpanded }: FABProps) {
  return (
    <motion.div
      layout
      initial={false}
      animate={{
        width: isExpanded ? 0 : 56,
        height: isExpanded ? 0 : 56,
        opacity: isExpanded ? 0 : 1,
      }}
      className={cn(
        "fixed bottom-6 right-6 z-[9999] no-drag",
        isExpanded ? "pointer-events-none" : "pointer-events-auto"
      )}
    >
      <button
        onClick={onClick}
        className="w-14 h-14 rounded-full bg-cyber-blue text-cyber-black flex items-center justify-center shadow-neon hover:bg-cyber-cyan transition-all group overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
        <Zap className="relative z-10 w-6 h-6" />
        <div className="absolute inset-0 border-2 border-cyber-blue rounded-full animate-ping opacity-20" />
      </button>
    </motion.div>
  )
}
