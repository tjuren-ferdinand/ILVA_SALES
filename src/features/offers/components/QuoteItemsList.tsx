import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Minus, Trash2, Eye } from 'lucide-react'
import { ProductImage } from './ui/ProductImage'
import {
  formatPrice,
  calculateCustomerUnitPrice,
  calculateDiscountPercent,
  validateDiscount,
} from '../lib/calculations'
import { findMaxDiscount } from '../lib/discountRules'
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
  if (items.length === 0) return null

  return (
    <div className="surface p-5 md:p-6">
      <h2 className="text-lg font-semibold text-foreground">Produkter i offert</h2>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <QuoteItemRow
            key={item.id}
            item={item}
            onRemove={onRemove}
            onQuantity={onQuantity}
            onDiscount={onDiscount}
          />
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
  const customerLineTotal = customerUnit * item.quantity
  const currentPercent = useMemo(
    () => calculateDiscountPercent(item.product, customerUnit),
    [item.product, customerUnit]
  )
  const max = useMemo(() => findMaxDiscount(item.product), [item.product])
  const [error, setError] = useState<string | null>(null)
  const [localValue, setLocalValue] = useState<string>(() =>
    item.discountMode === 'percent'
      ? String(item.discountValue)
      : (item.discountValue / 100).toLocaleString('sv-SE', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
  )

  const handleMode = (mode: DiscountMode) => {
    let nextValue = 0
    if (mode === 'percent') {
      nextValue = currentPercent
    } else if (mode === 'fixed') {
      nextValue = item.product.ordinaryPrice - customerUnit
    } else if (mode === 'customerPrice') {
      nextValue = customerUnit
    }
    setLocalValue(
      mode === 'percent'
        ? String(nextValue)
        : (nextValue / 100).toLocaleString('sv-SE', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
    )
    setError(null)
    onDiscount(item.id, mode, nextValue)
  }

  const handleValueChange = (raw: string) => {
    setLocalValue(raw)
    const cleaned = raw.replace(/\s/g, '').replace(/,/g, '.')
    const num = Number(cleaned)
    if (isNaN(num) || num < 0) return

    const valueInCents =
      item.discountMode === 'percent' ? num : Math.round(num * 100)

    const err = validateDiscount(item.product, item.discountMode, valueInCents)
    if (err) {
      setError(err)
      return
    }
    setError(null)
    onDiscount(item.id, item.discountMode, valueInCents)
  }

  return (
    <div className="surface p-4">
      <div className="flex gap-4">
        <div className="w-24 shrink-0">
          <ProductImage product={item.product} className="w-full" aspect="1/1" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-foreground">{item.product.name}</h3>
              <p className="text-xs text-muted">
                {item.product.articleNumber} · {item.product.category}
              </p>
            </div>
            <Link
              to={`/showcase?product=${item.product.id}`}
              target="_blank"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-white/40 hover:text-foreground"
              aria-label="Visa kund"
            >
              <Eye className="h-4 w-4" strokeWidth={1.5} />
            </Link>
            <button
              onClick={() => onRemove(item.id)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-white/40 hover:text-red-600"
              aria-label="Ta bort"
            >
              <Trash2 className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>

          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-muted">Antal</label>
              <div className="mt-1.5 flex items-center gap-2">
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
            </div>

            <div>
              <label className="block text-xs font-medium text-muted">Rabatt</label>
              <div className="mt-1.5 flex items-center gap-2">
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
                  type="text"
                  inputMode="decimal"
                  value={localValue}
                  onChange={(e) => handleValueChange(e.target.value)}
                  className="h-8 w-28 rounded-xl border border-white/40 bg-white/40 px-2 text-right text-sm text-foreground outline-none"
                />
              </div>
            </div>
          </div>

          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
          {max && currentPercent > max.percent && !error && (
            <p className="mt-2 text-xs text-amber-700">
              Rabatt över tillåten nivå. Maximal rabatt för {max.rule}: {max.percent} %
            </p>
          )}

          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/30 pt-3 text-right">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted">Ordinarie</p>
              <p className="text-sm text-muted">{formatPrice(item.product.ordinaryPrice)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted">Kundpris</p>
              <p className="text-sm font-medium text-foreground">{formatPrice(customerUnit)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted">Rad</p>
              <p className="text-sm font-semibold text-foreground">{formatPrice(customerLineTotal)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
