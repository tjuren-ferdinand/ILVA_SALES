export type DiscountMode = 'percent' | 'fixed' | 'customerPrice'

export type OfferProduct = {
  id: string
  name: string
  articleNumber: string
  category: string
  ordinaryPrice: number // cents
  image?: string
  url?: string
  description?: string
  brand?: string
  series?: string
  source: 'demo' | 'ilva' | 'manual'
}

export type OfferQuoteItem = {
  id: string
  product: OfferProduct
  quantity: number
  discountMode: DiscountMode
  discountValue: number // percent (e.g. 15.0), fixed cents, or customerPrice cents
}

export type CustomerInfo = {
  name: string
  company: string
  phone: string
  email: string
  address: string
  postalCode: string
  city: string
}

export type Salesperson = {
  name: string
}

export type StoreInfo = {
  name: string
}

export type GlobalDiscount = {
  mode: 'percent' | 'fixed'
  value: number
}

export type QuoteStatus = 'draft' | 'ready' | 'sent'

export type OfferQuote = {
  id: string
  quoteNumber: string
  createdAt: string
  validDays: number
  status: QuoteStatus
  customer: CustomerInfo
  salesperson: Salesperson
  store: StoreInfo
  items: OfferQuoteItem[]
  globalDiscount: GlobalDiscount
  customerNote: string
  internalNote: string
}

export type QuoteHistory = Pick<OfferQuote, 'id' | 'quoteNumber' | 'createdAt' | 'status' | 'customer' | 'items'> & {
  total: number
}

export type QuoteTotals = {
  ordinarySubtotal: number
  itemDiscountTotal: number
  customerSubtotal: number
  globalDiscountAmount: number
  finalTotal: number
  savings: number
  productCount: number
  itemCount: number
}

export type ProductSearchResult = {
  products: OfferProduct[]
  source: 'demo' | 'ilva' | 'manual'
  error?: string
}

export interface ProductProvider {
  name: string
  search(query: string): Promise<ProductSearchResult>
  getProduct?(id: string): Promise<OfferProduct | null>
}
