'use client'

export default function NotFound() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-cyber-black text-cyber-blue p-10 text-center font-mono">
      <h2 className="text-lg font-bold uppercase tracking-widest mb-4">Signal Lost (404)</h2>
      <p className="text-xs opacity-60 mb-8">The requested neural node does not exist.</p>
      <a
        href="/"
        className="px-6 py-2 border border-cyber-blue text-cyber-blue rounded-xl text-[10px] font-bold uppercase hover:bg-cyber-blue hover:text-cyber-black transition-all"
      >
        Return to Core
      </a>
    </div>
  )
}
