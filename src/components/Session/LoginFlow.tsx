import { Building2, ArrowRight, Store as StoreIcon } from 'lucide-react'
import { useSession } from '../../hooks/useSession'

function StoreSelector({ onSelect }: { onSelect: (id: string) => void }) {
  const { stores } = useSession()

  return (
    <div className="w-full max-w-2xl space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/40 bg-white/40 backdrop-blur-xl">
          <StoreIcon className="h-7 w-7 text-foreground/40" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">Välj butik</h1>
        <p className="mt-2 text-sm text-muted">Välj den ILVA-butik du arbetar på idag.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {stores.map((store) => (
          <button
            key={store.id}
            onClick={() => onSelect(store.id)}
            className="group flex items-center gap-4 rounded-2xl border border-white/40 bg-white/40 p-4 text-left shadow-soft backdrop-blur-xl transition hover:bg-white/60 hover:shadow-card"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-foreground text-surface">
              <Building2 className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground">{store.name}</h3>
              <p className="text-xs text-muted">{store.city} · {store.code}</p>
            </div>
            <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-muted transition group-hover:translate-x-0.5" strokeWidth={1.5} />
          </button>
        ))}
      </div>
    </div>
  )
}

export function LoginFlow() {
  const { setStore } = useSession()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background p-6">
      <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-foreground/[0.03] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-foreground/[0.04] blur-3xl" />
      <StoreSelector onSelect={setStore} />
    </div>
  )
}
