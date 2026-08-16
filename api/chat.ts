/// <reference types="node" />

import { GoogleGenAI } from '@google/genai'

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
  const contents: unknown[] = []
  for (const m of messages) {
    if (m.role === 'system') continue
    contents.push({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })
  }
  return contents
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

    const ai = new GoogleGenAI({ apiKey } as any)
    const result = (await (ai as any).models.generateContent({
      model: body.model ?? 'gemini-1.5-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.4,
        maxOutputTokens: 1200,
      },
    } as any)) as any

    const text = typeof result?.text === 'string' ? (result.text as string).trim() : undefined

    if (!text) {
      res.status(200).json({ reply: 'Jag har inget svar just nu.' })
      return
    }

    res.status(200).json({ reply: text })
  } catch (err) {
    console.error('Chat handler error:', err)
    res.status(500).json({ error: 'Internt serverfel.' })
  }
}
