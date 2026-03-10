'use client'

import { useState, useCallback } from 'react'

export interface Screenshot {
  id: string
  source: string
  ocrText?: string
  timestamp: number
  isLoading?: boolean
  progress?: number
}

export function useScreenCapture() {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([])
  const [isCapturing, setIsCapturing] = useState(false)

  const captureScreen = useCallback(async () => {
    setIsCapturing(true)
    try {
      if (typeof window !== 'undefined' && (window as any).require) {
        const { ipcRenderer } = (window as any).require('electron')

        // Use Electron desktopCapturer via IPC
        const sources = await ipcRenderer.invoke('get-desktop-sources')

        if (sources && sources.length > 0) {
          // Take the primary screen source
          const primarySource = sources[0]

          const newScreenshot: Screenshot = {
            id: Date.now().toString(),
            source: primarySource.thumbnail,
            timestamp: Date.now(),
            isLoading: false,
            progress: 0,
          }

          setScreenshots((prev) => [newScreenshot, ...prev].slice(0, 10))
          return newScreenshot
        }
      } else {
        // Browser fallback (Chrome/Edge/etc.)
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: { cursor: 'always' } as any,
          audio: false,
        })

        const video = document.createElement('video')
        video.srcObject = stream
        video.play()

        return new Promise<Screenshot>((resolve) => {
          video.onloadedmetadata = () => {
            const canvas = document.createElement('canvas')
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            const ctx = canvas.getContext('2d')
            ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)

            const dataUrl = canvas.toDataURL('image/png')

            const newScreenshot: Screenshot = {
              id: Date.now().toString(),
              source: dataUrl,
              timestamp: Date.now(),
              isLoading: false,
              progress: 0,
            }

            setScreenshots((prev) => [newScreenshot, ...prev].slice(0, 10))

            // Cleanup stream
            stream.getTracks().forEach((track) => track.stop())
            resolve(newScreenshot)
          }
        })
      }
    } catch (error) {
      console.error('Capture Error:', error)
    } finally {
      setIsCapturing(false)
    }
  }, [])

  const deleteScreenshot = useCallback((id: string) => {
    setScreenshots((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const updateScreenshotOCR = useCallback((id: string, text: string) => {
    setScreenshots((prev) => prev.map((s) =>
      s.id === id ? { ...s, ocrText: text, isLoading: false, progress: 100 } : s
    ))
  }, [])

  const clearScreenshots = useCallback(() => {
    setScreenshots([])
  }, [])

  return {
    screenshots,
    isCapturing,
    captureScreen,
    deleteScreenshot,
    updateScreenshotOCR,
    clearScreenshots,
    setScreenshots
  }
}
