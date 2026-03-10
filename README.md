# Nova AI

A comprehensive AI desktop assistant with voice transcription, screen awareness, OCR, and multiple AI model support.

## Features

- **Voice Transcription (FREE)** - Uses Web Speech API (Chrome/Edge on Windows)
- **Multiple AI Models** - Free tier with OpenRouter including GPT-3.5 Turbo, Llama 3 8B, Mistral 7B
- **Screen Capture & OCR** - Capture screenshots and extract text with Tesseract.js
- **Privacy-Focused** - AES-GCM encryption for API keys, incognito mode, no data collection
- **Keyboard Shortcuts** - Alt+V (voice), Alt+S (screenshot), Alt+C (clear chat)

## Getting Started

### Prerequisites
- Node.js 18+
- Chrome or Edge (for voice recognition)

### Installation

```bash
# Clone the repository
git clone https://github.com/KEMEmmanuel/Invisible-AI.git
cd Invisible-AI

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Free Tier Setup

1. Get a free OpenRouter API key: [https://openrouter.ai/keys](https://openrouter.ai/keys)
2. Add your API key in the application settings

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Framer Motion
- Radix UI + shadcn/ui
- Tesseract.js
- Web Speech API
- OpenRouter

## License

MIT
