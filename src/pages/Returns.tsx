import { PageHeader } from '../components/ui/PageHeader'
import { returnProcedures } from '../data/mockData'

export function Returns() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Retur & reklamation"
        description="Demo-rutiner för returer, reklamationer och skador vid leverans."
      />

      <div className="space-y-4">
        {returnProcedures.map((r) => (
          <div key={r.id} className="surface p-6">
            <h2 className="text-xl font-semibold text-foreground">{r.title}</h2>
            <p className="mt-2 text-sm text-muted">{r.description}</p>
            <ol className="mt-5 space-y-3">
              {r.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                  <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-xs text-surface">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  )
}
