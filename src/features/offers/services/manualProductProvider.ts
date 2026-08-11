import type { OfferProduct, ProductProvider, ProductSearchResult } from '../types'

let manualProducts: OfferProduct[] = []

export const manualProductProvider: ProductProvider = {
  name: 'manual',
  async search(): Promise<ProductSearchResult> {
    // Manual products are not searchable through this provider by design.
    // They are created directly by the salesperson via createManualProduct.
    return { products: [], source: 'manual' }
  },
  async getProduct(id: string): Promise<OfferProduct | null> {
    return manualProducts.find((p) => p.id === id) ?? null
  },
}

export function createManualProduct(
  name: string,
  articleNumber: string,
  ordinaryPrice: number,
  image?: string,
  category = 'Manuell',
  description = ''
): OfferProduct {
  const product: OfferProduct = {
    id: `manual-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    articleNumber,
    category,
    ordinaryPrice,
    image,
    description,
    source: 'manual',
  }
  manualProducts.push(product)
  return product
}
