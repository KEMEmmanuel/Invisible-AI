'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-cyber-black text-cyber-blue p-10 text-center font-mono">
      <h2 className="text-lg font-bold uppercase tracking-widest mb-4">Neural Link Interrupted</h2>
      <p className="text-xs opacity-60 mb-8">{error.message || 'Unknown system error'}</p>
      <button
        onClick={() => reset()}
        className="px-6 py-2 bg-cyber-blue text-cyber-black rounded-xl text-[10px] font-bold uppercase shadow-neon transition-all hover:bg-cyber-cyan"
      >
        Attempt Re-sync
      </button>
    </div>
  )
}
