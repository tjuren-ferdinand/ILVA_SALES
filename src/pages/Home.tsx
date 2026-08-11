import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ArrowRight, TrendingUp } from 'lucide-react'
import { FunctionCard } from '../components/ui/FunctionCard'
import { QuickItem } from '../components/ui/QuickItem'
import { UpdateCard } from '../components/ui/UpdateCard'
import { formatGreeting } from '../lib/utils'
import { topNav } from '../data/navItems'
import { updates } from '../data/mockData'

const quickItems = [
  { to: '/codes', title: 'Vanliga leveranskoder', description: 'Mest använda just nu' },
  { to: '/discounts', title: 'Maxrabatter', description: 'Aktuella gränser' },
  { to: '/delivery', title: 'Leverans per postnummer', description: 'Se alternativ direkt' },
  { to: '/returns', title: 'Reklamationsguide', description: 'Vanliga situationer' },
]

const functionDescriptions: Record<string, string> = {
  Offert: 'Skapa & skicka',
  Sök: 'Snabbsök allt',
  Leverans: 'Frakt & tider',
  Koder: 'Sökbara koder',
  Rabatter: 'Maxgränser',
  Beställningar: 'Orderflöden',
  Produkter: 'Regler & tips',
  'Retur & reklamation': 'Reklamera & retur',
  Betalning: 'Betalningsalternativ',
  System: 'Kassor & uppdateringar',
  Kontakter: 'Viktiga nummer',
  Uppdateringar: 'Senaste nytt',
  'Visa kund': 'Kundpresentation',
  Team: 'Team & konton',
}

export function Home() {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const doSearch = () => {
    const q = search.trim()
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  const functions = topNav.filter((item) => item.path !== '/')

  return (
    <div className="space-y-6 md:space-y-8">
      <section className="space-y-3">
        <div className="mb-1 text-xs font-medium uppercase tracking-wide text-muted">ILVA Halmstad</div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {formatGreeting()}
        </h1>
        <p className="text-sm text-muted">Allt du behöver för en smidigare försäljning.</p>

        <div className="relative mt-4">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" strokeWidth={1.5} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && doSearch()}
            placeholder="Vad letar du efter?"
            className="w-full rounded-2xl border border-white/40 bg-white/40 py-3 pl-11 pr-14 text-sm text-foreground outline-none backdrop-blur-xl placeholder:text-muted transition focus:border-white/60 focus:bg-white/60"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={doSearch}
            disabled={!search.trim()}
            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-foreground text-surface transition hover:bg-foreground/90 disabled:opacity-40"
            aria-label="Sök"
          >
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted">
          <TrendingUp className="h-3.5 w-3.5" strokeWidth={1.5} />
          Huvudfunktioner
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {functions.map((item) => (
            <FunctionCard
              key={item.path}
              to={item.path}
              icon={item.icon}
              title={item.label}
              description={functionDescriptions[item.label] ?? ''}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-wide text-muted">Snabbt åtkomst</h2>
          <div className="space-y-2">
            {quickItems.map((item) => (
              <QuickItem key={item.to} {...item} />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-xs font-medium uppercase tracking-wide text-muted">Senaste uppdateringar</h2>
          <div className="space-y-2">
            {updates.slice(0, 3).map((update) => (
              <UpdateCard key={update.id} update={update} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
