import { Link } from 'react-router-dom'
import { PageHeader } from '../components/ui/PageHeader'
import { productRules } from '../data/mockData'
import { Badge } from '../components/ui/Badge'
import { ExternalLink } from 'lucide-react'

type IlvaProduct = {
  id: string
  name: string
  brand: string
  price: string
  url: string
}

const ilvaProducts: IlvaProduct[] = [
  { id: 'ilva-1', name: 'MYK Bäddsoffa 160 x 200 cm', brand: 'Innovation Living', price: '8 999 kr', url: 'https://ilva.se/vardagsrum/soffor/baddsoffor/innovation-living-myk/wave-70-sand-tyg/p-1070799-5642717711/' },
  { id: 'ilva-2', name: 'Osvald de luxe Bäddsoffa 150 x 200 cm', brand: 'Innovation Living', price: '15 999 kr', url: 'https://ilva.se/vardagsrum/soffor/baddsoffor/innovation-living-osvald-de-luxe/austin-3-antelope-tyg/p-1058126-5643382436/' },
  { id: 'ilva-3', name: 'Havanna Bäddsoffa 115 x 210 cm', brand: 'Innovation Living', price: '12 999 kr', url: 'https://ilva.se/vardagsrum/soffor/baddsoffor/innovation-living-havanna/p-b0085366-5637811326/' },
  { id: 'ilva-4', name: 'Recast Plus Bäddsoffa 140 x 200 cm', brand: 'Innovation Living', price: '10 999 kr', url: 'https://ilva.se/vardagsrum/soffor/baddsoffor/innovation-living-recast-plus/austin-3-antelope-tyg/p-1034779-5643338939/' },
]

const categories = [
  { label: 'Soffor', url: 'https://ilva.se/vardagsrum/soffor/' },
  { label: 'Bäddsoffor', url: 'https://ilva.se/vardagsrum/soffor/baddsoffor/' },
  { label: 'Sängar', url: 'https://ilva.se/sangar/' },
  { label: 'Matrum', url: 'https://ilva.se/matrum/' },
  { label: 'Förvaring', url: 'https://ilva.se/forvaring/c-917/' },
]

export function Products() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Produkter"
        description="Säljguider, produktregler och direktlänkar till ilva.se."
      />

      <div className="surface p-6">
        <h2 className="text-lg font-semibold text-foreground">ILVA online</h2>
        <p className="mt-1 text-sm text-muted">Hoppa direkt till ilva.se för aktuella priser, lager och bilder.</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <a
            href="https://ilva.se/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/40 bg-foreground px-5 py-2.5 text-sm font-medium text-surface transition hover:bg-foreground/90"
          >
            Öppna ilva.se
            <ExternalLink className="h-4 w-4" strokeWidth={1.5} />
          </a>
          {categories.map((c) => (
            <a
              key={c.label}
              href={c.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/30 bg-white/30 px-3 py-1.5 text-sm text-foreground backdrop-blur-xl transition hover:bg-white/50"
            >
              {c.label}
              <ExternalLink className="h-3 w-3 text-muted" strokeWidth={1.5} />
            </a>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Utvalda ILVA-produkter</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ilvaProducts.map((p) => (
            <a
              key={p.id}
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="group surface flex flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-soft"
            >
              <div className="text-xs font-medium uppercase tracking-wide text-muted">{p.brand}</div>
              <h3 className="mt-2 text-base font-semibold leading-snug text-foreground">{p.name}</h3>
              <p className="mt-3 text-lg font-light text-foreground">{p.price}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition group-hover:text-foreground">
                Öppna på ilva.se
                <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} />
              </span>
            </a>
          ))}
        </div>
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
