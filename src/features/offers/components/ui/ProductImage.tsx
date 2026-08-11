import { useState } from 'react'
import { Sofa, Umbrella, Bath, Flower2 } from 'lucide-react'
import type { OfferProduct } from '../../types'

const icons: Record<string, typeof Sofa> = {
  Bäddsoffor: Sofa,
  Utemöbler: Umbrella,
  Badrum: Bath,
  Dekoration: Flower2,
}

export function ProductImage({
  product,
  className = '',
  aspect = '4/3',
  objectFit = 'cover',
}: {
  product: OfferProduct
  className?: string
  aspect?: '4/3' | '1/1' | '16/9'
  objectFit?: 'cover' | 'contain'
}) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  const showImage = product.image && !error
  const Icon = icons[product.category] ?? Sofa

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-background/60 ${className}`}
      style={{ aspectRatio: aspect }}
    >
      {showImage && (
        <img
          src={product.image}
          alt={product.name}
          className={`h-full w-full transition-opacity duration-300 ${
            objectFit === 'contain' ? 'object-contain' : 'object-cover'
          } ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}

      {!showImage && (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-foreground/25">
          <Icon className="h-10 w-10" strokeWidth={1.5} />
          <span className="max-w-[80%] truncate text-center text-[10px] uppercase tracking-wider">
            {product.brand || product.category}
          </span>
        </div>
      )}
    </div>
  )
}
