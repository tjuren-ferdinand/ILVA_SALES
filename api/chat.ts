/// <reference types="node" />

const DEFAULT_MODEL = 'llama-3.1-8b-instant'
const GROQ_API = 'https://api.groq.com/openai/v1/chat/completions'

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

function mapHttpStatus(rawStatus: number): number {
  if (rawStatus === 429) return 429
  if (rawStatus === 401 || rawStatus === 403) return 401
  if (rawStatus >= 500) return 502
  if (rawStatus >= 400) return 400
  return 500
}

export default async function handler(req: ChatRequest, res: ChatResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const { messages, model } = req.body ?? {}

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      res.status(500).json({ error: 'Servern saknar API-nyckel.' })
      return
    }

    if (!isChatMessageArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Ogiltigt meddelandeformat.' })
      return
    }

    const response = await fetch(GROQ_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model ?? process.env.GROQ_MODEL ?? DEFAULT_MODEL,
        messages,
        temperature: 0.4,
        max_tokens: 1200,
      }),
    })

    if (!response.ok) {
      const text = await response.text().catch(() => 'Okänt fel')
      let message = 'Groq svarade inte. Försök igen.'
      if (response.status === 429) message = 'För många förfråganar just nu. Vänta en stund.'
      if (response.status === 401) message = 'Ogiltig API-nyckel.'
      if (response.status === 400) message = 'Ogiltig förfrågan.'
      console.error('Groq error:', response.status, text)
      res.status(mapHttpStatus(response.status)).json({ error: message })
      return
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[]
    }
    const reply = data.choices?.[0]?.message?.content?.trim()

    if (!reply) {
      res.status(200).json({ reply: 'Jag har inget svar just nu.' })
      return
    }

    res.status(200).json({ reply })
  } catch (err) {
    console.error('Chat handler error:', err)
    res.status(500).json({ error: 'Internt serverfel.' })
  }
}
