import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export function FunctionCard({
  to,
  icon: Icon,
  title,
  description,
}: {
  to: string
  icon: LucideIcon
  title: string
  description?: string
}) {
  return (
    <Link
      to={to}
      className="group surface flex flex-col items-center gap-2 rounded-2xl p-4 text-center transition-all duration-200 hover:bg-white/60"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background text-foreground">
        <Icon className="h-5 w-5" strokeWidth={1.5} />
      </div>
      <div className="min-w-0">
        <h3 className="truncate text-sm font-semibold text-foreground">{title}</h3>
        {description ? (
          <p className="line-clamp-1 text-[10px] text-muted">{description}</p>
        ) : null}
      </div>
      <ChevronRight className="h-4 w-4 text-muted opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" strokeWidth={1.5} />
    </Link>
  )
}
