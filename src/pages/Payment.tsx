import { PageHeader } from '../components/ui/PageHeader'
import { CreditCard, Wallet, Receipt } from 'lucide-react'

const methods = [
  {
    icon: CreditCard,
    title: 'Kortbetalning',
    description: 'Demo: Kortbetalning i kassan med vanliga kort.',
    notes: ['Kontaktlöst', 'Chip', 'Alla vanliga kort'],
  },
  {
    icon: Wallet,
    title: 'Delbetalning',
    description: 'Demo: Delbetalning erbjuds via extern partner.',
    notes: ['Kreditprövning kan krävas', 'Informera kunden om villkor'],
  },
  {
    icon: Receipt,
    title: 'Faktura',
    description: 'Demo: Faktura för företag och utvalda privatkunder.',
    notes: ['Godkänns av butikschef', 'Betalningsvillkor 30 dagar'],
  },
]

export function Payment() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Betalning"
        description="Demo-information om betalningsalternativ."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {methods.map((m) => (
          <div key={m.title} className="surface p-6 transition hover:-translate-y-0.5 hover:shadow-soft">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-background text-foreground">
              <m.icon className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-foreground">{m.title}</h2>
            <p className="mt-2 text-sm text-muted">{m.description}</p>
            <ul className="mt-4 space-y-1">
              {m.notes.map((n) => (
                <li key={n} className="flex items-center gap-2 text-sm text-foreground">
                  <span className="h-1 w-1 rounded-full bg-foreground/40" />
                  {n}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
