import { useState } from 'react'
import { Plus, Minus, Trash2, Package } from 'lucide-react'
import {
  formatPrice,
  calculateCustomerUnitPrice,
  calculateDiscountPercent,
  validateDiscount,
} from '../lib/calculations'
import type { DiscountMode, OfferQuoteItem } from '../types'

export function QuoteItemsList({
  items,
  onRemove,
  onQuantity,
  onDiscount,
}: {
  items: OfferQuoteItem[]
  onRemove: (id: string) => void
  onQuantity: (id: string, quantity: number) => void
  onDiscount: (id: string, mode: DiscountMode, value: number) => void
}) {
  return (
    <div className="surface p-5 md:p-6">
      <h2 className="text-lg font-semibold text-foreground">Offertposter</h2>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <QuoteItemRow key={item.id} item={item} onRemove={onRemove} onQuantity={onQuantity} onDiscount={onDiscount} />
        ))}
      </div>
    </div>
  )
}

function QuoteItemRow({
  item,
  onRemove,
  onQuantity,
  onDiscount,
}: {
  item: OfferQuoteItem
  onRemove: (id: string) => void
  onQuantity: (id: string, quantity: number) => void
  onDiscount: (id: string, mode: DiscountMode, value: number) => void
}) {
  const customerUnit = calculateCustomerUnitPrice(item.product, item.discountMode, item.discountValue)
  const [error, setError] = useState<string | null>(null)

  const handleMode = (mode: DiscountMode) => {
    const customer = customerUnit
    let newValue = 0
    if (mode === 'percent') {
      newValue = calculateDiscountPercent(item.product, customer)
    } else if (mode === 'fixed') {
      newValue = item.product.ordinaryPrice - customer
    } else if (mode === 'customerPrice') {
      newValue = customer
    }
    setError(null)
    onDiscount(item.id, mode, newValue)
  }

  const handleValue = (raw: number) => {
    if (isNaN(raw)) return
    const err = validateDiscount(item.product, item.discountMode, raw)
    if (err) {
      setError(err)
      return
    }
    setError(null)
    onDiscount(item.id, item.discountMode, raw)
  }

  const displayValue = item.discountMode === 'percent' ? item.discountValue : item.discountValue / 100

  return (
    <div className="surface p-4">
      <div className="flex gap-4">
        <div className="h-20 w-20 shrink-0 rounded-xl bg-background/50 flex items-center justify-center overflow-hidden">
          {item.product.image ? (
            <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
          ) : (
            <Package className="h-6 w-6 text-muted" strokeWidth={1.5} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-medium text-foreground">{item.product.name}</h3>
              <p className="text-xs text-muted">{item.product.articleNumber}</p>
            </div>
            <button
              onClick={() => onRemove(item.id)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-white/40 hover:text-red-600"
              aria-label="Ta bort"
            >
              <Trash2 className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onQuantity(item.id, Math.max(1, item.quantity - 1))}
                disabled={item.quantity <= 1}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/40 bg-white/40 text-foreground transition hover:bg-white/60 disabled:opacity-40"
                aria-label="Minska"
              >
                <Minus className="h-4 w-4" strokeWidth={1.5} />
              </button>
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => onQuantity(item.id, Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="h-8 w-14 rounded-xl border border-white/40 bg-white/40 text-center text-sm text-foreground outline-none"
              />
              <button
                onClick={() => onQuantity(item.id, item.quantity + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/40 bg-white/40 text-foreground transition hover:bg-white/60"
                aria-label="Öka"
              >
                <Plus className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex rounded-xl border border-white/40 bg-white/40 p-1">
                {(['percent', 'fixed', 'customerPrice'] as DiscountMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => handleMode(m)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                      item.discountMode === m
                        ? 'bg-foreground text-surface'
                        : 'text-muted hover:text-foreground'
                    }`}
                  >
                    {m === 'percent' ? '%' : m === 'fixed' ? 'kr' : 'Pris'}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min={0}
                max={item.discountMode === 'percent' ? 100 : item.product.ordinaryPrice / 100}
                step={0.01}
                value={displayValue}
                onChange={(e) =>
                  handleValue(
                    item.discountMode === 'percent'
                      ? parseFloat(e.target.value)
                      : Math.round((parseFloat(e.target.value) || 0) * 100)
                  )
                }
                className="h-8 w-24 rounded-xl border border-white/40 bg-white/40 px-2 text-right text-sm text-foreground outline-none"
              />
            </div>
          </div>

          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

          <div className="mt-3 flex flex-wrap justify-end gap-4 text-sm text-muted">
            <span>Ord: {formatPrice(item.product.ordinaryPrice)}</span>
            <span>·</span>
            <span>Kund: {formatPrice(customerUnit)}</span>
            <span>·</span>
            <span className="font-medium text-foreground">Rad: {formatPrice(customerUnit * item.quantity)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
