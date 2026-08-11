import { DEFAULT_PROVIDER } from './productProvider'
import { createManualProduct } from './manualProductProvider'
import type { ProductSearchResult } from '../types'

export { createManualProduct }

export async function searchProducts(query: string): Promise<ProductSearchResult> {
  return DEFAULT_PROVIDER.search(query)
}

export function openIlvaSearch() {
  window.open('https://ilva.se/', '_blank')
}
