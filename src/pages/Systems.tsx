import { PageHeader } from '../components/ui/PageHeader'
import { systems } from '../data/mockData'
import { Monitor } from 'lucide-react'

export function Systems() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="System"
        description="Demo-översikt över interna system och vad de används till."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {systems.map((s) => (
          <div key={s.id} className="surface p-6 transition hover:-translate-y-0.5 hover:shadow-soft">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background text-foreground">
                <Monitor className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <h2 className="text-xl font-semibold text-foreground">{s.name}</h2>
            </div>
            <p className="mt-4 text-sm text-muted">{s.description}</p>
            <ul className="mt-5 space-y-2">
              {s.usedFor.map((use) => (
                <li key={use} className="flex items-center gap-2 text-sm text-foreground">
                  <span className="h-1 w-1 rounded-full bg-foreground/40" />
                  {use}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
