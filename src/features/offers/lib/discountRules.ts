import { discounts } from '../../../data/mockData'
import type { OfferProduct } from '../types'

function parsePercent(value: string): number {
  const match = value.match(/(\d+(?:\.\d+)?)/)
  if (!match) return 0
  return Number(match[1])
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\s\-–—.,;:]/g, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function findMaxDiscount(product: OfferProduct): { percent: number; rule: string } | null {
  const haystacks = [
    normalize(product.name),
    normalize(product.category),
    product.brand ? normalize(product.brand) : '',
    product.series ? normalize(product.series) : '',
    product.description ? normalize(product.description) : '',
  ].filter(Boolean)

  let lowest = Infinity
  let ruleName = ''
  let matched = false

  for (const d of discounts) {
    const needles = [normalize(d.name), ...d.keywords.map(normalize)].filter(Boolean)
    if (needles.some((n) => haystacks.some((h) => h.includes(n)))) {
      const percent = parsePercent(d.value)
      if (percent < lowest) {
        lowest = percent
        ruleName = d.name
        matched = true
      }
    }
  }

  if (matched) {
    return { percent: lowest, rule: ruleName }
  }

  // Fall back to the general rule if it exists
  const fallback = discounts.find((d) => d.id === 'rule-fallback')
  if (fallback) {
    return { percent: parsePercent(fallback.value), rule: fallback.name }
  }

  return null
}
