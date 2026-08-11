import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export function NotFound() {
  return (
    <div className="surface flex flex-col items-center justify-center gap-6 py-20 text-center">
      <h1 className="text-4xl font-semibold text-foreground">404</h1>
      <p className="max-w-xs text-muted">Sidan du letar efter finns inte.</p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-2.5 text-sm font-medium text-surface shadow-card transition hover:bg-black"
      >
        <Home className="h-4 w-4" /> Till startsidan
      </Link>
    </div>
  )
}
