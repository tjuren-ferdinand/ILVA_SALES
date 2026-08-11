import { useState } from 'react'
import { Package } from 'lucide-react'
import type { OfferProduct } from '../../types'

export function ProductImage({
  product,
  className = '',
  aspect = '4/3',
}: {
  product: OfferProduct
  className?: string
  aspect?: '4/3' | '1/1' | '16/9'
}) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  const showImage = product.image && !error

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-background/60 ${className}`}
      style={{ aspectRatio: aspect }}
    >
      {showImage && (
        <img
          src={product.image}
          alt={product.name}
          className={`h-full w-full object-cover transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}

      {!showImage && (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-foreground/25">
          <Package className="h-10 w-10" strokeWidth={1.5} />
          <span className="max-w-[80%] truncate text-center text-[10px] uppercase tracking-wider">
            {product.articleNumber}
          </span>
        </div>
      )}
    </div>
  )
}
