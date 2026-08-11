import { SearchX } from 'lucide-react'

export function EmptyState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="surface flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background text-muted">
        <SearchX className="h-6 w-6" strokeWidth={1.5} />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-1 max-w-xs text-sm text-muted">{description}</p>
      </div>
    </div>
  )
}
