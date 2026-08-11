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
  const mode = quote.globalDiscount.mode
  const displayValue = mode === 'percent' ? quote.globalDiscount.value : quote.globalDiscount.value / 100
  const error = validateGlobal(mode, quote.globalDiscount.value, totals.customerSubtotal)

  const handleMode = (m: 'percent' | 'fixed') => {
    const currentFixed =
      mode === 'percent'
        ? Math.round((quote.globalDiscount.value / 100) * totals.customerSubtotal)
        : quote.globalDiscount.value
    let newValue = currentFixed
    if (m === 'percent') {
      if (totals.customerSubtotal > 0) {
        newValue = Number(((currentFixed / totals.customerSubtotal) * 100).toFixed(2))
      } else {
        newValue = 0
      }
    }
    onGlobalDiscount(m, newValue)
  }

  const handleValue = (raw: number) => {
    if (isNaN(raw)) return
    const val = mode === 'percent' ? raw : Math.round(raw * 100)
    onGlobalDiscount(mode, val)
  }

  return (
    <div className="surface p-5 md:p-6">
      <h2 className="text-lg font-semibold text-foreground">Sammanfattning</h2>

      <div className="mt-4 space-y-3 border-b border-white/30 pb-4 text-sm">
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
            type="number"
            min={0}
            max={mode === 'percent' ? 100 : totals.customerSubtotal / 100}
            step={0.01}
            value={displayValue}
            onChange={(e) => handleValue(parseFloat(e.target.value))}
            className="h-8 w-24 rounded-xl border border-white/40 bg-white/40 px-2 text-right text-sm text-foreground outline-none"
          />
        </div>
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      </div>

      <div className="mt-4 space-y-2 border-t border-white/30 pt-4">
        <div className="flex justify-between text-sm text-muted">
          <span>Global rabatt</span>
          <span>− {formatPrice(totals.globalDiscountAmount)}</span>
        </div>
        <div className="flex justify-between text-3xl font-semibold text-foreground">
          <span>Totalt</span>
          <span>{formatPrice(totals.finalTotal)}</span>
        </div>
        {totals.savings > 0 && (
          <div className="flex justify-between text-sm text-emerald-700">
            <span>Kunden sparar</span>
            <span>{formatPrice(totals.savings)}</span>
          </div>
        )}
        <div className="flex justify-between text-xs text-muted">
          <span>{totals.productCount} produkter · {totals.itemCount} artiklar</span>
        </div>
      </div>
    </div>
  )
}

function validateGlobal(mode: 'percent' | 'fixed', value: number, customerSubtotal: number): string | null {
  if (mode === 'percent') {
    if (value < 0) return 'Rabatt i procent får inte vara negativ'
    if (value > 100) return 'Rabatt i procent får inte överstiga 100 %'
  }
  if (mode === 'fixed') {
    if (value < 0) return 'Rabattbelopp får inte vara negativt'
    if (customerSubtotal > 0 && value > customerSubtotal) return 'Rabattbelopp får inte överstiga offertens summa'
  }
  return null
}
