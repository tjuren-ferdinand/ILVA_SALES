import { useState } from 'react'
import { PageHeader } from '../components/ui/PageHeader'
import { Monitor, Search, X, ExternalLink } from 'lucide-react'

const categories = [
  { label: 'Soffor', path: '/vardagsrum/soffor' },
  { label: 'Sängar', path: '/sovrum/sangar' },
  { label: 'Matbord', path: '/matrum/matbord' },
  { label: 'Stolar', path: '/matrum/stolar' },
  { label: 'Förvaring', path: '/forvaring' },
  { label: 'Belysning', path: '/belysning' },
  { label: 'Mattor', path: '/mattor' },
  { label: 'Dekoration', path: '/dekoration' },
]

const ILVA_BASE = 'https://ilva.se'

export function Showcase() {
  const [path, setPath] = useState('/')
  const [searchInput, setSearchInput] = useState('')
  const [activeLabel, setActiveLabel] = useState('Start')
  const src = `${ILVA_BASE}${path}`

  const setCategory = (c: (typeof categories)[number]) => {
    setPath(c.path)
    setActiveLabel(c.label)
    setSearchInput('')
  }

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchInput.trim()
    if (q) {
      setPath(`/search?q=${encodeURIComponent(q)}`)
      setActiveLabel(`Sök: ${q}`)
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Produkter"
        description="Surfa ilva.se direkt i appen för att visa kunden produkter, inspiration och sortimentet."
      />

      <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-[2.5rem] border border-white/50 bg-white/80 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center gap-2 border-b border-border bg-background/60 px-5 py-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-foreground/10" />
            <span className="h-3 w-3 rounded-full bg-foreground/10" />
            <span className="h-3 w-3 rounded-full bg-foreground/10" />
          </div>
          <div className="mx-2 flex flex-1 items-center gap-2 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs text-muted">
            <Monitor className="h-3 w-3 shrink-0" strokeWidth={1.5} />
            <span className="truncate">ilva.se{path === '/' ? '' : path}</span>
          </div>
          <a
            href={src}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 rounded-lg p-1.5 text-muted transition hover:bg-foreground/5 hover:text-foreground"
            aria-label="Öppna ilva.se i ny flik"
          >
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} />
          </a>
        </div>

        <form onSubmit={submitSearch} className="relative p-4 pb-0">
          <Search
            className="pointer-events-none absolute left-8 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            strokeWidth={1.5}
          />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Sök på ilva.se och tryck Enter…"
            className="w-full rounded-2xl border border-border bg-background py-3 pl-11 pr-10 text-sm text-foreground outline-none transition focus:border-foreground/30"
            autoComplete="off"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput('')}
              className="absolute right-7 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted transition hover:bg-foreground/5 hover:text-foreground"
              aria-label="Rensa sökning"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
          )}
        </form>

        <div className="mt-4 flex flex-wrap gap-2 px-5 pb-5">
          <button
            onClick={() => {
              setPath('/')
              setActiveLabel('Start')
              setSearchInput('')
            }}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              activeLabel === 'Start'
                ? 'bg-foreground text-surface'
                : 'bg-foreground/5 text-muted hover:bg-foreground/10 hover:text-foreground'
            }`}
          >
            Start
          </button>
          {categories.map((c) => (
            <button
              key={c.label}
              onClick={() => setCategory(c)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                activeLabel === c.label
                  ? 'bg-foreground text-surface'
                  : 'bg-foreground/5 text-muted hover:bg-foreground/10 hover:text-foreground'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="relative w-full bg-white" style={{ height: '70vh', minHeight: 520 }}>
          <iframe
            src={src}
            title="ILVA webshop"
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            loading="eager"
          />
        </div>
      </div>
    </div>
  )
}
