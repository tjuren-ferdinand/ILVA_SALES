import { useMemo, useState } from 'react'
import { Truck, FileCode, Percent, Sofa, ArrowRight, Search, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CategoryCard } from '../components/ui/CategoryCard'
import { QuickItem } from '../components/ui/QuickItem'
import { UpdateCard } from '../components/ui/UpdateCard'
import { PinGuard } from '../components/PinGuard'
import { formatGreeting } from '../lib/utils'
import { updates, deliveryOptions, discounts } from '../data/mockData'
import type { DeliveryOption } from '../types'

const favorites = [
  { to: '/delivery', icon: Truck, title: 'Leverans', description: 'Fraktalternativ och priser' },
  { to: '/discounts', icon: Percent, title: 'Rabatter', description: 'Gränser och maxrabatter' },
  { to: '/codes', icon: FileCode, title: 'Koder', description: 'Sökbara leveranskoder' },
  { to: '/products', icon: Sofa, title: 'Produkter', description: 'Produktregler och tips' },
]

const sectionLabels: Record<string, string> = {
  rule: 'Regel',
  category: 'Kategori',
  series: 'Serie',
  bed: 'Säng',
  högsta: 'Högsta',
}

const quickItems = [
  { to: '/codes', title: 'Vanliga leveranskoder', description: 'Mest använda just nu' },
  { to: '/discounts', title: 'Maxrabatter', description: 'Aktuella gränser' },
  { to: '/delivery', title: 'Leveransalternativ', description: 'Jämför och välj' },
  { to: '/returns', title: 'Reklamationsguide', description: 'Vanliga situationer' },
]

function parseDiscountPercent(value: string): number | null {
  const match = value.match(/\d+/)
  return match ? parseInt(match[0], 10) : null
}

