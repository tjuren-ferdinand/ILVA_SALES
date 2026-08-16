import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Search, X, ChevronRight, AlertCircle, Info } from 'lucide-react'
import { FunctionCard } from '../components/ui/FunctionCard'
import { ProductCredit } from '../components/Branding/ProductCredit'
import { Badge } from '../components/ui/Badge'
import { topNav } from '../data/navItems'
import { updates } from '../data/mockData'
import { ProfileHero } from '../components/Profile/ProfileHero'
import type { UpdateItem } from '../types'

const mainPaths = ['/offert', '/delivery', '/discounts', '/returns']

const quickItems = [
  { to: '/products', title: 'Sök ILVA-produkter', description: 'Riktig produktsökning för kunden' },
  { to: '/discounts', title: 'Maxrabatter', description: 'Aktuella gränser' },
  { to: '/delivery', title: 'Leverans per postnummer', description: 'Ange kundens postnummer' },
  { to: '/returns', title: 'Returguide', description: 'Retur, reklamation & öppet köp' },
]

const functionDescriptions: Record<string, string> = {
  Offert: 'Skapa & skicka till kund',
  Leverans: 'Alternativ & priser',
  Rabatter: 'Max rabatt per kategori',
  Returer: 'Retur, reklamation & öppet köp',
}

function QuickRow({ to, title, description }: { to: string; title: string; description: string }) {
  return (
    <Link
      to={to}
      className="group flex items-center justify-between border-b border-border/40 py-3 text-foreground transition last:border-0 hover:text-foreground/80"
    >
      <div className="min-w-0">
        <h4 className="truncate text-sm font-semibold">{title}</h4>
        <p className="truncate text-xs text-muted">{description}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted transition group-hover:translate-x-0.5" strokeWidth={1.5} />
    </Link>
  )
}

function UpdateRow({ update }: { update: UpdateItem }) {
  return (
    <div className="flex items-start gap-3 border-b border-border/40 py-3 last:border-0">
      <div className="mt-0.5 text-muted">
        {update.importance === 'high' ? (
          <AlertCircle className="h-4 w-4" strokeWidth={1.5} />
        ) : (
          <Info className="h-4 w-4" strokeWidth={1.5} />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Badge>{update.category}</Badge>
          <span className="text-[10px] text-muted">{update.date}</span>
        </div>
        <h3 className="mt-1 text-sm font-semibold text-foreground">{update.title}</h3>
        <p className="line-clamp-2 text-xs text-muted">{update.description}</p>
      </div>
    </div>
  )
}

export function Home() {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const doSearch = () => {
    const q = search.trim()
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  const functions = topNav
    .filter((item) => mainPaths.includes(item.path))
    .sort((a, b) => mainPaths.indexOf(a.path) - mainPaths.indexOf(b.path))

  return (
    <div className="space-y-5 md:space-y-6">
      <section className="space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" strokeWidth={1.5} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && doSearch()}
            placeholder="Vad letar du efter?"
            className="w-full rounded-2xl border border-white/40 bg-white/40 py-3 pl-11 pr-10 text-sm text-foreground outline-none backdrop-blur-xl placeholder:text-muted transition focus:border-white/60 focus:bg-white/60"
            autoComplete="off"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted transition hover:bg-white/40 hover:text-foreground"
              aria-label="Rensa"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
          )}
        </div>

        <ProfileHero variant="compact" />
      </section>

      <section>
        <div className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">Huvudfunktioner</div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {functions.map((item) => (
            <FunctionCard
              key={item.path}
              to={item.path}
              icon={item.icon}
              title={item.label}
              description={functionDescriptions[item.label] || undefined}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="surface p-5">
          <h2 className="mb-4 text-xs font-medium uppercase tracking-wide text-muted">Snabbt åtkomst</h2>
          <div>
            {quickItems.map((item) => (
              <QuickRow key={item.to} {...item} />
            ))}
          </div>
        </div>

        <div className="surface p-5">
          <h2 className="mb-4 text-xs font-medium uppercase tracking-wide text-muted">Senaste uppdateringar</h2>
          <div>
            {updates.slice(0, 3).map((update) => (
              <UpdateRow key={update.id} update={update} />
            ))}
          </div>
        </div>
      </section>

      <ProductCredit className="mx-auto" />
    </div>
  )
}
