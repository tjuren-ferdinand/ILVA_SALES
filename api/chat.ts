import { createGroqReply, type ToolDefinition, type ToolExecutor } from '../src/server/groqChat'
import { searchIlvaProducts } from '../src/server/ilvaScraper'

const DEFAULT_MODEL = 'llama-3.1-8b-instant'

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
  }
  return `Okänd funktion: ${name}`
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

export default async function handler(req: ChatRequest, res: ChatResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { messages, model } = req.body ?? {}

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'Servern saknar API-nyckel.' })
    return
  }

  const result = await createGroqReply({
    messages,
    apiKey,
    model: model ?? process.env.GROQ_MODEL ?? DEFAULT_MODEL,
    tools: chatTools,
    toolExecutor: chatToolExecutor,
  })

  if (result.error) {
    res.status(result.status).json({ error: result.error })
  } else {
    res.status(result.status).json({ reply: result.reply })
  }
}
