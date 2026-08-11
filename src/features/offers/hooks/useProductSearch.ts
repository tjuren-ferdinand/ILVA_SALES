import { useEffect, useState } from 'react'
import { searchProducts } from '../services/productSearch'
import type { OfferProduct } from '../types'

export function useProductSearch(debounceMs = 100) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<OfferProduct[]>([])
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) {
      setResults([])
      setError(null)
      setSearching(false)
      return
    }

    let active = true
    const controller = new AbortController()
    const t = setTimeout(() => {
      setSearching(true)
      setError(null)
      searchProducts(q, { signal: controller.signal })
        .then((res) => {
          if (!active) return
          setResults(res.products)
          if (res.error) setError(res.error)
        })
        .catch((err) => {
          if (!active || (err instanceof Error && err.name === 'AbortError')) return
          setError(err instanceof Error ? err.message : 'Något gick fel vid sökningen.')
          setResults([])
        })
        .finally(() => {
          if (active) setSearching(false)
        })
    }, debounceMs)

    return () => {
      active = false
      controller.abort()
      clearTimeout(t)
    }
  }, [query, debounceMs])

  return { query, setQuery, results, searching, error }
}
