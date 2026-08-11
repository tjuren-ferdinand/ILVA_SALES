import { useState } from 'react'
import { X, Plus, Minus, ExternalLink, Package } from 'lucide-react'
import { formatPrice } from '../lib/calculations'
import type { OfferProduct } from '../types'

export function ProductModal({
  product,
  onClose,
  onAdd,
}: {
  product: OfferProduct
  onClose: () => void
  onAdd: (p: OfferProduct) => void
}) {
  const [quantity, setQuantity] = useState(1)

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      onAdd(product)
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg surface p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-foreground transition hover:bg-white/30"
          aria-label="Stäng"
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>

        <div className="aspect-[4/3] rounded-2xl bg-background/50 flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <Package className="h-10 w-10 text-muted" strokeWidth={1.5} />
          )}
        </div>

        <h2 className="mt-5 text-xl font-semibold text-foreground">{product.name}</h2>
        <p className="text-sm text-muted">{product.articleNumber} · {product.category}</p>
        {product.description && <p className="mt-2 text-sm text-muted">{product.description}</p>}

        <p className="mt-5 text-3xl font-light text-foreground">{formatPrice(product.ordinaryPrice)}</p>

        {product.url && (
          <a
            href={product.url}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-sm text-muted transition hover:text-foreground"
          >
            Öppna på ILVA.se
            <ExternalLink className="h-4 w-4" strokeWidth={1.5} />
          </a>
        )}

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/40 bg-white/40 text-foreground transition hover:bg-white/60"
            aria-label="Minska antal"
          >
            <Minus className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <span className="w-10 text-center font-medium text-foreground">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/40 bg-white/40 text-foreground transition hover:bg-white/60"
            aria-label="Öka antal"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        <button
          onClick={handleAdd}
          className="mt-6 w-full rounded-2xl bg-foreground py-3 text-sm font-medium text-surface transition hover:bg-foreground/90"
        >
          Lägg till {quantity} st i offert
        </button>
      </div>
    </div>
  )
}
