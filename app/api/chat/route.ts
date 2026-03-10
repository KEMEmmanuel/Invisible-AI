import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, provider, model, apiKey, ocrContext } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response('Invalid messages format', { status: 400 });
    }

    let apiMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }));

    if (ocrContext) {
      apiMessages[apiMessages.length - 1].content += `\n\n[Context from Screenshot]:\n${ocrContext}`;
    }

    const systemPrompt = "You are Nova, a helpful AI assistant with access to screen capture and OCR data. You can see what's on the user's screen when they provide screenshots. Be concise, thorough, and use code blocks for technical content.";

    apiMessages = [
      { role: 'system', content: systemPrompt },
      ...apiMessages,
    ];

    let apiUrl = '';
    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    let requestBody: any = {
      model,
      messages: apiMessages,
      stream: true,
    };

    if (provider === 'openrouter') {
      const actualKey = apiKey || process.env.OPENROUTER_API_KEY || 'sk-or-v1-placeholder';
      apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
      headers['Authorization'] = `Bearer ${actualKey}`;
      headers['HTTP-Referer'] = 'http://localhost:3000';
      headers['X-Title'] = 'Nova AI';
    } else if (provider === 'openai') {
      apiUrl = 'https://api.openai.com/v1/chat/completions';
      headers['Authorization'] = `Bearer ${apiKey}`;
    } else {
      return new Response('Unsupported AI provider', { status: 400 });
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', errorText);
      return new Response(`AI API error: ${response.statusText}`, { status: response.status });
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const reader = response.body?.getReader();
          if (!reader) throw new Error('No reader available');

          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || !trimmed.startsWith('data: ')) continue;

              const data = trimmed.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content || '';

                if (content) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
                  );
                }
              } catch (e) {
                console.error('Failed to parse chunk:', e);
              }
            }
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat route error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
