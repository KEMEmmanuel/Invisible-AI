import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nova AI - Intelligent Desktop Assistant',
  description: 'Comprehensive AI desktop assistant with voice transcription, screen awareness, OCR, and multiple AI model support',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
