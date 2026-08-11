import { DEFAULT_PROVIDER } from './productProvider'
import { createManualProduct } from './manualProductProvider'
import type { ProductSearchResult, ProductSearchOptions } from '../types'

export { createManualProduct }

export async function searchProducts(query: string, options?: ProductSearchOptions): Promise<ProductSearchResult> {
  return DEFAULT_PROVIDER.search(query, options)
}

export function openIlvaSearch() {
  window.open('https://ilva.se/', '_blank')
}
