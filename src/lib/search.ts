import type { SearchableItem } from '../types'
import { searchIndex } from '../data/mockData'

export function searchItems(query: string, limit = 50): SearchableItem[] {
  if (!query.trim()) return []
  const terms = query.toLowerCase().trim().split(/\s+/)

  const scored = searchIndex
    .map((item) => {
      let score = 0
      const hay = [
        item.title,
        item.subtitle,
        item.description,
        item.category,
        item.code,
        ...item.keywords,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      for (const term of terms) {
        if (item.title.toLowerCase().includes(term)) score += 10
        if (item.subtitle?.toLowerCase().includes(term)) score += 5
        if (item.code?.toLowerCase().includes(term)) score += 8
        if (item.category?.toLowerCase().includes(term)) score += 4
        if (hay.includes(term)) score += 2
      }

      return { item, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)

  return scored.slice(0, limit).map(({ item }) => item)
}
