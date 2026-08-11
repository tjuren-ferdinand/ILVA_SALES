import { Calendar, Store, User } from 'lucide-react'
import type { OfferQuote } from '../types'

export function QuoteMetadata({ quote }: { quote: OfferQuote }) {
  const created = new Date(quote.createdAt)
  const validUntil = new Date(created)
  validUntil.setDate(created.getDate() + quote.validDays)

  return (
    <div className="surface p-5 md:p-6">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">Offertnummer</p>
        <p className="text-xl font-semibold text-foreground">{quote.quoteNumber}</p>
      </div>
      <div className="mt-4 grid gap-3 text-sm">
        <div className="flex items-center gap-2 text-muted">
          <Calendar className="h-4 w-4" strokeWidth={1.5} />
          <span>Giltig t.o.m. {validUntil.toLocaleDateString('sv-SE')}</span>
        </div>
        <div className="flex items-center gap-2 text-muted">
          <Store className="h-4 w-4" strokeWidth={1.5} />
          <span>{quote.store.name}</span>
        </div>
        <div className="flex items-center gap-2 text-muted">
          <User className="h-4 w-4" strokeWidth={1.5} />
          <span>{quote.salesperson.name}</span>
        </div>
      </div>
    </div>
  )
}
