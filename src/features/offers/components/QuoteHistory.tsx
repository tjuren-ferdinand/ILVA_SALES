import { X, Trash2, FileText } from 'lucide-react'
import { calculateQuoteTotals } from '../lib/calculations'
import type { OfferQuote } from '../types'

export function QuoteHistory({
  history,
  onLoad,
  onDelete,
  onClose,
}: {
  history: OfferQuote[]
  onLoad: (q: OfferQuote) => void
  onDelete: (id: string) => void
  onClose: () => void
}) {
  return (
    <div className="surface p-5 md:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Offert-historik</h2>
          <p className="text-sm text-muted">Sparade och skickade offerter.</p>
        </div>
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition hover:bg-white/30"
          aria-label="Stäng"
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </div>

      {history.length === 0 ? (
        <div className="rounded-2xl bg-background/50 p-6 text-center text-sm text-muted">
          Ingen historik ännu. Spara en offert för att se den här.
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((q) => {
            const totals = calculateQuoteTotals(q)
            return (
              <div
                key={q.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-white/30 bg-white/30 p-4 backdrop-blur-xl transition hover:bg-white/50"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted" strokeWidth={1.5} />
                    <span className="font-medium text-foreground">{q.quoteNumber}</span>
                    <StatusBadge status={q.status} />
                  </div>
                  <p className="mt-1 truncate text-sm text-muted">
                    {q.customer.name || 'Ingen kund'} · {q.customer.company}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    {new Date(q.createdAt).toLocaleDateString('sv-SE')} ·{' '}
                    {calculateQuoteTotals(q).finalTotal > 0
                      ? `${(totals.finalTotal / 100).toLocaleString('sv-SE')} kr`
                      : '0 kr'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onLoad(q)}
                    className="rounded-2xl border border-white/40 bg-white/40 px-3 py-2 text-xs font-medium text-foreground transition hover:bg-white/60"
                  >
                    Ladda
                  </button>
                  <button
                    onClick={() => onDelete(q.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-white/40 hover:text-red-600"
                    aria-label="Ta bort"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: OfferQuote['status'] }) {
  const map: Record<typeof status, { text: string; className: string }> = {
    draft: { text: 'Utkast', className: 'bg-amber-100 text-amber-800' },
    ready: { text: 'Klar', className: 'bg-emerald-100 text-emerald-800' },
    sent: { text: 'Skickad', className: 'bg-blue-100 text-blue-800' },
  }
  const s = map[status]
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${s.className}`}>
      {s.text}
    </span>
  )
}
