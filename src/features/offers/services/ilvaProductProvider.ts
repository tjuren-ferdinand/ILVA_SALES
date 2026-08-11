import type { ProductProvider, ProductSearchResult } from '../types'

export const ilvaProductProvider: ProductProvider = {
  name: 'ilva',
  async search(_query: string): Promise<ProductSearchResult> {
    // NOTE: This provider is a placeholder for an approved ILVA product integration.
    // No public, stable ILVA JSON/API endpoint has been identified so far.
    // This stub returns an empty result with a clear message so the UI can
    // guide the salesperson to use the Demo or Manual provider instead.
    return {
      products: [],
      source: 'ilva',
      error:
        'Riktig ILVA-integration är inte tillgänglig i denna version. Använd demo-produkter eller lägg till en produkt manuellt.',
    }
  },
  async getProduct(): Promise<null> {
    return null
  },
}
