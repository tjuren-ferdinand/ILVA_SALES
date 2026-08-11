import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Search } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { CopyButton } from '../components/ui/CopyButton'
import { Badge } from '../components/ui/Badge'
import { deliveryOptions } from '../data/mockData'
import type { DeliveryOption } from '../types'

function parsePostcode(input: string) {
  const digits = input.replace(/\D/g, '')
  return digits.length === 5 ? Number(digits) : null
}

function matchesPostcode(option: DeliveryOption, code: number | null) {
  if (option.id === 'hämtning-030' || option.id === 'montering' || option.id === 'bortforsling') return true
  if (!code || !option.postalRanges || option.postalRanges.length === 0) return false
  return option.postalRanges.some(([from, to]) => code >= from && code <= to)
}

export function Delivery() {
  const [postcode, setPostcode] = useState('')
  const postalCode = useMemo(() => parsePostcode(postcode), [postcode])

  const matches = useMemo(() => {
    return deliveryOptions.filter((d) => matchesPostcode(d, postalCode))
  }, [postalCode])

  const primary = useMemo(() => {
    if (postalCode == null) return null
    return matches.find((d) => d.postalRanges && d.postalRanges.length > 0) ?? null
  }, [matches, postalCode])

  return (
    <div className="space-y-10">
      <PageHeader
        title="Leverans"
        description="Hitta rätt leveranskod, pris och villkor på några sekunder."
      />

      <section className="surface p-6 md:p-8">
        <h2 className="mb-6 text-xl font-semibold text-foreground">Sök med postnummer</h2>
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" strokeWidth={1.5} />
          <input
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            placeholder="t.ex. 211 15"
            className="w-full rounded-2xl border border-border bg-background py-4 pl-12 pr-5 text-lg text-foreground outline-none transition focus:border-foreground/30"
          />
        </div>

        {postalCode == null ? (
          <p className="mt-4 text-sm text-muted">Ange kundens postnummer för att se tillgängliga leveranssätt.</p>
        ) : primary ? (
          <div className="mt-6 rounded-2xl border border-border bg-background p-6">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted" strokeWidth={1.5} />
              <p className="text-sm font-medium uppercase tracking-wide text-muted">Rekommenderat för {postcode}</p>
            </div>
            <h3 className="mt-2 text-2xl font-semibold text-foreground">{primary.name}</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">Kod</p>
                <p className="mt-1 font-mono text-lg text-foreground">{primary.code}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">Pris</p>
                <p className="mt-1 text-lg text-foreground">{primary.priceDisplay}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">Tid</p>
                <p className="mt-1 text-lg text-foreground">{primary.deliveryTime}</p>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <CopyButton text={primary.code} />
              <Link
                to={`/delivery/${primary.id}`}
                className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
              >
                Läs mer →
              </Link>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">Inget matchande hemleveransalternativ. Erbjud hämtning i butik eller kontakta logistik.</p>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Alla leveransalternativ</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {deliveryOptions.map((d) => (
            <Link
              key={d.id}
              to={`/delivery/${d.id}`}
              className="group surface flex flex-col gap-4 p-6 transition hover:-translate-y-0.5 hover:shadow-soft"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge>Leverans</Badge>
                  <h3 className="mt-2 text-lg font-semibold text-foreground">{d.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted">{d.description}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted transition group-hover:translate-x-0.5" />
              </div>
              <div className="mt-auto flex flex-wrap items-center gap-2 text-sm">
                <span className="rounded-xl bg-background px-3 py-1.5 font-mono text-foreground shadow-card">{d.code}</span>
                <span className="rounded-xl bg-background px-3 py-1.5 text-foreground shadow-card">{d.priceDisplay}</span>
                <span className="rounded-xl bg-background px-3 py-1.5 text-muted shadow-card">{d.deliveryTime}</span>
              </div>
              <p className="text-xs text-muted">{d.coverage}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
