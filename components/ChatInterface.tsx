'use client'

import React, { useRef, useEffect } from 'react'
import { Send, Image as ImageIcon, Mic, Paperclip } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Message } from '@/hooks/useAIChat'

interface ChatInterfaceProps {
  messages: Message[]
  isLoading: boolean
  onSendMessage: (content: string) => void
}

export function ChatInterface({ messages, isLoading, onSendMessage }: ChatInterfaceProps) {
  const [input, setInput] = React.useState('')
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

  return (
    <div className="flex flex-col h-full bg-cyber-black/90">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto cyber-scroll p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, x: message.role === 'user' ? 10 : -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
              "flex flex-col max-w-[85%] rounded-lg p-3 relative",
              message.role === 'user'
                ? "bg-cyber-blue/10 border border-cyber-blue/30 self-end ml-auto rounded-tr-none"
                : "bg-cyber-dark/80 border border-cyber-border self-start rounded-tl-none"
            )}
          >
            <div className={cn(
              "text-[10px] uppercase tracking-tighter mb-1 font-bold",
              message.role === 'user' ? "text-cyber-blue/60 text-right" : "text-cyber-cyan/60"
            )}>
              {message.role === 'user' ? 'System User' : 'Nova AI'}
            </div>

            <div className="text-xs prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-cyber-black/80 prose-pre:border prose-pre:border-cyber-border">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={atomDark}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>

            {message.role === 'assistant' && (
              <div className="absolute inset-0 bg-cyber-blue/5 blur-sm -z-10 rounded-lg" />
            )}
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-cyber-blue/60 text-[10px] italic p-2 tracking-widest uppercase animate-pulse">
            <div className="w-1.5 h-1.5 bg-cyber-blue rounded-full" />
            <span>Neural Uplink active...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-cyber-dark/50 border-t border-cyber-border space-y-3 shrink-0">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="Ask Nova anything..."
              rows={1}
              className="w-full bg-cyber-black/60 border border-cyber-border focus:border-cyber-blue/60 focus:ring-0 rounded-lg py-2 px-3 text-xs text-cyber-blue placeholder:text-cyber-blue/30 resize-none cyber-scroll outline-none transition-all"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={cn(
              "p-2 rounded-lg bg-cyber-blue transition-all shadow-neon h-9 w-9 flex items-center justify-center shrink-0",
              (input.trim() && !isLoading)
                ? "hover:bg-cyber-cyan opacity-100"
                : "opacity-50 cursor-not-allowed"
            )}
          >
            <Send size={16} className="text-cyber-black" />
          </button>
        </div>
      </div>
    </div>
  )
}
