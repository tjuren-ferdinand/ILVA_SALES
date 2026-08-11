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

export type OfferQuote = {
  id: string
  quoteNumber: string
  createdAt: string
  validDays: number
  customer: CustomerInfo
  salesperson: Salesperson
  store: StoreInfo
  items: OfferQuoteItem[]
  globalDiscount: GlobalDiscount
  customerNote: string
  internalNote: string
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
  source: 'mock' | 'ilva'
  error?: string
}
