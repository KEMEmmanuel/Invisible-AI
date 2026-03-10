import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('image') as File

    if (!file) {
      return new Response('No image provided', { status: 400 })
    }

    return new Response(
      JSON.stringify({
        message: 'OCR functionality available',
        note: 'For full OCR support, add Tesseract.js to client-side processing',
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('OCR route error:', error)
    return new Response('OCR processing failed', { status: 500 })
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
