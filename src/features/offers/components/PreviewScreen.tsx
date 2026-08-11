import { X, Printer } from 'lucide-react'
import { QuotePreview } from './QuotePreview'
import type { OfferQuote, QuoteTotals } from '../types'

export function PreviewScreen({
  quote,
  totals,
  onClose,
  onPrint,
}: {
  quote: OfferQuote
  totals: QuoteTotals
  onClose: () => void
  onPrint: () => void
}) {
  return (
    <div className="surface p-5 md:p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Förhandsvisa offert</h2>
          <p className="text-sm text-muted">Så här ser offerten ut för kunden.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onPrint}
            className="inline-flex items-center gap-2 rounded-2xl bg-foreground px-4 py-2.5 text-sm font-medium text-surface transition hover:bg-foreground/90"
          >
            <Printer className="h-4 w-4" strokeWidth={1.5} />
            Skriv ut / PDF
          </button>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/40 bg-white/40 px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-white/60"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
            Stäng
          </button>
        </div>
      </div>
      <QuotePreview quote={quote} totals={totals} />
    </div>
  )
}
