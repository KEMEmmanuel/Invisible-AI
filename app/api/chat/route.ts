import { NextRequest } from 'next/server'

const SYSTEM_PROMPTS: Record<string, string> = {
  default: `You are Nova, a helpful AI assistant with access to screen capture and OCR data. You can see what's on the user's screen when they provide screenshots.

Key capabilities:
- Answer questions about content visible on screen
- Help analyze UI elements, text, and images
- Provide explanations of code or documentation
- Assist with tasks based on what the user shows you

When screenshots are provided:
- Reference the extracted text when answering questions
- Be specific about what you can see
- If text is unclear, ask the user to capture again

Style guidelines:
- Be concise but thorough
- Use code blocks for technical content
- Provide actionable advice
- If you don't understand something from the screenshot, ask for clarification`,

  coding: `You are Nova, a coding assistant with access to screen content. You specialize in helping with programming tasks, debugging, and code explanations.

When analyzing code from screenshots:
- Identify the programming language
- Look for syntax errors or issues
- Suggest improvements or best practices
- Provide corrected code examples

Style guidelines:
- Use clear, well-commented code examples
- Explain the reasoning behind your suggestions
- Consider edge cases and potential bugs
- Reference specific lines or sections when relevant`,

  writing: `You are Nova, a writing assistant with access to document content. You help with editing, proofreading, and improving text.

When analyzing text from screenshots:
- Check for grammar and spelling errors
- Suggest improvements to clarity and flow
- Offer rephrasing options
- Provide tone and style feedback

Style guidelines:
- Be constructive and supportive
- Explain why changes are suggested
- Offer multiple options when appropriate
- Respect the original author's voice`,

  general: `You are Nova, a helpful AI assistant. You can see what's on the user's screen when they provide screenshots, which helps you give more relevant and contextual assistance.

Be helpful, accurate, and concise. If you're not sure about something from a screenshot, ask for clarification.`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { messages, provider = 'openrouter', model, images, systemPrompt = 'general' } = body

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid messages format', { status: 400 })
    }

    const systemPromptText = SYSTEM_PROMPTS[systemPrompt] || SYSTEM_PROMPTS.default

    let apiMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }))

    if (images && images.length > 0) {
      const ocrText = images
        .filter((img: any) => img.ocrText)
        .map((img: any) => `[Screenshot Content]:\\n${img.ocrText}`)
        .join('\\n\\n')

      if (ocrText) {
        apiMessages[apiMessages.length - 1].content += `\\n\\n${ocrText}`
      }
    }

    apiMessages = [
      { role: 'system', content: systemPromptText },
      ...apiMessages,
    ]

    let apiUrl = ''
    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    let requestBody: any = {
      model,
      messages: apiMessages,
      stream: true,
    }

    if (provider === 'openrouter') {
      const apiKey = process.env.OPENROUTER_API_KEY || 'sk-or-v1-placeholder'
      apiUrl = 'https://openrouter.ai/api/v1/chat/completions'
      headers['Authorization'] = `Bearer ${apiKey}`
      headers['HTTP-Referer'] = typeof window !== 'undefined' ? window.location.href : 'http://localhost:3000'
      headers['X-Title'] = 'Nova AI'
    } else if (provider === 'openai') {
      const apiKey = process.env.OPENAI_API_KEY || ''
      apiUrl = 'https://api.openai.com/v1/chat/completions'
      headers['Authorization'] = `Bearer ${apiKey}`
    } else if (provider === 'anthropic') {
      const apiKey = process.env.ANTHROPIC_API_KEY || ''
      apiUrl = 'https://api.anthropic.com/v1/messages'
      headers['x-api-key'] = apiKey
      headers['anthropic-version'] = '2023-06-01'
      requestBody = {
        model,
        messages: apiMessages.slice(1),
        system: systemPromptText,
        max_tokens: 4096,
        stream: true,
      }
    } else if (provider === 'groq') {
      const apiKey = process.env.GROQ_API_KEY || ''
      apiUrl = 'https://api.groq.com/openai/v1/chat/completions'
      headers['Authorization'] = `Bearer ${apiKey}`
    } else {
      return new Response('Unsupported AI provider', { status: 400 })
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('AI API error:', errorText)
      return new Response(`AI API error: ${response.statusText}`, { status: response.status })
    }

    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const reader = response.body?.getReader()
          if (!reader) throw new Error('No reader available')

          let buffer = ''

          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\\n')
            buffer = lines.pop() || ''

            for (const line of lines) {
              const trimmed = line.trim()
              if (!trimmed || !trimmed.startsWith('data: ')) continue

              const data = trimmed.slice(6)
              if (data === '[DONE]') continue

              try {
                const parsed = JSON.parse(data)

                let content = ''

                if (provider === 'openrouter' || provider === 'openai' || provider === 'groq') {
                  content = parsed.choices?.[0]?.delta?.content || ''
                } else if (provider === 'anthropic') {
                  if (parsed.type === 'content_block_delta') {
                    content = parsed.delta?.text || ''
                  }
                }

                if (content) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ content })}\\n\\n`)
                  )
                }
              } catch (e) {
                console.error('Failed to parse chunk:', e)
              }
            }
          }

          controller.enqueue(encoder.encode('data: [DONE]\\n\\n'))
          controller.close()
        } catch (error) {
          console.error('Stream error:', error)
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat route error:', error)
    return new Response('Internal server error', { status: 500 })
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
