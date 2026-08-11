import type { Connect } from 'vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { searchIlvaProducts, fetchIlvaProduct } from './src/server/ilvaScraper.ts'

function sendJson(res: any, status: number, data: unknown) {
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

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'ilva-api',
      configureServer(server) {
        server.middlewares.use('/api/ilva/search' as any, (async (req, res) => {
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

        server.middlewares.use('/api/ilva/product' as any, (async (req, res) => {
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
      },
    },
  ],
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api/v1': {
        target: 'https://api.groq.com/openai/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/v1/, ''),
      },
    },
  },
})
