import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/ui/PageHeader'
import { CopyButton } from '../components/ui/CopyButton'
import { Badge } from '../components/ui/Badge'
import { ProductImage } from '../features/offers/components/ui/ProductImage'
import { formatPrice } from '../features/offers/lib/calculations'
import { productRules } from '../data/mockData'
import type { OfferProduct } from '../features/offers/types'
import {
  Sofa,
  Share2,
  Monitor,
  ExternalLink,
  Search,
  X,
  ChevronLeft,
  RefreshCw,
  Loader2,
  Check,
} from 'lucide-react'

const categories = [
  { label: 'Soffor', query: 'soffa' },
  { label: 'Sängar', query: 'säng' },
  { label: 'Matbord', query: 'matbord' },
  { label: 'Stolar', query: 'stol' },
  { label: 'Förvaring', query: 'förvaring' },
  { label: 'Belysning', query: 'lampa' },
  { label: 'Mattor', query: 'matta' },
  { label: 'Dekoration', query: 'dekoration' },
]

async function fetchProducts(query: string, signal?: AbortSignal): Promise<{ products: OfferProduct[]; error?: string }> {
  const res = await fetch(`/api/ilva/search?q=${encodeURIComponent(query)}&limit=15`, { signal })
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Kunde inte hämta produkter från ILVA just nu.' }))
    return { products: [], error: body.error ?? 'Kunde inte hämta produkter från ILVA just nu.' }
  }
  const data = (await res.json()) as { products?: OfferProduct[] }
  return { products: data.products ?? [] }
}

async function fetchVariants(url: string, signal?: AbortSignal): Promise<OfferProduct[]> {
  const res = await fetch(`/api/ilva/variants?url=${encodeURIComponent(url)}`, { signal })
  if (!res.ok) return []
  const data = (await res.json()) as { variants?: OfferProduct[] }
  return data.variants ?? []
}

