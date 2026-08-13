import type { OfferQuote } from '../types'

const DRAFT_KEY = 'ilva-offer-draft'
const HISTORY_KEY = 'ilva-offer-history'
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

export function nextQuoteNumber(storeCode = 'HAL'): string {
  const year = new Date().getFullYear()
  const raw = localStorage.getItem(QUOTE_COUNTER_KEY) ?? '0'
  const next = parseInt(raw, 10) + 1
  localStorage.setItem(QUOTE_COUNTER_KEY, String(next))
  return `ILVA-${storeCode}-${year}-${String(next).padStart(4, '0')}`
}

export function loadHistory(): OfferQuote[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? (JSON.parse(raw) as OfferQuote[]) : []
  } catch {
    return []
  }
}

export function addToHistory(quote: OfferQuote) {
  try {
    const existing = loadHistory()
    const filtered = existing.filter((q) => q.id !== quote.id)
    const next = [quote, ...filtered].slice(0, 100)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
  } catch {}
}

export function deleteFromHistory(id: string) {
  try {
    const existing = loadHistory()
    const next = existing.filter((q) => q.id !== id)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
  } catch {}
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY)
}
