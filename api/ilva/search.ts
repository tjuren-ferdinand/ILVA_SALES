/// <reference types="node" />

const ILVA_BASE = 'https://ilva.se'
const SITEMAP_URL = `${ILVA_BASE}/sitemap-products1.xml`
const SITEMAP_TTL_MS = 5 * 60 * 1000
const PRODUCT_TTL_MS = 5 * 60 * 1000
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'

let sitemapCache: { urls: string[]; at: number } | null = null
const productCache = new Map<string, { product: OfferProduct; at: number }>()

type OfferProduct = {
  id: string
  name: string
  articleNumber: string
  category: string
  ordinaryPrice: number
  image?: string
  url?: string
  description?: string
  brand?: string
  series?: string
  source: 'ilva'
}

type IlvaRequest = {
  method?: string
  url?: string
  query?: Record<string, unknown>
  body?: unknown
}

type IlvaResponse = {
  status: (code: number) => { json: (body: unknown) => void }
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`${label} timed out`)), ms)),
  ])
}

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT },
    redirect: 'follow',
  })
  if (!res.ok) throw new Error(`ILVA returned ${res.status} for ${url}`)
  return res.text()
}

async function getSitemap(): Promise<string[]> {
  if (sitemapCache && Date.now() - sitemapCache.at < SITEMAP_TTL_MS) {
    return sitemapCache.urls
  }

  const xml = await withTimeout(fetchHtml(SITEMAP_URL), 15000, 'sitemap')
  const urls: string[] = []
  const locRe = /<loc>([^<]+)<\/loc>/g
  let m: RegExpExecArray | null
  while ((m = locRe.exec(xml)) !== null) {
    urls.push(m[1].trim())
  }

  sitemapCache = { urls, at: Date.now() }
  return urls
}

function normalizeQuery(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[åä]/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1)
}

function stem(word: string): string {
  if (word.length <= 4) return word
  const stripped = word.replace(/(ornas|arnas|ornar|arna|erna|orna|ors|ars|na|or|ar|er|en|et|s|a)$/, '')
  return stripped.length >= 3 ? stripped : word
}

function scoreUrl(url: string, terms: string[]): number {
  const slug = url.replace(/^https?:\/\/[^/]+/, '').toLowerCase()
  const normalizedSlug = slug
    .replace(/[åä]/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/\//g, ' ')

  let score = 0
  for (const term of terms) {
    if (normalizedSlug.includes(term)) {
      score += 2
    } else {
      const stemmed = stem(term)
      if (stemmed !== term && normalizedSlug.includes(stemmed)) score += 1
    }
    const m = url.match(/p-(\d+)-\d+\/$/)
    if (m && term === m[1]) score += 5
  }
  return score
}

function parseProductPage(html: string, url: string): OfferProduct {
  const titleMatch = html.match(/<meta[^>]*?og:title[^>]*?content="([^"]*)"[^>]*?>/i)
  const descMatch = html.match(/<meta[^>]*?og:description[^>]*?content="([^"]*)"[^>]*?>/i)
  const imageMatch = html.match(
    /https:\/\/media\.ilva\.se\/webshop\/dam\/photo1\/(\d+-\d{3})\.jpg/i
  )
  const idMatch = url.match(/p-(\d+)-(\d+)\/?$/)

  const rawName = (titleMatch?.[1] ?? '').replace(/\s*-\s*ILVA\s*$/i, '').trim()
  const name = rawName || 'ILVA-produkt'
  const brand = name.includes(' - ') ? name.split(' - ')[0].trim() : ''

  const text = html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')

  let priceMatches: RegExpMatchArray[] = []
  if (name) {
    let searchFrom = 0
    while (searchFrom < text.length) {
      const idx = text.indexOf(name, searchFrom)
      if (idx === -1) break
      const window = text.slice(idx, idx + 300)
      const found = [...window.matchAll(/(\d[\d\s.]*):-/g)]
      if (found.length > 0) {
        priceMatches = found
        break
      }
      searchFrom = idx + name.length
    }
  }
  if (priceMatches.length === 0) {
    priceMatches = [...text.matchAll(/(\d[\d\s.]*):-/g)]
  }
  const prices = priceMatches
    .map((m) => {
      const raw = m[1].replace(/[\s.]/g, '').replace(/&nbsp;/g, '')
      const num = parseInt(raw, 10)
      return isNaN(num) ? 0 : num
    })
    .filter((n) => n > 0)
  const ordinaryPrice = prices.length ? Math.max(...prices) * 100 : 0

  const articleNumber = idMatch ? idMatch[1] : ''
  const image = imageMatch
    ? `https://media.ilva.se/webshop/dam/photo1/${imageMatch[1]}.jpg?rmode=pad&bgcolor=fff&quality=80&center=0.5%2C0.5&width=1200&height=1200`
    : undefined

  const pathParts = new URL(url).pathname.split('/').filter(Boolean)
  const category =
    pathParts.length > 3 ? pathParts[pathParts.length - 4]?.replace(/-/g, ' ') : ''

  const variantSlug = pathParts.length > 1 ? pathParts[pathParts.length - 2] : ''
  const series = variantSlug ? capitalize(variantSlug.replace(/-/g, ' ')) : ''

  return {
    id: `ilva-${articleNumber}-${idMatch ? idMatch[2] : Date.now()}`,
    name,
    articleNumber,
    category: category ? capitalize(category) : 'ILVA',
    brand,
    series,
    ordinaryPrice,
    source: 'ilva',
    url,
    image,
    description: descMatch?.[1]?.replace(/<[^>]+>/g, '').trim() ?? '',
  }
}

