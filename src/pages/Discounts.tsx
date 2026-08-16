import { useMemo, useState } from 'react'
import { PageHeader } from '../components/ui/PageHeader'
import { Badge } from '../components/ui/Badge'
import { discounts } from '../data/mockData'
import { Search, ShieldAlert, AlertTriangle } from 'lucide-react'

const sectionNames: Record<string, string> = {
  rule: 'Regler',
  category: 'Kategorier',
  series: 'Serier',
  bed: 'Sängar',
}

const tabs = ['all', 'rule', 'category', 'series', 'bed'] as const

function extractPercent(value: string) {
  const match = value.match(/(\d+)/)
  return match ? Number(match[1]) : null
}

export function Discounts() {
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<(typeof tabs)[number]>('all')

  const filtered = useMemo(() => {
    return discounts.filter((d) => {
      const matchesTab = tab === 'all' || d.section === tab
      const q = query.toLowerCase()
      const matchesQuery =
        d.name.toLowerCase().includes(q) ||
        d.value.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.keywords.some((k) => k.toLowerCase().includes(q))
      return matchesTab && matchesQuery
    })
  }, [query, tab])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Max rabatt"
        description="Internt översikt över maxrabatt. Visas inte för kund."
      />

      <div className="surface flex items-start gap-4 border-l-4 border-l-amber-400 p-5">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" strokeWidth={1.5} />
        <p className="text-sm leading-relaxed text-foreground">
          Denna sida är endast för säljare. Kunden ska inte se maxrabatten. Använd den för att snabbt se hur mycket du kan gå ner.
        </p>
      </div>

      <div className="surface p-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" strokeWidth={1.5} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Sök kategori, serie eller produkt..."
            className="w-full rounded-2xl border border-border bg-background py-3 pl-12 pr-4 text-foreground outline-none transition focus:border-foreground/30"
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                tab === t
                  ? 'bg-foreground text-surface shadow-card'
                  : 'bg-background text-muted hover:text-foreground'
              }`}
            >
              {t === 'all' ? 'Alla' : sectionNames[t]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((d) => {
          const percent = extractPercent(d.value)
          const isZero = d.value === '0 %' || d.value === 'Använd översikt'
          const isHigh = percent != null && percent >= 40
          return (
            <div
              key={d.id}
              className={`surface p-6 transition hover:-translate-y-0.5 hover:shadow-soft ${
                isZero ? 'border-amber-400/60 bg-amber-50/[0.03]' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge>{sectionNames[d.section]}</Badge>
                  <h3 className="mt-2 text-lg font-semibold text-foreground">{d.name}</h3>
                </div>
                {isHigh && <span className="rounded-full bg-foreground/10 px-2 py-1 text-xs font-medium text-foreground">Hög rabatt</span>}
              </div>
              <p className={`mt-3 text-3xl font-light ${isZero ? 'text-amber-600' : 'text-foreground'}`}>
                {d.value}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{d.description}</p>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="surface p-8 text-center">
          <AlertTriangle className="mx-auto h-8 w-8 text-muted" strokeWidth={1.5} />
          <p className="mt-3 text-foreground">Ingen träff</p>
          <p className="text-sm text-muted">Generell regel ger 25 % om varan inte finns med här.</p>
        </div>
      )}
    </div>
  )
}
