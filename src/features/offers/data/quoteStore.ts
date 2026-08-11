import type { OfferQuote } from '../types'

const DRAFT_KEY = 'ilva-offer-draft'
const QUOTE_COUNTER_KEY = 'ilva-offer-counter'

export function loadDraft(): OfferQuote | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    return raw ? (JSON.parse(raw) as OfferQuote) : null
  } catch {
    return null
  }
}

export function saveDraft(quote: OfferQuote) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(quote))
  } catch {}
}

export function clearDraft() {
  localStorage.removeItem(DRAFT_KEY)
}

export function nextQuoteNumber(): string {
  const year = new Date().getFullYear()
  const raw = localStorage.getItem(QUOTE_COUNTER_KEY) ?? '0'
  const next = parseInt(raw, 10) + 1
  localStorage.setItem(QUOTE_COUNTER_KEY, String(next))
  return `DEMO-${year}-${String(next).padStart(4, '0')}`
}
