import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Search as SearchIcon } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { CopyButton } from '../components/ui/CopyButton'
import { Badge } from '../components/ui/Badge'
import { codes } from '../data/mockData'

export function Codes() {
  const [filter, setFilter] = useState('')
  const filtered = codes.filter(
    (c) =>
      c.name.toLowerCase().includes(filter.toLowerCase()) ||
      c.code.toLowerCase().includes(filter.toLowerCase()) ||
      c.category.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Koder"
        description="Sökbar demo-kodbibliotek för snabb åtkomst."
      />

      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" strokeWidth={1.5} />
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Sök kod, namn eller kategori…"
          className="w-full rounded-2xl border border-border bg-surface py-3 pl-11 pr-4 text-foreground placeholder:text-muted outline-none focus:border-foreground/30 focus:shadow-soft"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="surface flex flex-col gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-soft md:flex-row md:items-center md:justify-between"
          >
            <Link to={`/codes/${c.id}`} className="flex-1">
              <div className="flex items-center gap-2">
                <Badge>{c.category}</Badge>
                <span className="font-mono text-xs text-muted">{c.code}</span>
              </div>
              <h3 className="mt-2 text-lg font-semibold text-foreground">{c.name}</h3>
              <p className="text-sm text-muted">{c.description}</p>
            </Link>
            <div className="flex items-center gap-3">
              <CopyButton text={c.code} />
              <Link
                to={`/codes/${c.id}`}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-foreground transition hover:shadow-card"
                aria-label="Visa detaljer"
              >
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
