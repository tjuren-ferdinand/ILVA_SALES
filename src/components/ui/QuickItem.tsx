import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export function QuickItem({
  to,
  title,
  description,
}: {
  to: string
  title: string
  description: string
}) {
  return (
    <Link
      to={to}
      className="group surface flex items-center justify-between p-4 transition-all duration-200 hover:bg-white/50"
    >
      <div>
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        <p className="text-xs text-muted">{description}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-muted transition group-hover:translate-x-0.5" />
    </Link>
  )
}
