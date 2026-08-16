/// <reference types="node" />

const GEMINI_API = 'https://generativelanguage.googleapis.com/v1beta/models'

type ChatMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

type ChatRequest = {
  method?: string
  body?: {
    messages?: unknown
    model?: string
  }
}

type ChatResponse = {
  status: (code: number) => { json: (body: unknown) => void }
}

function isChatMessageArray(value: unknown): value is ChatMessage[] {
  return (
    Array.isArray(value) &&
    value.every(
      (m) =>
        typeof m === 'object' &&
        m !== null &&
        typeof (m as { role?: unknown }).role === 'string' &&
        typeof (m as { content?: unknown }).content === 'string'
    )
  )
}

function toGeminiContents(messages: ChatMessage[]): unknown[] {
  return messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))
}

function mapGeminiStatus(status: number): number {
  if (status === 429) return 429
  if (status === 401 || status === 403) return 401
  if (status >= 500) return 502
  if (status >= 400) return 400
  return 500
}

export default async function handler(req: ChatRequest, res: ChatResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const body = req.body ?? {}
    const messages = isChatMessageArray(body.messages) ? body.messages : []
    if (messages.length === 0) {
      res.status(400).json({ error: 'Ogiltigt meddelandeformat.' })
      return
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      res.status(500).json({ error: 'Servern saknar API-nyckel.' })
      return
    }

    const systemMessages = messages.filter((m) => m.role === 'system')
    const systemInstruction = systemMessages.length > 0 ? systemMessages.map((m) => m.content).join('\n\n') : undefined
    const contents = toGeminiContents(messages)
    const model = body.model ?? 'gemini-1.5-flash'
    const url = `${GEMINI_API}/${model}:generateContent?key=${apiKey}`

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        ...(systemInstruction
          ? { systemInstruction: { role: 'system', parts: [{ text: systemInstruction }] } }
          : {}),
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1200,
        },
      }),
    })

    if (!response.ok) {
      const text = await response.text().catch(() => 'Okänt fel')
      let message = 'Kunde inte nå Google Gemini. Försök igen.'
      try {
        const parsed = JSON.parse(text) as { error?: { message?: string } }
        if (parsed.error?.message) message = parsed.error.message
      } catch {
        // ignore
      }
      console.error('Gemini API error:', response.status, text)
      res.status(mapGeminiStatus(response.status)).json({ error: message })
      return
    }

    const data = (await response.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[]
      error?: { message?: string }
    }

    if (data.error?.message) {
      res.status(500).json({ error: data.error.message })
      return
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
    if (!text) {
      res.status(200).json({ reply: 'Jag har inget svar just nu.' })
      return
    }

    res.status(200).json({ reply: text })
  } catch (err) {
    console.error('Chat handler error:', err)
    const message = err instanceof Error ? err.message : 'Internt serverfel.'
    res.status(500).json({ error: message })
  }
}
