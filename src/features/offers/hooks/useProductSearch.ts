import { useEffect, useRef, useState } from 'react'
import { searchProducts } from '../services/productSearch'
import type { OfferProduct } from '../types'

export function useProductSearch(debounceMs = 250) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<OfferProduct[]>([])
  const [stale, setStale] = useState(false)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const latestQRef = useRef('')

  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) {
      setResults([])
      setError(null)
      setStale(false)
      setSearching(false)
      return
    }

    let active = true
    const controller = new AbortController()
    setStale(q !== latestQRef.current && results.length > 0)
    const t = setTimeout(() => {
      setSearching(true)
      setError(null)
      latestQRef.current = q
      searchProducts(q, { signal: controller.signal })
        .then((res) => {
          if (!active) return
          setResults(res.products)
          if (res.error) setError(res.error)
          setStale(false)
        })
        .catch((err) => {
          if (!active || (err instanceof Error && err.name === 'AbortError')) return
          setError(err instanceof Error ? err.message : 'Något gick fel vid sökningen.')
          setResults([])
          setStale(false)
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

  return { query, setQuery, results, searching, stale, error }
}
