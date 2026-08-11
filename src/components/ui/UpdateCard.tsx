import { ArrowRight, AlertCircle, Info } from 'lucide-react'
import type { UpdateItem } from '../../types'
import { Badge } from './Badge'

export function UpdateCard({ update }: { update: UpdateItem }) {
  return (
    <div className="surface flex items-start gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="mt-0.5 text-muted">
        {update.importance === 'high' ? (
          <AlertCircle className="h-5 w-5" strokeWidth={1.5} />
        ) : (
          <Info className="h-5 w-5" strokeWidth={1.5} />
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Badge>{update.category}</Badge>
          <span className="text-xs text-muted">{update.date}</span>
        </div>
        <h3 className="mt-2 text-base font-semibold text-foreground">{update.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">{update.description}</p>
      </div>
      <ArrowRight className="mt-1 h-4 w-4 text-muted" />
    </div>
  )
}
