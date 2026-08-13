import { formatPrice, calculateCustomerUnitPrice } from '../lib/calculations'
import { ProductImage } from './ui/ProductImage'
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
    <div className="quote-document mx-auto max-w-4xl bg-white p-8 text-foreground md:p-12">
      <header className="mb-12 border-b border-border pb-8">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-5xl font-semibold tracking-tight text-foreground">OFFERT</h1>
            <p className="mt-2 text-sm uppercase tracking-widest text-muted">ILVA · {quote.store.name}</p>
          </div>
          <div className="text-right text-sm text-muted">
            <p>
              <span className="font-medium text-foreground">Nr:</span> {quote.quoteNumber}
            </p>
            <p>
              <span className="font-medium text-foreground">Datum:</span> {formatDate(quote.createdAt)}
            </p>
            <p>
              <span className="font-medium text-foreground">Giltig t.o.m.:</span>{' '}
              {validUntil(quote.createdAt, quote.validDays)}
            </p>
          </div>
        </div>
      </header>

      <section className="mb-12 grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted">Kund</h2>
          <div className="mt-3 space-y-1 text-sm text-foreground">
            {quote.customer.name && <p className="text-base font-medium">{quote.customer.name}</p>}
            {quote.customer.company && <p className="text-muted">{quote.customer.company}</p>}
            {quote.customer.address && <p className="text-muted">{quote.customer.address}</p>}
            {(quote.customer.postalCode || quote.customer.city) && (
              <p className="text-muted">
                {quote.customer.postalCode} {quote.customer.city}
              </p>
            )}
            {quote.customer.phone && <p className="text-muted">{quote.customer.phone}</p>}
            {quote.customer.email && <p className="text-muted">{quote.customer.email}</p>}
          </div>
        </div>
        <div>
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted">Säljare</h2>
          <div className="mt-3 space-y-1 text-sm">
            <p className="text-base font-medium text-foreground">{quote.salesperson.name}</p>
            <p className="text-muted">{quote.store.name}</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-xs font-medium uppercase tracking-widest text-muted">Produkter</h2>
        <div className="space-y-8">
          {quote.items.map((item) => {
            const customerUnit = calculateCustomerUnitPrice(item.product, item.discountMode, item.discountValue)
            const lineDiscount = (item.product.ordinaryPrice - customerUnit) * item.quantity
            const customerLineTotal = customerUnit * item.quantity
            return (
              <article
                key={item.id}
                className="grid gap-5 border-b border-border pb-6 sm:grid-cols-[180px_1fr]"
              >
                <ProductImage product={item.product} className="w-full" aspect="4/3" />
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-widest text-muted">
                        {item.product.brand ?? item.product.category}
                      </p>
                      <h3 className="mt-1 text-xl font-semibold text-foreground">{item.product.name}</h3>
                      <p className="mt-1 text-sm text-muted">
                        Art.nr. {item.product.articleNumber} · {item.product.category}
                      </p>
                    </div>
                    <p className="text-xl font-light text-foreground">{formatPrice(customerUnit)}</p>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-muted">Antal</p>
                      <p className="text-foreground">{item.quantity}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-muted">Ord. pris</p>
                      <p className="text-foreground">
                        {formatPrice(item.product.ordinaryPrice)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-muted">Rabatt</p>
                      <p className="text-red-700">
                        {lineDiscount > 0 ? `− ${formatPrice(lineDiscount / item.quantity)}` : '−'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-muted">Rad</p>
                      <p className="font-medium text-foreground">{formatPrice(customerLineTotal)}</p>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="mb-12 border-t border-border pt-6">
        <div className="ml-auto max-w-sm space-y-2 text-right">
          <div className="flex justify-between text-sm text-muted">
            <span>Ordinarie pris</span>
            <span>{formatPrice(totals.ordinarySubtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted">
            <span>Rabatt</span>
            <span>
              − {formatPrice(totals.itemDiscountTotal + totals.globalDiscountAmount)}
            </span>
          </div>
          {totals.savings > 0 && (
            <div className="flex justify-between text-sm text-emerald-700">
              <span>Kunden sparar</span>
              <span>{formatPrice(totals.savings)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-border pt-3 text-2xl font-semibold text-foreground">
            <span>Att betala</span>
            <span>{formatPrice(totals.finalTotal)}</span>
          </div>
        </div>
      </section>

      {quote.customerNote && (
        <section className="mb-12">
          <h2 className="mb-2 text-xs font-medium uppercase tracking-widest text-muted">Kommentar till kund</h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{quote.customerNote}</p>
        </section>
      )}

      <footer className="border-t border-border pt-8 text-center text-sm text-muted">
        <p className="font-medium text-foreground">{quote.salesperson.name}</p>
        <p>{quote.store.name} · ILVA</p>
        <p className="mt-1">{quote.quoteNumber}</p>
      </footer>
    </div>
  )
}
