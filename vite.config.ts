import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Connect } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { searchIlvaProducts, fetchIlvaProduct, getProductVariants } from './src/server/ilvaScraper.ts'
import { createGeminiReply, type ToolDefinition, type ToolExecutor } from './src/server/geminiChat.ts'

function sendJson(res: ServerResponse, status: number, data: unknown) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(data))
}

function parseQuery(url: string): Record<string, string> {
  const q = url.split('?')[1] ?? ''
  const params: Record<string, string> = {}
  for (const [k, v] of new URLSearchParams(q)) {
    params[k] = v
  }
  return params
}

function readBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => {
      try {
        const text = Buffer.concat(chunks).toString('utf-8')
        resolve(text ? JSON.parse(text) : {})
      } catch {
        resolve({})
      }
    })
    req.on('error', () => resolve({}))
  })
}

export default defineConfig(({ mode }) => {
  const env = {
    GEMINI_API_KEY: loadEnv(mode, process.cwd(), 'GEMINI_').GEMINI_API_KEY ?? process.env.GEMINI_API_KEY,
  }

  return {
    plugins: [
      react(),
      {
        name: 'ilva-api',
        configureServer(server) {
          server.middlewares.use('/api/ilva/search', (async (req, res) => {
            try {
              const params = parseQuery(req.url ?? '')
              const q = params.q ?? ''
              const limit = Math.min(Math.max(parseInt(params.limit ?? '10', 10), 1), 30)
              if (!q.trim()) {
                sendJson(res, 400, { error: 'Saknar q-parameter' })
                return
              }
              const products = await searchIlvaProducts(q, limit)
              sendJson(res, 200, { products, total: products.length })
            } catch (err) {
              console.error('ILVA search error:', err)
              sendJson(res, 502, { error: 'Kunde inte hämta produkter från ILVA just nu.' })
            }
          }) as Connect.NextHandleFunction)

          server.middlewares.use('/api/ilva/product', (async (req, res) => {
            try {
              const params = parseQuery(req.url ?? '')
              const url = params.url ?? ''
              if (!url) {
                sendJson(res, 400, { error: 'Saknar url-parameter' })
                return
              }
              let parsed: URL
              try {
                parsed = new URL(url)
              } catch {
                sendJson(res, 400, { error: 'Ogiltig länk. Klistra in en fullständig länk från ilva.se.' })
                return
              }
              if (!parsed.hostname.endsWith('ilva.se')) {
                sendJson(res, 400, { error: 'Länken måste vara från ilva.se.' })
                return
              }
              const product = await fetchIlvaProduct(url)
              sendJson(res, 200, product)
            } catch (err) {
              console.error('ILVA product error:', err)
              sendJson(res, 502, { error: 'Kunde inte hämta produkten från ILVA just nu.' })
            }
          }) as Connect.NextHandleFunction)

          server.middlewares.use('/api/ilva/variants', (async (req, res) => {
            try {
              const params = parseQuery(req.url ?? '')
              const url = params.url ?? ''
              if (!url) {
                sendJson(res, 400, { error: 'Saknar url-parameter' })
                return
              }
              let parsed: URL
              try {
                parsed = new URL(url)
              } catch {
                sendJson(res, 400, { error: 'Ogiltig länk.' })
                return
              }
              if (!parsed.hostname.endsWith('ilva.se')) {
                sendJson(res, 400, { error: 'Länken måste vara från ilva.se.' })
                return
              }
              const variants = await getProductVariants(url)
              sendJson(res, 200, { variants })
            } catch (err) {
              console.error('ILVA variants error:', err)
              sendJson(res, 502, { error: 'Kunde inte hämta varianter just nu.' })
            }
          }) as Connect.NextHandleFunction)

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

          server.middlewares.use('/api/chat', (async (req, res) => {
            if (req.method !== 'POST') {
              sendJson(res, 405, { error: 'Method not allowed' })
              return
            }
            try {
              const body = (await readBody(req)) as { messages?: unknown; model?: string }
              const result = await createGeminiReply({
                messages: body.messages,
                apiKey: env.GEMINI_API_KEY,
                model: body.model ?? 'gemini-3.5-flash',
                tools: chatTools,
                toolExecutor: chatToolExecutor,
              })
              sendJson(res, result.status, result.error ? { error: result.error } : { reply: result.reply })
            } catch (err) {
              console.error('Chat handler error:', err)
              sendJson(res, 500, { error: 'Internt serverfel.' })
            }
          }) as Connect.NextHandleFunction)
        },
      },
    ],
    server: {
      host: '0.0.0.0',
    },
  }
})
