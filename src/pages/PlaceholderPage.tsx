import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="surface mx-auto max-w-xl p-8 text-center">
      <div className="mb-6 text-2xl font-semibold tracking-tight text-foreground">{title}</div>
      <p className="text-sm text-muted">Denna sida byggs upp i ILVA Sales Hub.</p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-foreground px-4 py-2 text-sm font-medium text-white transition hover:bg-foreground/90"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        Tillbaka till Sales Hub
      </Link>
    </div>
  )
}
