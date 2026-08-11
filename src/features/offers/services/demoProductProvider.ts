import { DEMO_PRODUCTS } from '../data/demoProducts'
import type { OfferProduct, ProductProvider, ProductSearchResult } from '../types'

function normalize(q: string) {
  return q
    .toLowerCase()
    .replace(/[\s\-–—.,;:]/g, '')
}

export const demoProductProvider: ProductProvider = {
  name: 'demo',
  async search(query: string): Promise<ProductSearchResult> {
    const q = query.trim()
    if (!q) {
      return { products: DEMO_PRODUCTS.slice(0, 10), source: 'demo' }
    }
    const normalizedQuery = normalize(q)
    const products = DEMO_PRODUCTS.filter((p) => {
      const name = normalize(p.name)
      const article = normalize(p.articleNumber)
      const category = normalize(p.category)
      const brand = p.brand ? normalize(p.brand) : ''
      const description = p.description ? normalize(p.description) : ''
      return (
        name.includes(normalizedQuery) ||
        article.includes(normalizedQuery) ||
        category.includes(normalizedQuery) ||
        brand.includes(normalizedQuery) ||
        description.includes(normalizedQuery)
      )
    })
    return { products, source: 'demo' }
  },
  async getProduct(id: string): Promise<OfferProduct | null> {
    return DEMO_PRODUCTS.find((p) => p.id === id) ?? null
  },
}
