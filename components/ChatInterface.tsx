'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Send, Monitor, Zap, ChevronDown, Sparkles, Wand2, MessageSquare, History, MousePointer2, ArrowDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Message } from '../hooks/useAIChat'

interface ChatInterfaceProps {
  messages: Message[]
  isLoading: boolean
  onSendMessage: (content: string) => void
  onCaptureScreen?: () => void
}

export function ChatInterface({ messages, isLoading, onSendMessage, onCaptureScreen }: ChatInterfaceProps) {
  const [input, setInput] = useState('')
  const [activeTab, setActiveTab] = useState<'chat' | 'transcript'>('chat')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!input.trim() || isLoading) return
    onSendMessage(input)
    setInput('')
  }

  const actionPills = [
    { label: 'Assist', icon: Sparkles },
    { label: 'What should I say next?', icon: Wand2 },
    { label: 'Follow-up questions', icon: MessageSquare },
    { label: 'Recap', icon: History },
  ]

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Header Tabs */}
      <div className="flex items-center gap-6 px-8 pt-5 shrink-0 select-none">
        <button
          onClick={() => setActiveTab('chat')}
          className={cn(
            "text-[13px] font-semibold transition-all pb-1.5 border-b-2",
            activeTab === 'chat' ? "text-white border-white" : "text-white/30 border-transparent hover:text-white/50"
          )}
        >
          Chat
        </button>
        <button
          onClick={() => setActiveTab('transcript')}
          className={cn(
            "text-[13px] font-semibold transition-all pb-1.5 border-b-2",
            activeTab === 'transcript' ? "text-white border-white" : "text-white/30 border-transparent hover:text-white/50"
          )}
        >
          Transcript
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-8 py-4 space-y-6">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex flex-col max-w-[85%] rounded-2xl p-4",
              message.role === 'user'
                ? "bg-[#0047ab] text-white self-end rounded-tr-none shadow-md"
                : "bg-[#2d2d30] border border-white/5 text-white/90 self-start rounded-tl-none shadow-sm"
            )}
          >
            <div className="text-[13.5px] leading-relaxed font-medium">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => <p className="mb-0">{children}</p>,
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={atomDark}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-xl !bg-black/30 !border !border-white/5 !p-3 mt-2"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="bg-black/20 px-1 rounded text-blue-300" {...props}>
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <div className="flex flex-col gap-2 ml-1">
            <div className="flex items-center gap-2 text-white/50 text-[12px] font-medium">
              <MousePointer2 size={12} className="animate-pulse" />
              Thinking about your question...
            </div>
            <div className="h-4 w-48 bg-white/5 rounded animate-pulse" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Action Pills */}
      <div className="px-8 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 select-none">
        {actionPills.map((pill) => (
          <button
            key={pill.label}
            onClick={() => onSendMessage(pill.label)}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border border-white/[0.05] rounded-lg text-[11px] text-white/60 hover:text-white hover:bg-white/[0.08] transition-all shrink-0 font-medium"
          >
            <pill.icon size={12} className="text-white/40" />
            {pill.label}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="px-8 pb-6 pt-2 shrink-0">
        <div className="relative bg-[#252529] border border-white/[0.05] rounded-2xl p-2.5 shadow-xl group focus-within:border-white/10 transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Ask, or type / to start typing"
            rows={1}
            className="w-full bg-transparent border-none focus:ring-0 py-2 px-3 text-[13.5px] text-white placeholder:text-white/20 resize-none outline-none"
          />

          <div className="flex items-center justify-between mt-1 px-1">
            <div className="flex items-center gap-2">
              <button
                onClick={onCaptureScreen}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/30 rounded-lg text-[11px] font-bold hover:bg-cyber-blue/20 shadow-neon transition-all"
              >
                <Monitor size={12} /> Use Screen
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3a3523] text-yellow-400 border border-yellow-400/20 rounded-lg text-[11px] font-bold hover:bg-[#4d462e] transition-all">
                <Zap size={12} fill="currentColor" /> Smart
              </button>
            </div>

            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md",
                (input.trim() && !isLoading)
                  ? "bg-[#0047ab] text-white hover:bg-blue-600"
                  : "bg-white/[0.05] text-white/20"
              )}
            >
              <Send size={14} />
            </button>
          </div>

          <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white/10 rounded-full p-1 shadow-lg backdrop-blur-md">
              <ArrowDown size={10} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
