import { createGroqReply } from '../src/server/groqChat'

const DEFAULT_MODEL = 'llama-3.1-8b-instant'

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { messages, model } = (req.body as { messages?: unknown; model?: string }) ?? {}

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'Servern saknar API-nyckel.' })
    return
  }

  const result = await createGroqReply({
    messages,
    apiKey,
    model: model ?? process.env.GROQ_MODEL ?? DEFAULT_MODEL,
  })

  if (result.error) {
    res.status(result.status).json({ error: result.error })
  } else {
    res.status(result.status).json({ reply: result.reply })
  }
}
