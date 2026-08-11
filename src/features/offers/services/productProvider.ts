import type { ProductProvider } from '../types'
import { demoProductProvider } from './demoProductProvider'
import { ilvaProductProvider } from './ilvaProductProvider'
import { manualProductProvider } from './manualProductProvider'

export const productProviders: Record<string, ProductProvider> = {
  demo: demoProductProvider,
  ilva: ilvaProductProvider,
  manual: manualProductProvider,
}

export const DEFAULT_PROVIDER: ProductProvider =
  import.meta.env?.VITE_USE_DEMO_PROVIDER === 'true' ? demoProductProvider : ilvaProductProvider

export function getProvider(name: string): ProductProvider {
  return productProviders[name] ?? demoProductProvider
}