export function Home() {
  const [postalCode, setPostalCode] = useState('')
  const [matches, setMatches] = useState<DeliveryOption[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = () => {
    setError(null)
    const normalized = postalCode.replace(/\s/g, '')
    if (!/^\d{5}$/.test(normalized)) {
      setError('Ange ett giltigt 5-siffrigt postnummer, t.ex. 30245')
      setMatches(null)
      return
    }
    const num = parseInt(normalized, 10)
    const result = deliveryOptions.filter((option) =>
      option.postalRanges?.some(([start, end]) => num >= start && num <= end)
    )
    setMatches(result)
  }

  const maxDiscount = useMemo<{ name: string; value: string; percent: number } | null>(() => {
    let best: { name: string; value: string; percent: number } | null = null
    for (const d of discounts) {
      const p = parseDiscountPercent(d.value)
      if (p !== null && p > 0 && (best === null || p > best.percent)) {
        best = { name: d.name, value: d.value, percent: p }
      }
    }
    return best
  }, [])

  const discountSummary = useMemo(() => {
    const summary: Record<string, { name: string; percent: number }> = {}
    discounts.forEach((d) => {
      const p = parseDiscountPercent(d.value)
      if (p !== null && p >= 0) {
        const key = d.section
        if (!summary[key] || p > summary[key].percent) {
          summary[key] = { name: d.name, percent: p }
        }
      }
    })
    return Object.entries(summary)
      .sort((a, b) => b[1].percent - a[1].percent)
      .slice(0, 4)
  }, [])

  return (
    <div className="space-y-8 md:space-y-10">
      <section className="flex flex-col justify-between gap-4 pt-2 md:flex-row md:items-end">
        <div>
          <div className="mb-1 text-sm font-medium uppercase tracking-wide text-muted">ILVA Halmstad</div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {formatGreeting()}
          </h1>
          <p className="mt-2 max-w-xl text-base text-muted">
            Allt du behöver för en smidigare försäljning.
          </p>
        </div>
        <Link
          to="/search"
          className="group inline-flex items-center gap-3 rounded-2xl border border-white/40 bg-white/40 px-5 py-3 text-sm font-medium text-foreground backdrop-blur-xl transition hover:bg-white/60"
        >
          <Search className="h-4 w-4" strokeWidth={1.5} />
          Sök allt
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" strokeWidth={1.5} />
        </Link>
      </section>

      <section className="surface p-6 md:p-8">
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-muted" strokeWidth={1.5} />
          <h2 className="text-lg font-semibold text-foreground">Leverans per postnummer</h2>
        </div>
        <p className="mt-1 text-sm text-muted">
          Mata in kundens postnummer och se direkt vilket leveransalternativ som gäller.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            inputMode="numeric"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="30245"
            maxLength={6}
            className="w-full rounded-2xl border border-white/40 bg-white/40 px-4 py-3 text-foreground outline-none backdrop-blur-xl placeholder:text-muted focus:border-white/60"
          />
          <button
            onClick={handleSearch}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl border border-white/40 bg-foreground px-6 py-3 text-sm font-medium text-surface transition hover:bg-foreground/90"
          >
            <Search className="h-4 w-4" strokeWidth={1.5} />
            Sök
          </button>
        </div>
        {error && (
          <p className="mt-3 text-sm text-amber-700">{error}</p>
        )}
        {matches && (
          <div className="mt-5 space-y-3">
            {matches.length === 0 ? (
              <div className="rounded-2xl border border-amber-200/50 bg-amber-50/60 p-4 text-sm text-amber-800 backdrop-blur-xl">
                Inget leveransalternativ hittades för postnumret {postalCode}.
              </div>
            ) : (
              matches.map((option) => (
                <Link
                  key={option.id}
                  to="/delivery"
                  className="group flex flex-col gap-1 rounded-2xl border border-white/40 bg-white/40 p-4 backdrop-blur-xl transition hover:bg-white/60"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">{option.name}</span>
                    <span className="text-sm font-medium text-foreground">{option.priceDisplay}</span>
                  </div>
                  <p className="text-sm text-muted">{option.description}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                    <span>Kod: {option.code}</span>
                    <span>•</span>
                    <span>{option.deliveryTime}</span>
                    <span>•</span>
                    <span>{option.coverage}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </section>

      <PinGuard title="Maxrabatter" description="Ange din 4-siffriga kod." position="bottom">
        <section className="surface p-6 md:p-8">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <Percent className="h-5 w-5 text-muted" strokeWidth={1.5} />
                <h2 className="text-lg font-semibold text-foreground">Maxrabatter</h2>
              </div>
              <p className="mt-1 text-sm text-muted">Högsta tillåtna rabatt just nu.</p>
            </div>
            <Link
              to="/discounts"
              className="group inline-flex items-center gap-2 rounded-2xl border border-white/40 bg-white/40 px-4 py-2 text-sm font-medium text-foreground backdrop-blur-xl transition hover:bg-white/60"
            >
              Se alla
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" strokeWidth={1.5} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/40 bg-white/40 p-5 text-center backdrop-blur-xl">
              <div className="text-3xl font-light text-foreground">{maxDiscount?.percent ?? 0} %</div>
              <div className="mt-1 text-sm text-muted">{maxDiscount?.name ?? '—'}</div>
              <div className="mt-1 text-xs uppercase tracking-wide text-muted">Högsta</div>
            </div>
            {discountSummary.map(([section, { name, percent }]) => (
              <div
                key={section}
                className="rounded-2xl border border-white/40 bg-white/40 p-5 text-center backdrop-blur-xl"
              >
                <div className="text-3xl font-light text-foreground">{percent} %</div>
                <div className="mt-1 text-sm text-muted truncate" title={name}>{name}</div>
                <div className="mt-1 text-xs uppercase tracking-wide text-muted">{sectionLabels[section] ?? section}</div>
              </div>
            ))}
          </div>
        </section>
      </PinGuard>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Favoriter</h2>
          <Link to="/search" className="text-sm font-medium text-muted transition hover:text-foreground">
            Visa alla
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {favorites.map((cat) => (
            <CategoryCard key={cat.to} {...cat} />
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Snabbt</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {quickItems.map((item) => (
              <QuickItem key={item.title} {...item} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-4 text-lg font-semibold text-foreground">Senaste</h2>
          <div className="space-y-3">
            {updates.slice(0, 3).map((u) => (
              <UpdateCard key={u.id} update={u} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
