import { Truck, FileCode, Percent, Sofa, ArrowRight, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CategoryCard } from '../components/ui/CategoryCard'
import { QuickItem } from '../components/ui/QuickItem'
import { UpdateCard } from '../components/ui/UpdateCard'
import { formatGreeting } from '../lib/utils'
import { updates } from '../data/mockData'

const favorites = [
  { to: '/delivery', icon: Truck, title: 'Leverans', description: 'Fraktalternativ och priser' },
  { to: '/discounts', icon: Percent, title: 'Rabatter', description: 'Gränser och maxrabatter' },
  { to: '/codes', icon: FileCode, title: 'Koder', description: 'Sökbara leveranskoder' },
  { to: '/products', icon: Sofa, title: 'Produkter', description: 'Produktregler och tips' },
]

const quickItems = [
  { to: '/codes', title: 'Vanliga leveranskoder', description: 'Mest använda just nu' },
  { to: '/discounts', title: 'Maxrabatter', description: 'Aktuella gränser' },
  { to: '/delivery', title: 'Leveransalternativ', description: 'Jämför och välj' },
  { to: '/returns', title: 'Reklamationsguide', description: 'Vanliga situationer' },
]

export function Home() {
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
