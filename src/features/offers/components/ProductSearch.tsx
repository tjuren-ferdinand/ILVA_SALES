import { memo, useState } from 'react'
import { Search, Plus, ExternalLink, X, Loader2, TrendingUp, Lightbulb } from 'lucide-react'
import { useProductSearch } from '../hooks/useProductSearch'
import { openIlvaSearch } from '../services/productSearch'
import { formatPrice } from '../lib/calculations'
import { ProductImage } from './ui/ProductImage'
import { ManualProductForm } from './ManualProductForm'
import type { OfferProduct } from '../types'

const QUICK_SEARCHES = [
  'Havanna',
  'Bäddsoffa',
  'Soffor',
  'Sängar',
  'Matbord',
  'Fåtöljer',
  'Lampor',
]

function SearchSkeleton() {
  return (
    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="surface p-0"
        >
          <div className="aspect-[4/3] animate-pulse rounded-2xl bg-background/60" />
          <div className="space-y-2 p-4">
            <div className="h-3 w-1/3 animate-pulse rounded bg-background/60" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-background/60" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-background/60" />
            <div className="flex items-center justify-between pt-2">
              <div className="h-5 w-16 animate-pulse rounded bg-background/60" />
              <div className="h-7 w-20 animate-pulse rounded-2xl bg-foreground/20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function QuickSearchChip({
  term,
  onClick,
}: {
  term: string
  onClick: (term: string) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onClick(term)}
      className="inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white/40 px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-white/60"
    >
      <TrendingUp className="h-3 w-3 text-muted" strokeWidth={1.5} />
      {term}
    </button>
  )
}

function ProductSearchComponent({
  onSelect,
  onAdd,
}: {
  onSelect: (p: OfferProduct) => void
  onAdd: (p: OfferProduct) => void
}) {
  const { query, setQuery, results, searching, stale, error } = useProductSearch(250)
  const [showManual, setShowManual] = useState(false)

  const setTerm = (term: string) => {
    setQuery(term)
    if (showManual) setShowManual(false)
  }

  return (
    <div className="surface p-5 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Sök ILVA-produkter</h2>
          <p className="text-sm text-muted">Skriv namn, artikelnummer eller kategori.</p>
        </div>
        <button
          onClick={() => openIlvaSearch()}
          className="inline-flex items-center gap-1.5 rounded-2xl border border-white/40 bg-white/40 px-3 py-2 text-xs font-medium text-foreground transition hover:bg-white/60"
        >
          ILVA.se
          <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>
      </div>

      <div className="mt-4 relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" strokeWidth={1.5} />
        <input
          id="offer-search"
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            if (showManual) setShowManual(false)
          }}
          placeholder="Sök produkt, artikelnummer eller kategori"
          className="w-full rounded-2xl border border-white/40 bg-white/40 py-3 pl-11 pr-10 text-sm text-foreground outline-none backdrop-blur-xl placeholder:text-muted transition focus:border-white/60 focus:bg-white/60"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={() => setTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted transition hover:bg-white/40 hover:text-foreground"
            aria-label="Rensa sökning"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Lightbulb className="h-3.5 w-3.5 text-muted" strokeWidth={1.5} />
        <span className="text-xs text-muted">Snabbsök:</span>
        {QUICK_SEARCHES.map((term) => (
          <QuickSearchChip key={term} term={term} onClick={setTerm} />
        ))}
      </div>

      {(searching || stale) && (
        <div className="mt-4 flex items-center gap-2 text-sm text-muted">
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
          {results.length > 0 ? 'Uppdaterar resultat…' : 'Söker på ILVA…'}
        </div>
      )}

      {searching && results.length === 0 && <SearchSkeleton />}

      {!searching && error && (
        <div className="mt-4 rounded-2xl border border-amber-200/50 bg-amber-50/60 p-4 text-sm text-amber-800">
          {error}
        </div>
      )}

      {!searching && !stale && query.length >= 2 && results.length === 0 && !error && (
        <div className="mt-4 rounded-2xl border border-amber-200/50 bg-amber-50/60 p-4 text-sm text-amber-800">
          <p>Inga träffar på ILVA.se för ”{query}”.</p>
          <p className="mt-1 text-xs text-amber-700">Prova en snabbsökning ovan eller ange artikeln manuellt.</p>
          <div className="mt-3 flex flex-wrap gap-3">
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
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>{results.length} träffar</span>
            <span>Sökresultat från ILVA.se</span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((product) => (
              <div
                key={product.id}
                onClick={() => onSelect(product)}
                className="group surface cursor-pointer p-0 transition hover:-translate-y-0.5 hover:shadow-soft"
              >
                <ProductImage product={product} className="w-full" aspect="4/3" />
                <div className="p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted">
                    {product.brand ?? product.category}
                  </p>
                  <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-foreground group-hover:text-foreground/80">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted">
                    {product.articleNumber} · {product.category}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-lg font-light text-foreground">
                      {formatPrice(product.ordinaryPrice)}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onAdd(product)
                      }}
                      className="rounded-2xl bg-foreground px-3 py-1.5 text-xs font-medium text-surface transition hover:bg-foreground/90"
                    >
                      + Lägg till
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export const ProductSearch = memo(ProductSearchComponent)