async function fetchIlvaProduct(url: string): Promise<OfferProduct> {
  const cached = productCache.get(url)
  if (cached && Date.now() - cached.at < PRODUCT_TTL_MS) {
    return cached.product
  }

  const html = await withTimeout(fetchHtml(url), 7000, `product ${url}`)
  const product = parseProductPage(html, url)
  productCache.set(url, { product, at: Date.now() })
  return product
}

async function fetchInBatches<T>(items: string[], batchSize: number, limit: number, onResult: (item: string) => Promise<T | null>): Promise<T[]> {
  const results: T[] = []
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const settled = await Promise.allSettled(batch.map((url) => onResult(url).catch(() => null)))
    for (const s of settled) {
      if (s.status === 'fulfilled' && s.value) {
        results.push(s.value)
        if (results.length >= limit) return results
      }
    }
  }
  return results
}

async function searchIlvaProducts(query: string, limit = 10): Promise<OfferProduct[]> {
  const urls = await withTimeout(getSitemap(), 12000, 'sitemap')
  const terms = normalizeQuery(query)
  if (terms.length === 0) return []

  const scored = urls
    .map((url) => ({ url, score: scoreUrl(url, terms) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(limit * 3, 30))

  return fetchInBatches(scored.map((s) => s.url), 6, limit, async (url) => {
    const product = await fetchIlvaProduct(url)
    return product.name === 'ILVA-produkt' && product.ordinaryPrice === 0 ? null : product
  })
}

function capitalize(s: string): string {
  return s
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function parseQuery(urlString?: string): Record<string, string> {
  const q = (urlString ?? '').split('?')[1] ?? ''
  const params: Record<string, string> = {}
  for (const [k, v] of new URLSearchParams(q)) {
    params[k] = v
  }
  return params
}

export default async function handler(req: IlvaRequest, res: IlvaResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const params = parseQuery(req.url)
    const q = params.q ?? ''
    const limit = Math.min(Math.max(parseInt(params.limit ?? '12', 10), 1), 30)

    if (!q.trim()) {
      res.status(400).json({ error: 'Saknar q-parameter' })
      return
    }

    const products = await searchIlvaProducts(q, limit)
    res.status(200).json({ products, total: products.length })
  } catch (err) {
    console.error('ILVA search error:', err)
    res.status(502).json({ error: 'Kunde inte hämta produkter från ILVA just nu.' })
  }
}
