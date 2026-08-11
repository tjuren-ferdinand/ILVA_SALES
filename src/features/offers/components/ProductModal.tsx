import { useState } from 'react'
import { Link } from 'react-router-dom'
import { X, Plus, Minus, ExternalLink, Eye } from 'lucide-react'
import { formatPrice } from '../lib/calculations'
import { ProductImage } from './ui/ProductImage'
import type { OfferProduct } from '../types'

export function ProductModal({
  product,
  onClose,
  onAdd,
}: {
  product: OfferProduct
  onClose: () => void
  onAdd: (p: OfferProduct, quantity: number) => void
}) {
  const [quantity, setQuantity] = useState(1)

  const handleAdd = () => {
    onAdd(product, quantity)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-2xl surface max-h-[90vh] overflow-y-auto p-6 md:p-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-foreground transition hover:bg-white/30"
          aria-label="Stäng"
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>

        <ProductImage product={product} className="w-full" aspect="16/9" />

        <div className="mt-6 flex flex-col gap-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            {product.brand ?? product.category}
          </p>
          <h2 className="text-2xl font-semibold text-foreground">{product.name}</h2>
          <p className="text-sm text-muted">
            {product.articleNumber} · {product.category}
          </p>
        </div>

        {product.description && (
          <p className="mt-4 text-sm leading-relaxed text-muted">{product.description}</p>
        )}

        <p className="mt-6 text-4xl font-light text-foreground">
          {formatPrice(product.ordinaryPrice)}
        </p>

        {product.url && (
          <a
            href={product.url}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-sm text-muted transition hover:text-foreground"
          >
            Se produkten på ILVA.se
            <ExternalLink className="h-4 w-4" strokeWidth={1.5} />
          </a>
        )}
        <Link
          to={`/showcase?product=${product.id}`}
          target="_blank"
          className="mt-2 inline-flex items-center gap-1 text-sm text-muted transition hover:text-foreground"
        >
          <Eye className="h-4 w-4" strokeWidth={1.5} />
          Visa kund
        </Link>

        <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-white/30 pt-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/40 bg-white/40 text-foreground transition hover:bg-white/60"
              aria-label="Minska antal"
            >
              <Minus className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <span className="w-10 text-center text-lg font-medium text-foreground">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/40 bg-white/40 text-foreground transition hover:bg-white/60"
              aria-label="Öka antal"
            >
              <Plus className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>

          <button
            onClick={handleAdd}
            className="flex-1 rounded-2xl bg-foreground py-3.5 text-sm font-medium text-surface transition hover:bg-foreground/90"
          >
            Lägg till {quantity} st i offert — {formatPrice(product.ordinaryPrice * quantity)}
          </button>
        </div>
      </div>
    </div>
  )
}
