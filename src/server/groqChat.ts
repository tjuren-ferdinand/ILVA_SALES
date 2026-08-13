export type ChatMessage = {
  role: 'system' | 'user' | 'assistant' | 'tool'
  content: string
  tool_calls?: Array<{
    id: string
    type: 'function'
    function: { name: string; arguments: string }
  }>
  tool_call_id?: string
  name?: string
}

export type ChatReplyResult =
  | { reply: string; error?: undefined; status: number }
  | { reply?: undefined; error: string; status: number }

export type ToolDefinition = {
  type: 'function'
  function: {
    name: string
    description: string
    parameters: Record<string, unknown>
  }
}

export type ToolExecutor = (name: string, args: Record<string, unknown>) => Promise<string>

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
        (typeof (m as { content?: unknown }).content === 'string' ||
         (m as { content?: unknown }).content === null)
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

async function callGroq(
  apiKey: string,
  model: string,
  messages: ChatMessage[],
  tools?: ToolDefinition[],
  signal?: AbortSignal,
): Promise<{
  content: string | null
  tool_calls?: Array<{ id: string; type: 'function'; function: { name: string; arguments: string } }>
}> {
  const body: Record<string, unknown> = {
    model,
    messages,
    temperature: 0.4,
    max_tokens: 1200,
  }
  if (tools && tools.length > 0) {
    body.tools = tools
    body.tool_choice = 'auto'
  }

  const response = await fetch(GROQ_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal,
  })

  if (!response.ok) {
    const text = await response.text().catch(() => 'Okänt fel')
    let message = 'Groq svarade inte. Försök igen.'
    if (response.status === 429) message = 'För många förfråganar just nu. Vänta en stund.'
    if (response.status === 401) message = 'Ogiltig API-nyckel.'
    if (response.status === 400) message = 'Ogiltig förfrågan.'
    console.error('Groq error:', response.status, text)
    throw new GroqError(message, mapHttpStatus(response.status))
  }

  const data = (await response.json()) as {
    choices?: {
      message?: {
        content?: string | null
        tool_calls?: Array<{ id: string; type: 'function'; function: { name: string; arguments: string } }>
      }
    }[]
  }

  const msg = data.choices?.[0]?.message
  return {
    content: msg?.content ?? null,
    tool_calls: msg?.tool_calls,
  }
}

class GroqError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export async function createGroqReply(options: {
  messages: unknown
  apiKey: string | undefined
  model?: string
  timeoutMs?: number
  tools?: ToolDefinition[]
  toolExecutor?: ToolExecutor
}): Promise<ChatReplyResult> {
  const { messages, apiKey, model = DEFAULT_MODEL, timeoutMs = 30000, tools, toolExecutor } = options

  if (!apiKey) {
    return { error: 'Servern saknar API-nyckel.', status: 500 }
  }

  if (!isChatMessageArray(messages) || messages.length === 0) {
    return { error: 'Ogiltigt meddelandeformat.', status: 400 }
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    let conversation: ChatMessage[] = [...messages]
    const maxRounds = 4

    for (let round = 0; round < maxRounds; round++) {
      const result = await callGroq(apiKey, model, conversation, tools, controller.signal)

      if (!result.tool_calls || result.tool_calls.length === 0 || !toolExecutor) {
        const reply = result.content?.trim()
        if (!reply) {
          return { error: 'Jag har inget svar just nu.', status: 200 }
        }
        clearTimeout(timer)
        return { reply, status: 200 }
      }

      conversation.push({
        role: 'assistant',
        content: result.content ?? '',
        tool_calls: result.tool_calls,
      })

      for (const tc of result.tool_calls) {
        let args: Record<string, unknown> = {}
        try {
          args = JSON.parse(tc.function.arguments)
        } catch {
          args = {}
        }
        try {
          const toolResult = await toolExecutor(tc.function.name, args)
          conversation.push({
            role: 'tool',
            content: toolResult,
            tool_call_id: tc.id,
            name: tc.function.name,
          })
        } catch (err) {
          conversation.push({
            role: 'tool',
            content: `Fel vid verkställning: ${err instanceof Error ? err.message : 'Okänt fel'}`,
            tool_call_id: tc.id,
            name: tc.function.name,
          })
        }
      }
    }

    clearTimeout(timer)
    return { reply: 'Jag kunde inte slutföra sökningen. Försök igen.', status: 200 }
  } catch (err) {
    clearTimeout(timer)
    if (err instanceof GroqError) {
      return { error: err.message, status: err.status }
    }
    if (err instanceof Error && err.name === 'AbortError') {
      return { error: 'Förfrågan tog för lång tid. Försök igen.', status: 504 }
    }
    console.error('Groq fetch error:', err)
    return { error: 'Kunde inte nå Groq. Försök igen.', status: 502 }
  }
}
