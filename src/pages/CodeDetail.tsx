import { useParams } from 'react-router-dom'
import { codes } from '../data/mockData'
import { PageHeader } from '../components/ui/PageHeader'
import { CopyButton } from '../components/ui/CopyButton'
import { FavoriteButton } from '../components/ui/FavoriteButton'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'

export function CodeDetail() {
  const { id } = useParams<{ id: string }>()
  const code = codes.find((c) => c.id === id)

  if (!code) {
    return <EmptyState title="Hittades inte" description="Denna kod finns inte." />
  }

  return (
    <div>
      <PageHeader title={code.name} description={code.description} backTo="/codes" />

      <div className="surface p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge>{code.category}</Badge>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
              {code.code}
            </h1>
          </div>
          <FavoriteButton itemKey={`code:${code.id}`} />
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <InfoBox label="Används när" value={code.whenToUse} />
          <InfoBox label="Används INTE när" value={code.whenNotToUse} highlight />
        </div>

        <div className="mt-8">
          <CopyButton text={code.code} />
          <span className="ml-3 text-xs text-muted">Endast demo-kod. Ersätt med riktig ILVA-kod.</span>
        </div>

        {code.related && (
          <div className="mt-8 rounded-2xl border border-border bg-background p-5">
            <h2 className="text-lg font-semibold text-foreground">Relaterat</h2>
            <p className="mt-2 text-sm text-muted">{code.related}</p>
          </div>
        )}
      </div>
    </div>
  )
}

function InfoBox({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        highlight ? 'border-foreground/10 bg-foreground/[0.02]' : 'border-border bg-background'
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-2 text-base leading-relaxed text-foreground">{value}</p>
    </div>
  )
}
