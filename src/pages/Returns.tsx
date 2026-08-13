import { useMemo, useState } from 'react'
import { PageHeader } from '../components/ui/PageHeader'
import { returnProcedures } from '../data/mockData'

const tabNames: Record<string, string> = {
  retur: 'Retur',
  reklamation: 'Reklamation',
  'oppet-kop': 'Öppet köp',
}

const tabs = ['all', 'retur', 'reklamation', 'oppet-kop'] as const

export function Returns() {
  const [tab, setTab] = useState<(typeof tabs)[number]>('all')

  const filtered = useMemo(
    () => returnProcedures.filter((r) => tab === 'all' || r.type === tab),
    [tab],
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Returer"
        description="Retur, reklamation och öppet köp - välj vad du behöver hjälp med."
      />

      <div className="surface flex flex-wrap gap-2 p-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              tab === t
                ? 'bg-foreground text-surface shadow-card'
                : 'bg-background text-muted hover:text-foreground'
            }`}
          >
            {t === 'all' ? 'Alla' : tabNames[t]}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((r) => (
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
