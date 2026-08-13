import { Link } from 'react-router-dom'
import { Wallet } from 'lucide-react'
import { formatPrice } from '../lib/calculations'
import type { GlobalDiscount, OfferQuote, QuoteTotals } from '../types'

export function QuoteSummaryPanel({
  quote,
  totals,
  onGlobalDiscount,
}: {
  quote: OfferQuote
  totals: QuoteTotals
  onGlobalDiscount: (mode: 'percent' | 'fixed', value: number) => void
}) {
  const { mode, value } = quote.globalDiscount
  const displayValue =
    mode === 'percent'
      ? value
      : (value / 100).toLocaleString('sv-SE', { minimumFractionDigits: 0, maximumFractionDigits: 2 })

  const handleMode = (m: 'percent' | 'fixed') => {
    const currentCustomer = totals.customerSubtotal
    let nextValue = 0
    if (m === 'percent') {
      if (currentCustomer > 0) {
        nextValue = Number((((mode === 'fixed' ? value : Math.round((value / 100) * currentCustomer)) / currentCustomer) * 100).toFixed(2))
      }
    } else {
      nextValue = mode === 'percent' ? Math.round((value / 100) * currentCustomer) : value
    }
    onGlobalDiscount(m, nextValue)
  }

  const handleValue = (raw: string) => {
    const cleaned = raw.replace(/\s/g, '').replace(/,/g, '.')
    const num = Number(cleaned)
    if (isNaN(num) || num < 0) return
    const nextValue = mode === 'percent' ? num : Math.round(num * 100)
    onGlobalDiscount(mode, nextValue)
  }

  return (
    <div className="surface p-5 md:p-6">
      <h2 className="text-lg font-semibold text-foreground">Sammanfattning</h2>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between text-muted">
          <span>Ordinarie pris</span>
          <span>{formatPrice(totals.ordinarySubtotal)}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>Rad-rabatt</span>
          <span>− {formatPrice(totals.itemDiscountTotal)}</span>
        </div>
        <div className="flex justify-between font-medium text-foreground">
          <span>Efter rad-rabatt</span>
          <span>{formatPrice(totals.customerSubtotal)}</span>
        </div>
      </div>

      <div className="mt-4">
        <label className="text-xs font-medium text-muted">Rabatt på hela offerten</label>
        <div className="mt-1.5 flex items-center gap-2">
          <div className="flex rounded-xl border border-white/40 bg-white/40 p-1">
            {(['percent', 'fixed'] as GlobalDiscount['mode'][]).map((m) => (
              <button
                key={m}
                onClick={() => handleMode(m)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                  mode === m ? 'bg-foreground text-surface' : 'text-muted hover:text-foreground'
                }`}
              >
                {m === 'percent' ? '%' : 'kr'}
              </button>
            ))}
          </div>
          <input
            type="text"
            inputMode="decimal"
            value={displayValue}
            onChange={(e) => handleValue(e.target.value)}
            className="h-8 w-24 rounded-xl border border-white/40 bg-white/40 px-2 text-right text-sm text-foreground outline-none"
          />
        </div>
      </div>

      <div className="mt-4 space-y-2 border-t border-white/30 pt-4">
        <div className="flex justify-between text-sm text-muted">
          <span>Global rabatt</span>
          <span>− {formatPrice(totals.globalDiscountAmount)}</span>
        </div>
        {totals.savings > 0 && (
          <div className="flex justify-between text-sm text-emerald-700">
            <span>Kunden sparar</span>
            <span>{formatPrice(totals.savings)}</span>
          </div>
        )}
        <div className="flex justify-between text-3xl font-semibold text-foreground">
          <span>Totalt</span>
          <span>{formatPrice(totals.finalTotal)}</span>
        </div>
        <p className="text-right text-xs text-muted">
          {totals.productCount} produkter · {totals.itemCount} artiklar
        </p>
      </div>

      <div className="mt-5 border-t border-white/30 pt-5">
        <Link
          to={`/resurs?amount=${totals.finalTotal}&back=/offert`}
          className="flex items-center justify-between rounded-2xl border border-white/40 bg-white/40 px-4 py-3 text-sm font-medium text-foreground backdrop-blur-xl transition hover:bg-white/60"
        >
          <span className="flex items-center gap-2">
            <Wallet className="h-4 w-4" strokeWidth={1.5} />
            Finansiera med Resurs
          </span>
          <span className="text-muted">från {formatPrice(totals.finalTotal)}</span>
        </Link>
      </div>
    </div>
  )
}
