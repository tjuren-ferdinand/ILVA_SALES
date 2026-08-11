export type ChatMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export type ChatReplyResult =
  | { reply: string; error?: undefined; status: number }
  | { reply?: undefined; error: string; status: number }

const DEFAULT_MODEL = 'llama-3.1-8b-instant'
const GROQ_API = 'https://api.groq.com/openai/v1/chat/completions'

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

export async function createGroqReply(options: {
  messages: unknown
  apiKey: string | undefined
  model?: string
  timeoutMs?: number
}): Promise<ChatReplyResult> {
  const { messages, apiKey, model = DEFAULT_MODEL, timeoutMs = 25000 } = options

  if (!apiKey) {
    return { error: 'Servern saknar API-nyckel.', status: 500 }
  }

  if (!isChatMessageArray(messages) || messages.length === 0) {
    return { error: 'Ogiltigt meddelandeformat.', status: 400 }
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(GROQ_API, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.4,
        max_tokens: 900,
      }),
      signal: controller.signal,
    })

    clearTimeout(timer)

    if (!response.ok) {
      const text = await response.text().catch(() => 'Okänt fel')
      let message = 'Groq svarade inte. Försök igen.'
      if (response.status === 429) message = 'För många förfråganar just nu. Vänta en stund.'
      if (response.status === 401) message = 'Ogiltig API-nyckel.'
      if (response.status === 400) message = 'Ogiltig förfrågan.'
      console.error('Groq error:', response.status, text)
      return { error: message, status: mapHttpStatus(response.status) }
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[]
    }
    const reply = data.choices?.[0]?.message?.content?.trim()

    if (!reply) {
      return { error: 'Jag har inget svar just nu.', status: 200 }
    }

    return { reply, status: 200 }
  } catch (err) {
    clearTimeout(timer)
    if (err instanceof Error && err.name === 'AbortError') {
      return { error: 'Förfrågan tog för lång tid. Försök igen.', status: 504 }
    }
    console.error('Groq fetch error:', err)
    return { error: 'Kunde inte nå Groq. Försök igen.', status: 502 }
  }
}