export function Showcase() {
  const [activeCategory, setActiveCategory] = useState(categories[0])
  const [searchInput, setSearchInput] = useState('')
  const [products, setProducts] = useState<OfferProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [shown, setShown] = useState<OfferProduct | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const activeQuery = searchInput.trim().length >= 2 ? searchInput.trim() : activeCategory.query

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)
    const t = setTimeout(() => {
      fetchProducts(activeQuery, controller.signal)
        .then((res) => {
          setProducts(res.products)
          setError(res.error ?? null)
        })
        .catch((err) => {
          if (err instanceof Error && err.name === 'AbortError') return
          setError('Kunde inte hämta produkter från ILVA just nu.')
          setProducts([])
        })
        .finally(() => setLoading(false))
    }, 150)

    return () => {
      controller.abort()
      clearTimeout(t)
    }
  }, [activeQuery, refreshKey])

  const [share, setShare] = useState(false)
  const [variants, setVariants] = useState<OfferProduct[]>([])
  const [variantsLoading, setVariantsLoading] = useState(false)

  useEffect(() => {
    if (!shown?.url) {
      setVariants([])
      return
    }
    const controller = new AbortController()
    setVariantsLoading(true)
    fetchVariants(shown.url, controller.signal)
      .then((v) => setVariants(v))
      .catch(() => setVariants([]))
      .finally(() => setVariantsLoading(false))
    return () => controller.abort()
  }, [shown?.url])

  const shareText = useMemo(() => {
    if (!shown) return ''
    const variantLabel = shown.series ? ` (${shown.series})` : ''
    return `Titta på ILVA ${shown.name}${variantLabel} — ${formatPrice(shown.ordinaryPrice)}\n${shown.url ?? ''}`
  }, [shown])

  const selectProduct = (p: OfferProduct) => {
    setShown(p)
    setShare(false)
  }

  const addressLabel = shown
    ? `ilva.se/…/${shown.articleNumber || shown.id}`
    : `ilva.se · ${searchInput.trim() ? `sök: ${searchInput.trim()}` : activeCategory.label.toLowerCase()}`

  return (
    <div className="space-y-8">
      <PageHeader
        title="Produkter"
        description="Bläddra bland riktiga ILVA-produkter och visa dem interaktivt för kunden — allt i ett fönster."
      />

      <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-[2.5rem] border border-white/50 bg-white/80 shadow-2xl backdrop-blur-2xl">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 border-b border-border bg-background/60 px-5 py-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-foreground/10" />
            <span className="h-3 w-3 rounded-full bg-foreground/10" />
            <span className="h-3 w-3 rounded-full bg-foreground/10" />
          </div>
          {shown && (
            <button
              onClick={() => setShown(null)}
              className="flex items-center gap-1 rounded-lg p-1.5 text-muted transition hover:bg-foreground/5 hover:text-foreground"
              aria-label="Tillbaka till katalogen"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
            </button>
          )}
          <div className="mx-2 flex flex-1 items-center gap-2 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs text-muted">
            <Monitor className="h-3 w-3 shrink-0" strokeWidth={1.5} />
            <span className="truncate">{addressLabel}</span>
          </div>
          {!shown && (
            <button
              onClick={() => setRefreshKey((k) => k + 1)}
              className="flex items-center gap-1 rounded-lg p-1.5 text-muted transition hover:bg-foreground/5 hover:text-foreground"
              aria-label="Uppdatera"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} strokeWidth={1.5} />
            </button>
          )}
        </div>

        {!shown ? (
          <div className="p-5 md:p-8">
            {/* Search + categories toolbar */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" strokeWidth={1.5} />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Sök produkt, artikelnummer eller kategori…"
                className="w-full rounded-2xl border border-border bg-background py-3 pl-11 pr-10 text-sm text-foreground outline-none transition focus:border-foreground/30"
                autoComplete="off"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted transition hover:bg-foreground/5 hover:text-foreground"
                  aria-label="Rensa sökning"
                >
                  <X className="h-4 w-4" strokeWidth={1.5} />
                </button>
              )}
            </div>

            {!searchInput.trim() && (
              <div className="mt-4 flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c.label}
                    onClick={() => setActiveCategory(c)}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                      activeCategory.label === c.label
                        ? 'bg-foreground text-surface'
                        : 'bg-foreground/5 text-muted hover:bg-foreground/10 hover:text-foreground'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            )}

            {/* Catalog grid */}
            <div className="mt-6">
              {loading ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="overflow-hidden rounded-2xl bg-background/60">
                      <div className="aspect-[4/3] animate-pulse bg-foreground/5" />
                      <div className="space-y-2 p-3">
                        <div className="h-3 w-16 animate-pulse rounded bg-foreground/5" />
                        <div className="h-3 w-full animate-pulse rounded bg-foreground/5" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="rounded-2xl border border-amber-200/50 bg-amber-50/60 p-4 text-sm text-amber-800">
                  {error}
                </div>
              ) : products.length === 0 ? (
                <p className="py-10 text-center text-sm text-muted">Inga träffar för "{activeQuery}".</p>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {products.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => selectProduct(p)}
                      className="group flex flex-col overflow-hidden rounded-2xl bg-background/60 text-left transition hover:-translate-y-0.5 hover:shadow-soft"
                    >
                      <ProductImage product={p} className="w-full" aspect="4/3" />
                      <div className="p-3">
                        <p className="truncate text-[10px] font-medium uppercase tracking-wider text-muted">
                          {p.brand || p.category}
                        </p>
                        <h3 className="mt-0.5 line-clamp-2 text-xs font-semibold leading-snug text-foreground">
                          {p.name}
                        </h3>
                        <p className="mt-1.5 text-sm font-light text-foreground">{formatPrice(p.ordinaryPrice)}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 md:p-10">
            <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl bg-white p-4 md:max-w-md">
              <ProductImage product={shown} className="w-full" aspect="4/3" objectFit="contain" />
              {shown.image && (
                <a
                  href={shown.url}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute right-5 top-5 rounded-full bg-foreground/70 p-2 text-surface backdrop-blur-sm transition hover:bg-foreground"
                  aria-label="Visa på ilva.se"
                >
                  <Sofa className="h-4 w-4" strokeWidth={1.5} />
                </a>
              )}
            </div>

            <div className="mx-auto mt-8 max-w-lg">
              <p className="text-xs font-medium uppercase tracking-wider text-muted">
                {shown.brand || shown.category}
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-foreground">{shown.name}</h2>
              <p className="mt-2 text-muted">{shown.description}</p>
              <p className="mt-4 text-3xl font-light text-foreground">{formatPrice(shown.ordinaryPrice)}</p>

              {shown.series && (
                <p className="mt-1 text-sm text-muted">{shown.series}</p>
              )}

              {(variantsLoading || variants.length > 0) && (
                <div className="mt-6">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted">
                    Andra färger/tyger av denna modell
                  </p>
                  {variantsLoading ? (
                    <div className="mt-3 flex items-center gap-2 text-sm text-muted">
                      <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
                      Hämtar varianter…
                    </div>
                  ) : (
                    <div className="mt-3 flex flex-wrap gap-3">
                      {variants.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => selectProduct(v)}
                          title={v.series || v.name}
                          className={`group relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                            v.id === shown.id ? 'border-foreground' : 'border-transparent hover:border-border'
                          }`}
                        >
                          <ProductImage product={v} className="h-full w-full" aspect="1/1" />
                          {v.id === shown.id && (
                            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-surface">
                              <Check className="h-2.5 w-2.5" strokeWidth={3} />
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setShare(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-foreground/5"
                >
                  <Share2 className="h-4 w-4" strokeWidth={1.5} /> Dela med kund
                </button>
                {share && <CopyButton text={shareText} label="Kopiera text" />}
                <a
                  href={shown.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-foreground/5"
                >
                  <ExternalLink className="h-4 w-4" strokeWidth={1.5} />
                  Se på ilva.se
                </a>
                <button
                  onClick={() => setShown(null)}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-muted transition hover:bg-foreground/5 hover:text-foreground"
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
                  Till katalogen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Säljguider</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {productRules.map((p) => (
            <Link key={p.id} to={`/products#${p.id}`} className="surface block p-6 transition hover:-translate-y-0.5 hover:shadow-soft">
              <Badge>{p.category}</Badge>
              <h2 className="mt-3 text-xl font-semibold text-foreground">{p.name}</h2>
              <p className="mt-2 text-sm text-muted">{p.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
