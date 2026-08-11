import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Connect } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { searchIlvaProducts, fetchIlvaProduct } from './src/server/ilvaScraper.ts'
import { createGroqReply } from './src/server/groqChat.ts'

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
    GROQ_API_KEY: loadEnv(mode, process.cwd(), 'GROQ_').GROQ_API_KEY ?? process.env.GROQ_API_KEY,
    GROQ_MODEL: loadEnv(mode, process.cwd(), 'GROQ_').GROQ_MODEL ?? process.env.GROQ_MODEL,
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
              const product = await fetchIlvaProduct(url)
              sendJson(res, 200, product)
            } catch (err) {
              console.error('ILVA product error:', err)
              sendJson(res, 502, { error: 'Kunde inte hämta produkten från ILVA just nu.' })
            }
          }) as Connect.NextHandleFunction)

          server.middlewares.use('/api/chat', (async (req, res) => {
            if (req.method !== 'POST') {
              sendJson(res, 405, { error: 'Method not allowed' })
              return
            }
            try {
              const body = (await readBody(req)) as { messages?: unknown; model?: string }
              const result = await createGroqReply({
                messages: body.messages,
                apiKey: env.GROQ_API_KEY,
                model: body.model ?? env.GROQ_MODEL,
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
