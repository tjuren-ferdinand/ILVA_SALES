import { GoogleGenAI } from '@google/genai'

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

export const DEFAULT_MODEL = 'gemini-flash-latest'

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

function buildGeminiTools(tools?: ToolDefinition[]): unknown[] | undefined {
  if (!tools || tools.length === 0) return undefined
  return tools.map((t) => ({
    functionDeclarations: [
      {
        name: t.function.name,
        description: t.function.description,
        parameters: t.function.parameters,
      },
    ],
  }))
}

function parseArgs(args: unknown): Record<string, unknown> {
  if (typeof args === 'string') {
    try {
      return JSON.parse(args) as Record<string, unknown>
    } catch {
      return {}
    }
  }
  if (args && typeof args === 'object') return args as Record<string, unknown>
  return {}
}

function toGeminiContents(messages: ChatMessage[]): unknown[] {
  const contents: unknown[] = []
  for (const m of messages) {
    if (m.role === 'system') continue
    if (m.role === 'user') {
      contents.push({
        role: 'user',
        parts: [{ text: m.content }],
      })
    } else if (m.role === 'assistant') {
      if (m.tool_calls && m.tool_calls.length > 0) {
        contents.push({
          role: 'model',
          parts: m.tool_calls.map((tc) => ({
            functionCall: {
              name: tc.function.name,
              args: parseArgs(tc.function.arguments),
            },
          })),
        })
      } else if (m.content) {
        contents.push({
          role: 'model',
          parts: [{ text: m.content }],
        })
      }
    } else if (m.role === 'tool') {
      contents.push({
        role: 'user',
        parts: [
          {
            functionResponse: {
              name: m.name ?? '',
              response: { result: m.content },
            },
          },
        ],
      })
    }
  }
  return contents
}

class GeminiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

function timeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timer = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Timeout')), ms)
  })
  return Promise.race([promise, timer])
}

export async function createGeminiReply(options: {
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

  const systemMessages = messages.filter((m) => m.role === 'system')
  const systemInstruction =
    systemMessages.length > 0 ? systemMessages.map((m) => m.content).join('\n\n') : undefined
  const conversation = toGeminiContents(messages)

  const ai = new GoogleGenAI({ apiKey } as any)

  try {
    const maxRounds = 4
    for (let round = 0; round < maxRounds; round++) {
      const result = (await timeout(
        (ai as any).models.generateContent({
          model,
          contents: conversation,
          config: {
            systemInstruction,
            tools: buildGeminiTools(tools) as any,
            temperature: 0.4,
            maxOutputTokens: 1200,
          },
        } as any),
        timeoutMs
      )) as any

      const text = typeof result?.text === 'string' ? (result.text as string).trim() : undefined
      const functionCalls: any[] = Array.isArray(result?.functionCalls) ? result.functionCalls : []

      if (functionCalls.length === 0 || !toolExecutor) {
        if (!text) {
          return { error: 'Jag har inget svar just nu.', status: 200 }
        }
        return { reply: text, status: 200 }
      }

      conversation.push({
        role: 'model',
        parts: functionCalls.map((fc) => ({ functionCall: fc.functionCall })),
      })

      for (const fc of functionCalls) {
        const call = fc.functionCall
        const name = String(call?.name ?? '')
        const args = call?.args ?? {}
        let toolResult = ''
        try {
          toolResult = await toolExecutor(name, args as Record<string, unknown>)
        } catch (err) {
          toolResult = `Fel vid verkställning: ${err instanceof Error ? err.message : 'Okänt fel'}`
        }
        conversation.push({
          role: 'user',
          parts: [
            {
              functionResponse: {
                name,
                response: { result: toolResult },
              },
            },
          ],
        })
      }
    }

    return { reply: 'Jag kunde inte slutföra sökningen. Försök igen.', status: 200 }
  } catch (err) {
    if (err instanceof Error && err.message === 'Timeout') {
      return { error: 'Förfrågan tog för lång tid. Försök igen.', status: 504 }
    }
    if (err instanceof GeminiError) {
      return { error: err.message, status: err.status }
    }
    if (err instanceof Error && err.message) {
      const status = mapHttpStatus((err as { status?: number }).status ?? 500)
      return { error: err.message, status }
    }
    console.error('Gemini error:', err)
    return { error: 'Kunde inte nå Google Gemini. Försök igen.', status: 502 }
  }
}
