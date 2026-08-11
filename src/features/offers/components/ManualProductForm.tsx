import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { parsePriceInput } from '../lib/calculations'
import { createManualProduct } from '../services/productSearch'
import type { OfferProduct } from '../types'

function extractArticleNumber(query: string): string | null {
  const match = query.match(/p-(\d{5,})/)
  return match ? match[1] : null
}

export function ManualProductForm({
  query,
  onAdd,
  onCancel,
}: {
  query: string
  onAdd: (p: OfferProduct) => void
  onCancel?: () => void
}) {
  const [name, setName] = useState('')
  const [article, setArticle] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const extracted = extractArticleNumber(query)
    if (extracted && !article) {
      setArticle(extracted)
    }
  }, [query, article])

  const handleAdd = () => {
    setError(null)
    const priceCents = parsePriceInput(price)
    if (!name.trim()) {
      setError('Ange produktnamn')
      return
    }
    if (!article.trim()) {
      setError('Ange artikelnummer')
      return
    }
    if (priceCents === null || priceCents <= 0) {
      setError('Ange ett giltigt ordinarie pris')
      return
    }
    const product = createManualProduct(name.trim(), article.trim(), priceCents, image.trim() || undefined)
    onAdd(product)
    setName('')
    setArticle('')
    setPrice('')
    setImage('')
    onCancel?.()
  }

  return (
    <div className="surface mt-4 p-4">
      <h3 className="font-medium text-foreground">Lägg till produkt manuellt</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Produktnamn"
          className="w-full rounded-2xl border border-white/40 bg-white/40 px-4 py-2.5 text-sm text-foreground outline-none backdrop-blur-xl placeholder:text-muted focus:border-white/60 sm:col-span-2"
        />
        <input
          type="text"
          value={article}
          onChange={(e) => setArticle(e.target.value)}
          placeholder="Artikelnummer"
          className="w-full rounded-2xl border border-white/40 bg-white/40 px-4 py-2.5 text-sm text-foreground outline-none backdrop-blur-xl placeholder:text-muted focus:border-white/60"
        />
        <input
          type="text"
          inputMode="decimal"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Ordinarie pris (kr)"
          className="w-full rounded-2xl border border-white/40 bg-white/40 px-4 py-2.5 text-sm text-foreground outline-none backdrop-blur-xl placeholder:text-muted focus:border-white/60"
        />
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="Bild-URL (valfritt)"
          className="w-full rounded-2xl border border-white/40 bg-white/40 px-4 py-2.5 text-sm text-foreground outline-none backdrop-blur-xl placeholder:text-muted focus:border-white/60 sm:col-span-2"
        />
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <div className="mt-3 flex gap-2">
        <button
          onClick={handleAdd}
          className="inline-flex items-center gap-2 rounded-2xl bg-foreground px-4 py-2.5 text-sm font-medium text-surface transition hover:bg-foreground/90"
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          Lägg till i offert
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="rounded-2xl border border-white/40 bg-white/40 px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-white/60"
          >
            Avbryt
          </button>
        )}
      </div>
    </div>
  )
}
