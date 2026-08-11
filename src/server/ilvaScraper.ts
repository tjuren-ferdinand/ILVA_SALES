import type { OfferProduct } from '../features/offers/types.ts'

const ILVA_BASE = 'https://ilva.se'
const SITEMAP_URL = `${ILVA_BASE}/sitemap-products1.xml`
const SITEMAP_TTL_MS = 5 * 60 * 1000
const PRODUCT_TTL_MS = 5 * 60 * 1000
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'

let sitemapCache: { urls: string[]; at: number } | null = null
const productCache = new Map<string, { product: OfferProduct; at: number }>()

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

export async function getSitemap(): Promise<string[]> {
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

function scoreUrl(url: string, terms: string[]): number {
  const slug = url.replace(/^https?:\/\/[^/]+/, '').toLowerCase()
  const normalizedSlug = slug
    .replace(/[åä]/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/\//g, ' ')

  let score = 0
  for (const term of terms) {
    if (normalizedSlug.includes(term)) score += 1
    const m = url.match(/p-(\d+)-\d+\/$/)
    if (m && term === m[1]) score += 5
  }
  return score
}

export async function searchIlvaProducts(query: string, limit = 10): Promise<OfferProduct[]> {
  const urls = await getSitemap()
  const terms = normalizeQuery(query)
  if (terms.length === 0) return []

  const scored = urls
    .map((url) => ({ url, score: scoreUrl(url, terms) }))
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(limit * 2, 40))

  const results = await Promise.allSettled(
    scored.map((s) => fetchIlvaProduct(s.url))
  )

  const products: OfferProduct[] = []
  for (const r of results) {
    if (r.status === 'fulfilled') products.push(r.value)
    if (products.length >= limit) break
  }
  return products
}

export async function fetchIlvaProduct(url: string): Promise<OfferProduct> {
  const cached = productCache.get(url)
  if (cached && Date.now() - cached.at < PRODUCT_TTL_MS) {
    return cached.product
  }

  const html = await withTimeout(fetchHtml(url), 10000, `product ${url}`)
  const product = parseProductPage(html, url)
  productCache.set(url, { product, at: Date.now() })
  return product
}

export function parseProductPage(html: string, url: string): OfferProduct {
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

  const priceMatches = [...text.matchAll(/(\d[\d\s\.]*):-/g)]
  const prices = priceMatches
    .map((m) => {
      const raw = m[1].replace(/[\s\.]/g, '').replace(/&nbsp;/g, '')
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

  return {
    id: `ilva-${articleNumber}-${idMatch ? idMatch[2] : Date.now()}`,
    name,
    articleNumber,
    category: category ? capitalize(category) : 'ILVA',
    brand,
    ordinaryPrice,
    source: 'ilva',
    url,
    image,
    description: descMatch?.[1]?.replace(/<[^>]+>/g, '').trim() ?? '',
  }
}

function capitalize(s: string): string {
  return s
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}
