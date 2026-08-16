/// <reference types="node" />

import { createGeminiReply, type ToolDefinition, type ToolExecutor } from '../src/server/geminiChat'
import { searchIlvaProducts } from '../src/server/ilvaScraper'

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

const chatTools: ToolDefinition[] = [
  {
    type: 'function',
    function: {
      name: 'search_ilva_products',
      description: 'Sök efter produkter på ilva.se. Returnerar namn, pris, artikelnummer, kategori, bild-URL och länk för varje produkt.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Sökfråga, t.ex. "soffa", "matbord", "Cleveland", "fåtölj". Använd svenska eller danska möbeltermer.',
          },
          limit: {
            type: 'number',
            description: 'Max antal produkter att returnera (1-20). Standard är 8.',
          },
        },
        required: ['query'],
      },
    },
  },
]

const chatToolExecutor: ToolExecutor = async (name, args) => {
  if (name === 'search_ilva_products') {
    const query = String(args.query ?? '').trim()
    if (!query) return 'Ingen sökfråga angiven.'
    const limit = Math.min(Math.max(Number(args.limit ?? 8), 1), 20)
    try {
      const products = await searchIlvaProducts(query, limit)
      if (products.length === 0) return `Inga produkter hittades för "${query}".`
      return JSON.stringify(products.map((p) => ({
        namn: p.name,
        pris: p.ordinaryPrice,
        artikelnummer: p.articleNumber,
        kategori: p.category,
        serie: p.series,
        bild: p.image,
        url: p.url,
      })))
    } catch {
      return 'Kunde inte söka ILVA-produkter just nu.'
    }
  }
  return `Okänd funktion: ${name}`
}

export default async function handler(req: ChatRequest, res: ChatResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const body = req.body ?? {}
    const result = await createGeminiReply({
      messages: body.messages,
      apiKey: process.env.GEMINI_API_KEY,
      model: body.model,
      tools: chatTools,
      toolExecutor: chatToolExecutor,
    })

    res.status(result.status).json(result.error ? { error: result.error } : { reply: result.reply })
  } catch (err) {
    console.error('Chat handler error:', err)
    res.status(500).json({ error: 'Internt serverfel.' })
  }
}
