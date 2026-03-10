'use client'

import React from 'react'
import { Check, ChevronDown, Cpu, Zap, Globe, Sparkles } from 'lucide-react'
import { AI_PROVIDERS, getProvider } from '@/lib/ai-providers'
import { cn } from '@/lib/utils'

interface ModelSelectorProps {
  selectedProvider: string
  selectedModel: string
  onProviderChange: (id: string) => void
  onModelChange: (id: string) => void
  freeModeOnly?: boolean
}

export function ModelSelector({
  selectedProvider,
  selectedModel,
  onProviderChange,
  onModelChange,
  freeModeOnly = true,
}: ModelSelectorProps) {
  const providers = Object.values(AI_PROVIDERS)
  const currentProvider = getProvider(selectedProvider)

  return (
    <div className="flex flex-col space-y-4 p-4 bg-cyber-dark/80 border border-cyber-border rounded-lg shadow-neon">
      {/* Provider Selector */}
      <div className="space-y-2">
        <label className="text-[10px] text-cyber-blue/60 uppercase tracking-widest font-bold flex items-center gap-2">
          <Globe size={12} /> Neural Transceiver
        </label>
        <div className="grid grid-cols-2 gap-2">
          {providers.map((provider) => {
            const isFree = provider.models.some(m => m.isFree)
            if (freeModeOnly && !isFree) return null

            return (
              <button
                key={provider.id}
                onClick={() => onProviderChange(provider.id)}
                className={cn(
                  "p-2 rounded border text-[10px] font-bold tracking-widest uppercase transition-all flex items-center justify-between",
                  selectedProvider === provider.id
                    ? "bg-cyber-blue/20 border-cyber-blue text-cyber-blue shadow-neon"
                    : "bg-cyber-black border-cyber-border/40 text-cyber-blue/40 hover:border-cyber-border hover:text-cyber-blue/60"
                )}
              >
                {provider.name}
                {selectedProvider === provider.id && <Check size={10} />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Model Selector */}
      <div className="space-y-2">
        <label className="text-[10px] text-cyber-blue/60 uppercase tracking-widest font-bold flex items-center gap-2">
          <Cpu size={12} /> Model Pulse
        </label>
        <div className="space-y-1 cyber-scroll max-h-48 overflow-y-auto pr-1">
          {currentProvider?.models.map((model) => {
            if (freeModeOnly && !model.isFree) return null

            return (
              <button
                key={model.id}
                onClick={() => onModelChange(model.id)}
                className={cn(
                  "w-full p-2 rounded border text-[10px] font-bold tracking-widest uppercase transition-all flex items-center justify-between",
                  selectedModel === model.id
                    ? "bg-cyber-blue/10 border-cyber-blue/60 text-cyber-blue shadow-neon"
                    : "bg-cyber-black/40 border-cyber-border/20 text-cyber-blue/30 hover:border-cyber-border hover:text-cyber-blue/50"
                )}
              >
                <div className="flex flex-col items-start gap-1">
                  <span>{model.name}</span>
                  {model.isFree && (
                    <span className="text-[7px] text-green-400 border border-green-400/30 px-1 rounded bg-green-400/10">
                      FREE / UPLINK STABLE
                    </span>
                  )}
                </div>
                {selectedModel === model.id ? (
                  <Sparkles size={12} className="text-cyber-blue animate-pulse" />
                ) : (
                  !model.isFree && <Zap size={10} className="text-cyber-blue/20" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Health Check Status */}
      <div className="flex items-center gap-2 pt-2 border-t border-cyber-border/40 text-[8px] text-cyber-blue/40 uppercase tracking-tighter">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
        Health: NORMAL / SAPI FALLBACK READY
      </div>
    </div>
  )
}
