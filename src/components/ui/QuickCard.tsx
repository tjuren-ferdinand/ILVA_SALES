import { Link } from 'react-router-dom'
import { ArrowUpRight, ChevronRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export function QuickCard({
  to,
  icon: Icon,
  title,
  description,
  external = false,
}: {
  to: string
  icon: LucideIcon
  title: string
  description: string
  external?: boolean
}) {
  const content = (
    <div className="group surface flex flex-col justify-between rounded-2xl p-5 transition-all duration-200 hover:bg-white/60">
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-background text-foreground">
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </div>
        {external ? (
          <ArrowUpRight className="h-4 w-4 text-muted opacity-0 transition group-hover:opacity-100" strokeWidth={1.5} />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" strokeWidth={1.5} />
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="mt-0.5 line-clamp-1 text-[11px] text-muted">{description}</p>
      </div>
    </div>
  )

  if (external) {
    return (
      <a href={to} target="_blank" rel="noopener noreferrer" className="block" aria-label={title}>
        {content}
      </a>
    )
  }

  return (
    <Link to={to} className="block" aria-label={title}>
      {content}
    </Link>
  )
}
