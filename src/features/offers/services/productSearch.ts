import { MOCK_PRODUCTS } from '../data/mockProducts'
import type { OfferProduct, ProductSearchResult } from '../types'

export async function searchProducts(query: string): Promise<ProductSearchResult> {
  const q = query.trim().toLowerCase()
  if (!q) return { products: [], source: 'mock' }

  const products = MOCK_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.articleNumber.includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.description?.toLowerCase().includes(q) ?? false)
  )

  return { products, source: 'mock' }
}

export function openIlvaSearch() {
  window.open('https://ilva.se/', '_blank')
}

export function createManualProduct(name: string, articleNumber: string, ordinaryPrice: number, image?: string): OfferProduct {
  return {
    id: `manual-${Date.now()}`,
    name,
    articleNumber,
    category: 'Manuell',
    ordinaryPrice,
    image,
  }
}
