import { Star } from 'lucide-react'
import type { FavoritesKey } from '../../types'
import { useFavorites } from '../../hooks/useFavorites'

export function FavoriteButton({
  itemKey,
  size = 'md',
}: {
  itemKey: FavoritesKey
  size?: 'sm' | 'md'
}) {
  const { isFavorite, toggle } = useFavorites()
  const active = isFavorite(itemKey)

  return (
    <button
      type="button"
      onClick={() => toggle(itemKey)}
      className={`rounded-full transition ${
        size === 'sm' ? 'p-1.5' : 'p-2'
      } ${
        active
          ? 'bg-foreground/5 text-foreground'
          : 'text-muted hover:bg-background hover:text-foreground'
      }`}
      aria-label={active ? 'Ta bort favorit' : 'Lägg till favorit'}
      aria-pressed={active}
    >
      <Star
        className={`${size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} transition-transform ${
          active ? 'fill-current scale-110' : ''
        }`}
        strokeWidth={1.5}
      />
    </button>
  )
}
