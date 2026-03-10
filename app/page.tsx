'use client'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      <div className="max-w-2xl w-full">
        <div className="bg-background/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          <div className="h-10 bg-gradient-to-r from-purple-600/20 via-pink-500/20 to-purple-600/20 border-b border-white/10 flex items-center justify-between px-4">
            <h1 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Nova AI
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-green-400">✓ Free Mode Active</span>
            </div>
          </div>
          <div className="p-8 text-center space-y-6">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-3xl">🤖</span>
              </div>
              <h2 className="text-2xl font-bold">Welcome to Nova AI</h2>
              <p className="text-muted-foreground">
                Your comprehensive AI desktop assistant with voice transcription, screen awareness, OCR, and multiple AI model support.
              </p>
            </div>
            
            <div className="grid gap-4 text-left">
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <h3 className="font-semibold mb-2 text-purple-300">🎤 Voice Transcription (FREE)</h3>
                <p className="text-sm text-muted-foreground">
                  Uses Web Speech API - no API key required! Works on Chrome/Edge with Windows.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-pink-500/10 border border-pink-500/20">
                <h3 className="font-semibold mb-2 text-pink-300">🤖 Multiple AI Models</h3>
                <p className="text-sm text-muted-foreground">
                  Free tier with OpenRouter including GPT-3.5 Turbo, Llama 3 8B, and Mistral 7B.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <h3 className="font-semibold mb-2 text-orange-300">🔒 Privacy-Focused</h3>
                <p className="text-sm text-muted-foreground">
                  AES-GCM encryption for API keys, incognito mode, no data collection.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• Keyboard shortcuts: Alt+V (voice), Alt+S (screenshot), Alt+C (clear chat)</p>
                <p>• Floating draggable window with minimize/maximize</p>
                <p>• Screen capture with OCR text extraction</p>
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-sm">
                  <span className="font-semibold text-blue-300">Setup Instructions:</span>
                  <br />
                  1. Get a free OpenRouter API key at{' '}
                  <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    openrouter.ai/keys
                  </a>
                  <br />
                  2. Add your API key in Settings → AI Models
                  <br />
                  3. Start chatting with Nova AI!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
