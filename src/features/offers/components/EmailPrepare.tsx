import { useState } from 'react'
import { X, Mail, Copy, Check } from 'lucide-react'
import { formatPrice, calculateCustomerUnitPrice } from '../lib/calculations'
import type { OfferQuote, QuoteTotals } from '../types'

export function EmailPrepare({
  quote,
  totals,
  onClose,
}: {
  quote: OfferQuote
  totals: QuoteTotals
  onClose: () => void
}) {
  const [to, setTo] = useState(quote.customer.email)
  const [subject] = useState(`Offert från ${quote.store.name} — ${quote.quoteNumber}`)
  const [message] = useState(() => buildMessage(quote, totals))
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(message).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleSend = () => {
    const body = encodeURIComponent(message)
    const subj = encodeURIComponent(subject)
    const recipient = encodeURIComponent(to)
    window.location.href = `mailto:${recipient}?subject=${subj}&body=${body}`
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-xl surface max-h-[90vh] overflow-y-auto p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-foreground transition hover:bg-white/30"
          aria-label="Stäng"
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>

        <h2 className="text-lg font-semibold text-foreground">Förbered offertmejl</h2>
        <p className="mt-1 text-sm text-muted">
          Förhandsgranska och kopiera meddelandet, eller öppna din mejlapp.
        </p>

        <div className="mt-5 space-y-4">
          <Field label="Till" value={to} onChange={setTo} />
          <Field label="Ämne" value={subject} onChange={() => {}} disabled />
          <div>
            <label className="block text-xs font-medium text-muted">Meddelande</label>
            <pre className="mt-1.5 h-56 overflow-auto whitespace-pre-wrap rounded-2xl border border-white/40 bg-white/40 p-4 text-sm text-foreground">
              {message}
            </pre>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button
            onClick={handleSend}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-foreground py-3 text-sm font-medium text-surface transition hover:bg-foreground/90"
          >
            <Mail className="h-4 w-4" strokeWidth={1.5} />
            Öppna mejlapp
          </button>
          <button
            onClick={handleCopy}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/40 bg-white/40 px-5 py-3 text-sm font-medium text-foreground transition hover:bg-white/60"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Kopierat' : 'Kopiera'}
          </button>
          <button
            onClick={onClose}
            className="rounded-2xl border border-white/40 bg-white/40 px-5 py-3 text-sm font-medium text-foreground transition hover:bg-white/60"
          >
            Stäng
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-muted">
          Mejlet skickas via din standardmejlapp. En riktig integration kan kopplas in senare.
        </p>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  disabled = false,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  disabled?: boolean
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="mt-1.5 w-full rounded-2xl border border-white/40 bg-white/40 px-3 py-2.5 text-sm text-foreground outline-none disabled:opacity-60"
      />
    </label>
  )
}

function buildMessage(quote: OfferQuote, totals: QuoteTotals): string {
  const lines: string[] = [
    `Hej ${quote.customer.name || 'du'},`,
    '',
    `Tack för ert besök hos ${quote.store.name}.`,
    '',
    'Här kommer er offert:',
    '',
    ...quote.items.map((item) => {
      const unit = calculateCustomerUnitPrice(item.product, item.discountMode, item.discountValue)
      return `• ${item.product.name} x${item.quantity} = ${formatPrice(unit * item.quantity)}`
    }),
    '',
    `Ordinarie pris: ${formatPrice(totals.ordinarySubtotal)}`,
    `Rabatt: − ${formatPrice(totals.itemDiscountTotal + totals.globalDiscountAmount)}`,
    `Att betala: ${formatPrice(totals.finalTotal)}`,
    '',
    'Med vänlig hälsning,',
    `${quote.salesperson.name}`,
    `${quote.store.name}`,
    '',
    `Offertnr: ${quote.quoteNumber}`,
  ]
  return lines.join('\n')
}
