import { formatPrice, calculateCustomerUnitPrice } from '../lib/calculations'
import type { OfferQuote, QuoteTotals } from '../types'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('sv-SE')
}

function validUntil(createdAt: string, days: number) {
  const d = new Date(createdAt)
  d.setDate(d.getDate() + days)
  return d.toLocaleDateString('sv-SE')
}

export function QuotePreview({ quote, totals }: { quote: OfferQuote; totals: QuoteTotals }) {
  return (
    <div className="mx-auto max-w-4xl text-foreground">
      <header className="mb-10 border-b border-border pb-8">
        <div className="text-sm font-medium uppercase tracking-widest text-muted">ILVA Sales Hub</div>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground">Offert</h1>
        <div className="mt-4 grid gap-2 text-sm text-muted sm:grid-cols-3">
          <div>
            <span className="font-medium text-foreground">Offertnummer:</span> {quote.quoteNumber}
          </div>
          <div>
            <span className="font-medium text-foreground">Datum:</span> {formatDate(quote.createdAt)}
          </div>
          <div>
            <span className="font-medium text-foreground">Giltig till:</span> {validUntil(quote.createdAt, quote.validDays)}
          </div>
        </div>
      </header>

      <div className="mb-10 grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted">Kund</h2>
          <div className="mt-2 space-y-1">
            {quote.customer.name && <div className="font-medium">{quote.customer.name}</div>}
            {quote.customer.company && <div>{quote.customer.company}</div>}
            {quote.customer.address && <div>{quote.customer.address}</div>}
            {(quote.customer.postalCode || quote.customer.city) && (
              <div>
                {quote.customer.postalCode} {quote.customer.city}
              </div>
            )}
            {quote.customer.phone && <div>{quote.customer.phone}</div>}
            {quote.customer.email && <div>{quote.customer.email}</div>}
          </div>
        </div>
        <div>
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted">Säljare / Butik</h2>
          <div className="mt-2 space-y-1">
            <div className="font-medium">{quote.salesperson.name}</div>
            <div>{quote.store.name}</div>
          </div>
        </div>
      </div>

      <div className="mb-10 overflow-hidden rounded-2xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-background text-muted">
            <tr>
              <th className="p-4 font-medium">Produkt</th>
              <th className="p-4 font-medium">Art.nr.</th>
              <th className="p-4 font-medium text-right">Antal</th>
              <th className="p-4 font-medium text-right">Ord. pris</th>
              <th className="p-4 font-medium text-right">Rabatt</th>
              <th className="p-4 font-medium text-right">Kundpris</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {quote.items.map((item) => {
              const customerUnit = calculateCustomerUnitPrice(item.product, item.discountMode, item.discountValue)
              const lineDiscount = item.product.ordinaryPrice - customerUnit
              return (
                <tr key={item.id}>
                  <td className="p-4 align-top">
                    <div className="font-medium">{item.product.name}</div>
                    <div className="text-xs text-muted">{item.product.category}</div>
                  </td>
                  <td className="p-4 align-top text-muted">{item.product.articleNumber}</td>
                  <td className="p-4 text-right align-top">{item.quantity}</td>
                  <td className="p-4 text-right align-top">{formatPrice(item.product.ordinaryPrice * item.quantity)}</td>
                  <td className="p-4 text-right align-top text-red-700">
                    {lineDiscount > 0 ? `− ${formatPrice(lineDiscount * item.quantity)}` : '−'}
                  </td>
                  <td className="p-4 text-right align-top font-medium">{formatPrice(customerUnit * item.quantity)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mb-10 ml-auto max-w-sm space-y-3 border-t border-border pt-6 text-right">
        <div className="flex justify-between text-sm text-muted">
          <span>Ordinarie pris</span>
          <span>{formatPrice(totals.ordinarySubtotal)}</span>
        </div>
        <div className="flex justify-between text-sm text-muted">
          <span>Rabatt</span>
          <span>− {formatPrice(totals.itemDiscountTotal + totals.globalDiscountAmount)}</span>
        </div>
        <div className="flex justify-between border-t border-border pt-3 text-lg font-semibold text-foreground">
          <span>Att betala</span>
          <span>{formatPrice(totals.finalTotal)}</span>
        </div>
        {totals.savings > 0 && (
          <div className="flex justify-between text-sm text-emerald-700">
            <span>Kunden sparar</span>
            <span>{formatPrice(totals.savings)}</span>
          </div>
        )}
      </div>

      {quote.customerNote && (
        <div className="mb-10">
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted">Kommentar till kund</h2>
          <p className="mt-2 whitespace-pre-wrap text-foreground">{quote.customerNote}</p>
        </div>
      )}

      <footer className="border-t border-border pt-8 text-center text-sm text-muted">
        <div className="font-medium text-foreground">{quote.store.name}</div>
        <div>ILVA Sales Hub · Offert {quote.quoteNumber}</div>
      </footer>
    </div>
  )
}
