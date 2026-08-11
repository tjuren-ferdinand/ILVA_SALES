import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'

export function CategoryCard({
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
      className="group surface flex flex-col gap-4 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-foreground/10"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-background text-foreground">
        <Icon className="h-5 w-5" strokeWidth={1.5} />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted">{description}</p>
      </div>
    </Link>
  )
}
