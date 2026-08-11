import { useParams } from 'react-router-dom'
import { deliveryOptions } from '../data/mockData'
import { PageHeader } from '../components/ui/PageHeader'
import { CopyButton } from '../components/ui/CopyButton'
import { FavoriteButton } from '../components/ui/FavoriteButton'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'

export function DeliveryDetail() {
  const { id } = useParams<{ id: string }>()
  const option = deliveryOptions.find((d) => d.id === id)

  if (!option) {
    return <EmptyState title="Hittades inte" description="Detta leveransalternativ finns inte." />
  }

  return (
    <div>
      <PageHeader title={option.name} description={option.description} backTo="/delivery" />

      <div className="surface p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge>Leverans</Badge>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{option.name}</h1>
            <p className="mt-2 max-w-2xl text-muted">{option.description}</p>
          </div>
          <FavoriteButton itemKey={`delivery:${option.id}`} />
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <InfoBox label="Kod" value={option.code} />
          <InfoBox label="Pris" value={option.priceDisplay} />
          <InfoBox label="Leveranstid" value={option.deliveryTime} />
        </div>

        <div className="mt-8 flex items-center gap-3">
          <CopyButton text={option.code} />
          <span className="text-xs text-muted">Kopiera koden och slå in i kassan.</span>
        </div>

        {option.situations.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-foreground">Passar för</h2>
            <ul className="mt-3 space-y-2">
              {option.situations.map((s) => (
                <li key={s} className="flex items-center gap-2 text-sm text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground/30" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {option.notes.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-foreground">Viktigt</h2>
            <ul className="mt-3 space-y-2">
              {option.notes.map((n) => (
                <li key={n} className="flex items-center gap-2 text-sm text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground/30" />
                  {n}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-border bg-background p-5">
          <h2 className="text-lg font-semibold text-foreground">Täckning</h2>
          <p className="mt-2 text-sm text-muted">{option.coverage}</p>
          <p className="mt-2 text-sm text-muted">{option.cities.join(', ')}</p>
        </div>

        {option.restrictions && (
          <div className="mt-8 rounded-2xl border border-border bg-background p-5">
            <h2 className="text-lg font-semibold text-foreground">Restriktioner</h2>
            <p className="mt-2 text-sm text-muted">{option.restrictions}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-xl font-semibold text-foreground">{value}</p>
    </div>
  )
}
