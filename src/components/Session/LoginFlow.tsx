import { useState } from 'react'
import { Building2, Users, Lock, ArrowLeft, ArrowRight, Check, Store as StoreIcon } from 'lucide-react'
import { useSession } from '../../hooks/useSession'
import type { Employee, Store } from '../../types'

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function Avatar({ image, name, size = 'md' }: { image?: string; name: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'h-12 w-12 text-[10px]', md: 'h-20 w-20 text-sm', lg: 'h-28 w-28 text-lg' }
  return (
    <div
      className={`${sizes[size]} overflow-hidden rounded-full border-2 border-white/70 bg-gradient-to-br from-background to-surface shadow-soft`}
    >
      {image ? (
        <img src={image} alt={name} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center font-semibold text-foreground/40">
          {initials(name)}
        </div>
      )}
    </div>
  )
}

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

function TeamSelector({ store, onSelect, onBack }: { store: Store; onSelect: (id: string) => void; onBack: () => void }) {
  return (
    <div className="w-full max-w-2xl space-y-6">
      <div className="text-center">
        <button onClick={onBack} className="mb-4 inline-flex items-center gap-1 text-xs text-muted transition hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} /> Tillbaka
        </button>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/40 bg-white/40 backdrop-blur-xl">
          <Users className="h-7 w-7 text-foreground/40" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{store.name}</h1>
        <p className="mt-2 text-sm text-muted">Välj vem du är i {store.city}.</p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
        {store.team
          .filter((e) => e.active !== false)
          .map((m, i) => (
            <button
              key={m.id}
              onClick={() => onSelect(m.id)}
              style={{ animationDelay: `${i * 40}ms` }}
              className="profile-card group flex flex-col items-center gap-2 transition hover:scale-105"
              title={m.name}
            >
              <div className="relative">
                <Avatar image={m.image} name={m.name} size="md" />
                <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-surface opacity-0 shadow-lg transition group-hover:opacity-100">
                  <Check className="h-3 w-3" strokeWidth={2} />
                </div>
              </div>
              <span className="text-center text-xs font-medium text-muted transition group-hover:text-foreground">
                {m.name}
              </span>
              <span className="max-w-[6rem] truncate text-[10px] text-muted/70">{m.role}</span>
            </button>
          ))}
      </div>
    </div>
  )
}

function PinStep({ employee, onSubmit, onBack }: { employee: Employee; onSubmit: (pin: string) => boolean; onBack: () => void }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleChange = (v: string) => {
    const cleaned = v.replace(/\D/g, '').slice(0, 4)
    setPin(cleaned)
    setError(null)
  }

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (pin.length !== 4) {
      setError('Ange 4 siffror')
      return
    }
    if (!onSubmit(pin)) {
      setError('Fel PIN')
      setPin('')
    }
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-center">
        <button onClick={onBack} className="mb-4 inline-flex items-center gap-1 text-xs text-muted transition hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} /> Tillbaka
        </button>
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/40 bg-white/40 backdrop-blur-xl">
          <Avatar image={employee.image} name={employee.name} size="lg" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{employee.name}</h1>
        <p className="mt-2 text-sm text-muted">Ange din 4-siffriga PIN.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-center gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`h-4 w-4 rounded-full transition ${
                i < pin.length ? 'bg-foreground' : 'bg-foreground/20'
              }`}
            />
          ))}
        </div>

        <input
          type="password"
          inputMode="numeric"
          pattern="\d*"
          maxLength={4}
          value={pin}
          onChange={(e) => handleChange(e.target.value)}
          className="sr-only"
          aria-label="PIN-kod"
          autoFocus
        />

        {error && <p className="text-center text-xs text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={pin.length !== 4}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground px-5 py-3 text-sm font-medium text-surface transition hover:bg-foreground/90 disabled:opacity-40"
        >
          <Lock className="h-4 w-4" strokeWidth={1.5} />
          Logga in
        </button>
      </form>
    </div>
  )
}

export function LoginFlow() {
  const { step, activeStore, activeEmployee, setStore, setEmployee, authenticate, switchStore, switchEmployee } = useSession()

  const onPin = (pin: string) => {
    return authenticate(pin)
  }

  if (step === 'store') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background p-6">
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-foreground/[0.03] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-foreground/[0.04] blur-3xl" />
        <StoreSelector onSelect={setStore} />
      </div>
    )
  }

  if (step === 'team') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background p-6">
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-foreground/[0.03] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-foreground/[0.04] blur-3xl" />
        {activeStore && (
          <TeamSelector store={activeStore} onSelect={setEmployee} onBack={switchStore} />
        )}
      </div>
    )
  }

  if (step === 'pin' && activeEmployee) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background p-6">
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-foreground/[0.03] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-foreground/[0.04] blur-3xl" />
        <PinStep employee={activeEmployee} onSubmit={onPin} onBack={switchEmployee} />
      </div>
    )
  }

  return null
}
