import type { ProductProvider, ProductSearchResult, ProductSearchOptions, OfferProduct } from '../types'

const API_BASE = '/api/ilva'

async function apiSearch(query: string, options?: ProductSearchOptions): Promise<OfferProduct[]> {
  const url = `${API_BASE}/search?q=${encodeURIComponent(query)}&limit=12`
  const res = await fetch(url, { signal: options?.signal })
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Kunde inte hämta produkter från ILVA just nu.' }))
    throw new Error(body.error ?? `ILVA API ${res.status}`)
  }
  const data = (await res.json()) as { products?: OfferProduct[] }
  return data.products ?? []
}

export const ilvaProductProvider: ProductProvider = {
  name: 'ilva',
  async search(query: string, options?: ProductSearchOptions): Promise<ProductSearchResult> {
    try {
      const products = await apiSearch(query, options)
      return { products, source: 'ilva' }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return { products: [], source: 'ilva' }
      }
      const message = err instanceof Error ? err.message : 'Okänt fel'
      return {
        products: [],
        source: 'ilva',
        error:
          message === 'Kunde inte hämta produkter från ILVA just nu.'
            ? 'Kunde inte hämta produkter från ILVA just nu. Försök igen.'
            : message,
      }
    }
  },
  async getProduct(): Promise<OfferProduct | null> {
    return null
  },
}
