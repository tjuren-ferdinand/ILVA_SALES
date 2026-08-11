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
  description: string
}) {
  return (
    <Link
      to={to}
      className="group surface flex items-center gap-4 rounded-2xl p-4 transition-all duration-200 hover:bg-white/50"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background text-foreground">
        <Icon className="h-5 w-5" strokeWidth={1.5} />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-foreground">{title}</h3>
        <p className="truncate text-xs text-muted">{description}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted transition group-hover:translate-x-0.5" strokeWidth={1.5} />
    </Link>
  )
}
