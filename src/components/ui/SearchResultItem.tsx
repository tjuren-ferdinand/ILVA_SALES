import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { SearchableItem } from '../../types'
import { Badge } from './Badge'
import { FavoriteButton } from './FavoriteButton'

export function SearchResultItem({ item }: { item: SearchableItem }) {
  return (
    <div className="group surface flex items-start justify-between gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-soft">
      <Link to={item.url} className="flex-1 outline-none">
        <div className="flex items-center gap-2">
          <Badge>{item.category ?? 'Sökresultat'}</Badge>
          {item.code && <span className="font-mono text-xs text-muted">{item.code}</span>}
        </div>
        <h3 className="mt-2 text-base font-semibold text-foreground group-hover:underline">
          {item.title}
        </h3>
        {item.subtitle && <p className="text-sm text-muted">{item.subtitle}</p>}
        {item.description && (
          <p className="mt-1 text-sm leading-relaxed text-muted">{item.description}</p>
        )}
      </Link>
      <div className="flex flex-col items-end gap-2">
        <FavoriteButton itemKey={`${item.type}:${item.id}`} size="sm" />
        <ArrowRight className="h-4 w-4 text-muted" />
      </div>
    </div>
  )
}
