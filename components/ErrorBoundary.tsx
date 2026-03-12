'use client'

import React from 'react'

export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Nova Error Boundary catch:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-screen items-center justify-center bg-cyber-black text-cyber-blue font-mono p-10 text-center">
          <div className="space-y-4">
            <h1 className="text-xl font-bold tracking-widest uppercase">Neural Uplink Critical Failure</h1>
            <p className="text-xs opacity-60">The system encountered an unrecoverable state.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-cyber-blue text-cyber-black rounded-lg text-[10px] font-bold uppercase shadow-neon"
            >
              Re-initialize Signal
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
