import { useState } from 'react'
import { Search, Package, ExternalLink, Plus } from 'lucide-react'
import { openIlvaSearch } from '../services/productSearch'
import { formatPrice } from '../lib/calculations'
import { ManualProductForm } from './ManualProductForm'
import type { OfferProduct } from '../types'

export function ProductSearch({
  query,
  setQuery,
  searching,
  results,
  onSelect,
  onAdd,
}: {
  query: string
  setQuery: (v: string) => void
  searching: boolean
  results: OfferProduct[]
  onSelect: (p: OfferProduct) => void
  onAdd: (p: OfferProduct) => void
}) {
  const [showManual, setShowManual] = useState(false)
  return (
    <div className="surface p-5 md:p-6">
      <h2 className="text-lg font-semibold text-foreground">Sök produkt</h2>
      <p className="mt-1 text-sm text-muted">Sök efter produkt, artikelnummer eller namn.</p>
      <div className="mt-4 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" strokeWidth={1.5} />
          <input
            id="offer-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Sök efter produkt, artikelnummer eller namn"
            className="w-full rounded-2xl border border-white/40 bg-white/40 py-3 pl-11 pr-4 text-foreground outline-none backdrop-blur-xl placeholder:text-muted focus:border-white/60"
          />
        </div>
        <button
          onClick={() => openIlvaSearch()}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/40 bg-white/40 px-4 py-3 text-sm font-medium text-foreground backdrop-blur-xl transition hover:bg-white/60"
        >
          ILVA.se
          <ExternalLink className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>

      {searching && <p className="mt-4 text-sm text-muted">Söker...</p>}

      {!searching && query && results.length === 0 && (
        <div className="mt-4 rounded-2xl border border-amber-200/50 bg-amber-50/60 p-4 text-sm text-amber-800 backdrop-blur-xl">
          <p>Inga träffar i demo-produktkatalogen.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={() => openIlvaSearch()}
              className="inline-flex items-center gap-1 underline hover:no-underline"
            >
              Öppna ILVA.se
              <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setShowManual(true)}
              className="inline-flex items-center gap-1 underline hover:no-underline"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
              Lägg till manuellt
            </button>
          </div>
        </div>
      )}

      {showManual && (
        <ManualProductForm
          query={query}
          onAdd={onAdd}
          onCancel={() => setShowManual(false)}
        />
      )}

      {results.length > 0 && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} onSelect={onSelect} onAdd={onAdd} />
          ))}
        </div>
      )}
    </div>
  )
}

function ProductCard({
  product,
  onSelect,
  onAdd,
}: {
  product: OfferProduct
  onSelect: (p: OfferProduct) => void
  onAdd: (p: OfferProduct) => void
}) {
  const [imgError, setImgError] = useState(false)

  return (
    <div
      onClick={() => onSelect(product)}
      className="surface cursor-pointer p-4 transition hover:bg-white/60"
    >
      <div className="aspect-[4/3] rounded-xl bg-background/50 flex items-center justify-center overflow-hidden">
        {product.image && !imgError ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <Package className="h-8 w-8 text-muted" strokeWidth={1.5} />
        )}
      </div>
      <h3 className="mt-3 line-clamp-2 font-medium text-foreground">{product.name}</h3>
      <p className="text-xs text-muted">{product.articleNumber} · {product.category}</p>
      <p className="mt-1 font-medium text-foreground">{formatPrice(product.ordinaryPrice)}</p>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onAdd(product)
        }}
        className="mt-3 w-full rounded-xl bg-foreground py-2 text-sm font-medium text-surface transition hover:bg-foreground/90"
      >
        Lägg till
      </button>
    </div>
  )
}
