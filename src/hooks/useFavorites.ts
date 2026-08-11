import { useState, useEffect, useCallback } from 'react'
import type { FavoritesKey } from '../types'

const STORAGE_KEY = 'ilva-favorites'

function loadKeys(): FavoritesKey[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as FavoritesKey[]) : []
  } catch {
    return []
  }
}

function saveKeys(keys: FavoritesKey[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keys))
}

export function useFavorites() {
  const [keys, setKeys] = useState<FavoritesKey[]>(() => loadKeys())

  useEffect(() => {
    saveKeys(keys)
  }, [keys])

  const toggle = useCallback((key: FavoritesKey) => {
    setKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }, [])

  const isFavorite = useCallback(
    (key: FavoritesKey) => keys.includes(key),
    [keys]
  )

  return { keys, toggle, isFavorite }
}
