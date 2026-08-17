import { Link } from 'react-router-dom'
import { AlertCircle, Info, NotebookPen, Package, Users, Sofa, BarChart3 } from 'lucide-react'
import { QuickCard } from '../components/ui/QuickCard'
import { ToolCard } from '../components/ui/ToolCard'
import { ProductCredit } from '../components/Branding/ProductCredit'
import { Badge } from '../components/ui/Badge'
import { updates } from '../data/mockData'
import { externalTools } from '../data/externalTools'
import { ProfileHero } from '../components/Profile/ProfileHero'
import type { UpdateItem } from '../types'

const quickLinks = [
  { to: '/orders', icon: Package, title: 'Ordrar', description: 'Hantera och hitta ordrar' },
  { to: '/customers', icon: Users, title: 'Kunder', description: 'Kundrelaterade uppgifter' },
  { to: '/products', icon: Sofa, title: 'Produkter', description: 'Produktinformation och sök' },
  { to: 'https://timesalg.ilva.net/rpt_salg_daglig_time_SEK.htm', icon: BarChart3, title: 'Rapporter', description: 'Försäljningsstatistik', external: true },
]

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
  return (
    <div className="space-y-8">
      <section className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Välkommen</h1>
        <p className="text-sm text-muted">Här är din översikt och dina viktigaste verktyg.</p>
      </section>

      <ProfileHero variant="compact" />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {quickLinks.map((item) => (
          <QuickCard key={item.title} {...item} />
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="surface p-5">
          <h2 className="mb-4 text-xs font-medium uppercase tracking-wide text-muted">Verktyg</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {externalTools.map((tool) => (
              <ToolCard key={tool.title} {...tool} />
            ))}
          </div>
        </div>

        <div className="surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xs font-medium uppercase tracking-wide text-muted">Senaste uppdateringar</h2>
            <Link to="/notes" className="flex items-center gap-1.5 text-xs font-medium text-muted transition hover:text-foreground">
              <NotebookPen className="h-3.5 w-3.5" strokeWidth={1.5} />
              Anteckningar
            </Link>
          </div>
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
