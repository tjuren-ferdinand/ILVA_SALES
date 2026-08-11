import { useCallback, useEffect, useState } from 'react'
import { searchProducts } from '../services/productSearch'
import type { OfferProduct } from '../types'

export function useProductSearch(debounceMs = 150) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<OfferProduct[]>([])
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = useCallback(
    async (q: string) => {
      setSearching(true)
      setError(null)
      try {
        const res = await searchProducts(q)
        setResults(res.products)
        if (res.error) setError(res.error)
      } catch (err) {
        setError('Något gick fel vid sökningen.')
        setResults([])
      } finally {
        setSearching(false)
      }
    },
    []
  )

  useEffect(() => {
    if (query.trim() === '') {
      setResults([])
      setError(null)
      return
    }
    const t = setTimeout(() => handleSearch(query), debounceMs)
    return () => clearTimeout(t)
  }, [query, debounceMs, handleSearch])

  return { query, setQuery, results, searching, error }
}
