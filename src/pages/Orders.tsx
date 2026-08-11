import { PageHeader } from '../components/ui/PageHeader'
import { orderProcedures } from '../data/mockData'

export function Orders() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Beställningar"
        description="Demo-rutiner för order, orderändringar och bekräftelser."
      />

      <div className="space-y-4">
        {orderProcedures.map((o) => (
          <div key={o.id} className="surface p-6">
            <h2 className="text-xl font-semibold text-foreground">{o.title}</h2>
            <p className="mt-2 text-sm text-muted">{o.description}</p>
            <ol className="mt-5 space-y-3">
              {o.steps.map((step, i) => (
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
