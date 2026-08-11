import type { DiscountMode, OfferProduct, OfferQuote, OfferQuoteItem, QuoteTotals } from '../types'

export function formatPrice(amount: number): string {
  return `${(amount / 100).toLocaleString('sv-SE', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} kr`
}

export function parsePriceInput(value: string): number | null {
  const cleaned = value.replace(/\s/g, '').replace(/,/g, '.')
  const num = parseFloat(cleaned)
  if (isNaN(num)) return null
  return Math.round(num * 100)
}

export function priceInputString(cents: number): string {
  return (cents / 100).toLocaleString('sv-SE', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

export function calculateCustomerUnitPrice(product: OfferProduct, mode: DiscountMode, value: number): number {
  const ordinary = product.ordinaryPrice
  if (mode === 'percent') {
    const discount = Math.round((ordinary * value) / 100)
    return ordinary - discount
  }
  if (mode === 'fixed') {
    return ordinary - value
  }
  if (mode === 'customerPrice') {
    return value
  }
  return ordinary
}

export function calculateDiscountAmount(product: OfferProduct, mode: DiscountMode, value: number): number {
  return product.ordinaryPrice - calculateCustomerUnitPrice(product, mode, value)
}

export function calculateDiscountPercent(product: OfferProduct, customerPrice: number): number {
  if (product.ordinaryPrice === 0) return 0
  return Number((((product.ordinaryPrice - customerPrice) / product.ordinaryPrice) * 100).toFixed(2))
}

export function calculateLineItem(item: OfferQuoteItem): {
  ordinaryLineTotal: number
  customerLineTotal: number
  lineDiscount: number
  customerUnitPrice: number
} {
  const customerUnitPrice = calculateCustomerUnitPrice(item.product, item.discountMode, item.discountValue)
  const ordinaryLineTotal = item.product.ordinaryPrice * item.quantity
  const customerLineTotal = customerUnitPrice * item.quantity
  const lineDiscount = ordinaryLineTotal - customerLineTotal
  return { ordinaryLineTotal, customerLineTotal, lineDiscount, customerUnitPrice }
}

function calculateGlobalDiscountAmount(customerSubtotal: number, mode: 'percent' | 'fixed', value: number): number {
  if (mode === 'percent') {
    return Math.round((customerSubtotal * value) / 100)
  }
  if (mode === 'fixed') {
    return value
  }
  return 0
}

export function calculateQuoteTotals(quote: OfferQuote): QuoteTotals {
  let ordinarySubtotal = 0
  let itemDiscountTotal = 0
  let customerSubtotal = 0
  let productCount = 0
  let itemCount = 0

  for (const item of quote.items) {
    const { ordinaryLineTotal, customerLineTotal, lineDiscount } = calculateLineItem(item)
    ordinarySubtotal += ordinaryLineTotal
    customerSubtotal += customerLineTotal
    itemDiscountTotal += lineDiscount
    productCount += 1
    itemCount += item.quantity
  }

  const globalDiscountAmount = calculateGlobalDiscountAmount(customerSubtotal, quote.globalDiscount.mode, quote.globalDiscount.value)
  const finalTotal = customerSubtotal - globalDiscountAmount
  const savings = ordinarySubtotal - finalTotal

  return {
    ordinarySubtotal,
    itemDiscountTotal,
    customerSubtotal,
    globalDiscountAmount,
    finalTotal,
    savings,
    productCount,
    itemCount,
  }
}

export function validateDiscount(product: OfferProduct, mode: DiscountMode, value: number): string | null {
  if (mode === 'percent') {
    if (value < 0) return 'Rabatt i procent får inte vara negativ'
    if (value > 100) return 'Rabatt i procent får inte överstiga 100 %'
  }
  if (mode === 'fixed') {
    if (value < 0) return 'Rabattbelopp får inte vara negativt'
    if (value > product.ordinaryPrice) return 'Rabattbelopp får inte överstiga ordinarie pris'
  }
  if (mode === 'customerPrice') {
    if (value < 0) return 'Kundpris får inte vara negativt'
    if (value > product.ordinaryPrice) return 'Kundpris får inte överstiga ordinarie pris'
  }
  return null
}
