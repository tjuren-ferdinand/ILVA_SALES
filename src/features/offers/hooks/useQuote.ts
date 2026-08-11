import { useCallback, useEffect, useMemo, useState } from 'react'
import type { CustomerInfo, DiscountMode, OfferProduct, OfferQuote, OfferQuoteItem } from '../types'
import { calculateQuoteTotals, validateDiscount } from '../lib/calculations'
import {
  addToHistory,
  clearDraft,
  deleteFromHistory,
  loadDraft,
  loadHistory,
  nextQuoteNumber,
  saveDraft,
} from '../data/quoteStore'

const emptyCustomer: CustomerInfo = {
  name: '',
  company: '',
  phone: '',
  email: '',
  address: '',
  postalCode: '',
  city: '',
}

function createEmptyQuote(): OfferQuote {
  return {
    id: `q-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    quoteNumber: nextQuoteNumber(),
    createdAt: new Date().toISOString(),
    validDays: 30,
    status: 'draft',
    customer: emptyCustomer,
    salesperson: { name: 'Demo Säljare' },
    store: { name: 'ILVA Halmstad' },
    items: [],
    globalDiscount: { mode: 'percent', value: 0 },
    customerNote: '',
    internalNote: '',
  }
}

export function useQuote() {
  const [quote, setQuote] = useState<OfferQuote>(() => loadDraft() ?? createEmptyQuote())
  const [history, setHistory] = useState<OfferQuote[]>(() => loadHistory())

  useEffect(() => {
    saveDraft(quote)
  }, [quote])

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'ilva-offer-history' && e.newValue) {
        setHistory(JSON.parse(e.newValue) as OfferQuote[])
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const refreshHistory = useCallback(() => setHistory(loadHistory()), [])

  const addProduct = useCallback((product: OfferProduct, addQuantity = 1) => {
    setQuote((q) => {
      const existing = q.items.find((i) => i.product.id === product.id)
      if (existing) {
        return {
          ...q,
          items: q.items.map((i) =>
            i.product.id === product.id ? { ...i, quantity: i.quantity + addQuantity } : i
          ),
        }
      }
      const item: OfferQuoteItem = {
        id: `qi-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
        product,
        quantity: Math.max(1, addQuantity),
        discountMode: 'percent',
        discountValue: 0,
      }
      return { ...q, items: [...q.items, item] }
    })
  }, [])

  const removeItem = useCallback((itemId: string) => {
    setQuote((q) => ({ ...q, items: q.items.filter((i) => i.id !== itemId) }))
  }, [])

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity < 1) return
    setQuote((q) => ({
      ...q,
      items: q.items.map((i) => (i.id === itemId ? { ...i, quantity } : i)),
    }))
  }, [])

  const updateItemDiscount = useCallback((itemId: string, mode: DiscountMode, value: number) => {
    setQuote((q) => ({
      ...q,
      items: q.items.map((i) => {
        if (i.id !== itemId) return i
        if (validateDiscount(i.product, mode, value) !== null) return i
        return { ...i, discountMode: mode, discountValue: value }
      }),
    }))
  }, [])

  const updateGlobalDiscount = useCallback((mode: 'percent' | 'fixed', value: number) => {
    setQuote((q) => ({ ...q, globalDiscount: { mode, value } }))
  }, [])

  const updateCustomer = useCallback((update: Partial<CustomerInfo>) => {
    setQuote((q) => ({ ...q, customer: { ...q.customer, ...update } }))
  }, [])

  const updateNotes = useCallback((customerNote: string, internalNote: string) => {
    setQuote((q) => ({ ...q, customerNote, internalNote }))
  }, [])

  const saveToHistory = useCallback(() => {
    const withTotal = { ...quote, status: 'ready' as const, createdAt: new Date().toISOString() }
    addToHistory(withTotal)
    setHistory((prev) => [withTotal, ...prev.filter((h) => h.id !== quote.id)].slice(0, 100))
  }, [quote])

  const removeFromHistory = useCallback(
    (id: string) => {
      deleteFromHistory(id)
      refreshHistory()
    },
    [refreshHistory]
  )

  const loadFromHistory = useCallback((q: OfferQuote) => {
    setQuote(q)
    saveDraft(q)
  }, [])

  const resetQuote = useCallback(() => {
    clearDraft()
    setQuote(createEmptyQuote())
  }, [])

  const totals = useMemo(() => calculateQuoteTotals(quote), [quote])

  return {
    quote,
    totals,
    history,
    addProduct,
    removeItem,
    updateQuantity,
    updateItemDiscount,
    updateGlobalDiscount,
    updateCustomer,
    updateNotes,
    saveToHistory,
    removeFromHistory,
    loadFromHistory,
    resetQuote,
  }
}
