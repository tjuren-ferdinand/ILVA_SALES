import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function PageHeader({
  title,
  description,
  backTo,
}: {
  title: string
  description?: string
  backTo?: string
}) {
  const navigate = useNavigate()

  return (
    <div className="mb-8">
      {backTo && (
        <button
          onClick={() => navigate(backTo)}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-foreground"
          aria-label="Tillbaka"
        >
          <ArrowLeft className="h-4 w-4" /> Tillbaka
        </button>
      )}
      <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="mt-2 max-w-2xl text-base text-muted">{description}</p>
      )}
    </div>
  )
}
