'use client'

import React from 'react'
import { Shield, Lock, EyeOff, Trash2, Key, Settings as SettingsIcon, Globe } from 'lucide-react'
import { Settings, useSettings } from '@/hooks/useSettings'
import { cn } from '@/lib/utils'

interface SettingsPanelProps {
  settings: Settings
  updateSettings: (newSettings: Partial<Settings>) => void
}

export function SettingsPanel({ settings, updateSettings }: SettingsPanelProps) {
  return (
    <div className="flex flex-col h-full bg-cyber-dark/95 cyber-scroll overflow-y-auto p-4 space-y-8">
      {/* Header */}
      <h2 className="text-cyber-blue font-bold tracking-widest uppercase mb-4 border-b border-cyber-border pb-2 flex items-center gap-2">
        <SettingsIcon size={16} /> Configuration / Stealth
      </h2>

      {/* General Settings */}
      <div className="space-y-4">
        <h3 className="text-[10px] text-cyber-blue/60 uppercase tracking-widest font-bold border-l-2 border-cyber-blue pl-2">
          System Protocols
        </h3>

        <div className="flex items-center justify-between p-3 bg-cyber-black border border-cyber-border rounded group hover:border-cyber-blue transition-all">
          <div className="space-y-1">
            <span className="text-xs text-cyber-blue font-bold uppercase tracking-tighter">Invisibility Cloak</span>
            <p className="text-[8px] text-cyber-blue/40 uppercase leading-tight">Window protected from screen capture / screenshots</p>
          </div>
          <div
            onClick={() => updateSettings({ incognitoMode: !settings.incognitoMode })}
            className={cn(
              "w-10 h-5 rounded-full relative p-1 cursor-pointer transition-colors",
              settings.incognitoMode ? "bg-cyber-blue" : "bg-cyber-blue/20"
            )}
          >
            <div className={cn(
              "w-3 h-3 bg-cyber-black rounded-full absolute transition-all",
              settings.incognitoMode ? "right-1" : "left-1"
            )} />
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-cyber-black border border-cyber-border rounded group hover:border-cyber-blue transition-all">
          <div className="space-y-1">
            <span className="text-xs text-cyber-blue font-bold uppercase tracking-tighter">Free Mode Active</span>
            <p className="text-[8px] text-cyber-blue/40 uppercase leading-tight">Only show free cloud models and local fallback</p>
          </div>
          <div
            onClick={() => updateSettings({ freeMode: !settings.freeMode })}
            className={cn(
              "w-10 h-5 rounded-full relative p-1 cursor-pointer transition-colors",
              settings.freeMode ? "bg-cyber-blue" : "bg-cyber-blue/20"
            )}
          >
            <div className={cn(
              "w-3 h-3 bg-cyber-black rounded-full absolute transition-all",
              settings.freeMode ? "right-1" : "left-1"
            )} />
          </div>
        </div>
      </div>

      {/* AI & Keys */}
      <div className="space-y-4">
        <h3 className="text-[10px] text-cyber-blue/60 uppercase tracking-widest font-bold border-l-2 border-cyber-blue pl-2">
          Neural Keys (AES-GCM Encrypted)
        </h3>

        <div className="space-y-2">
          <label className="text-[9px] text-cyber-blue/60 uppercase font-bold flex items-center gap-1">
            <Key size={10} /> OpenRouter Key
          </label>
          <div className="relative group">
            <input
              type="password"
              value={settings.openrouterApiKey}
              onChange={(e) => updateSettings({ openrouterApiKey: e.target.value })}
              placeholder="sk-or-v1-..."
              className="w-full bg-cyber-black border border-cyber-border p-2 text-xs text-cyber-blue outline-none focus:border-cyber-blue transition-colors rounded placeholder:text-cyber-blue/20"
            />
            <Lock className="absolute right-3 top-2.5 w-3 h-3 text-cyber-blue/20 group-hover:text-cyber-blue/60 transition-colors" />
          </div>
          <p className="text-[8px] text-cyber-blue/30 italic uppercase leading-tight">
            Stored locally using browser-level encryption. Never sent to our servers.
          </p>
        </div>
      </div>

      {/* Privacy Control */}
      <div className="space-y-4 pt-4">
        <h3 className="text-[10px] text-cyber-blue/60 uppercase tracking-widest font-bold border-l-2 border-cyber-blue pl-2">
          Data Clearance
        </h3>

        <button
          onClick={() => {
            if (confirm('Initiate complete data wipe?')) {
              localStorage.clear()
              window.location.reload()
            }
          }}
          className="w-full flex items-center justify-center gap-2 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded hover:bg-red-500 hover:text-white transition-all text-[10px] font-bold tracking-widest uppercase shadow-lg"
        >
          <Trash2 size={14} /> Wipe All Neural History
        </button>
      </div>

      {/* Footer Info */}
      <div className="text-center pt-8 opacity-30">
        <div className="flex justify-center gap-4 mb-2">
          <Shield size={16} className="text-cyber-blue" />
          <Lock size={16} className="text-cyber-blue" />
          <EyeOff size={16} className="text-cyber-blue" />
        </div>
        <p className="text-[8px] text-cyber-blue uppercase tracking-[0.2em]">
          Nova AI Stealth v1.0.0 / Secured with SAPI-Core
        </p>
      </div>
    </div>
  )
}
