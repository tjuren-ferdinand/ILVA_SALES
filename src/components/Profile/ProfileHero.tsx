import { useState } from 'react'
import { useSession } from '../../hooks/useSession'
import { Clock, LogOut, Sparkles, Users, ArrowLeft, Check, Lock } from 'lucide-react'
import type { Employee } from '../../types'

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function Avatar({ image, name, size = 'md' }: { image?: string; name: string; size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' }) {
  const sizes = {
    xs: 'h-12 w-12 text-[10px]',
    sm: 'h-16 w-16 text-xs',
    md: 'h-20 w-20 text-sm',
    lg: 'h-28 w-28 text-lg',
    xl: 'h-36 w-36 text-2xl',
  }
  return (
    <div className={`${sizes[size]} overflow-hidden rounded-full border-2 border-white/70 bg-gradient-to-br from-background to-surface shadow-soft`}>
      {image ? (
        <img src={image} alt={name} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center font-semibold text-foreground/40">
          <span>{initials(name)}</span>
        </div>
      )}
    </div>
  )
}

function TeamGrid({ team, onSelect }: { team: Employee[]; onSelect: (id: string) => void }) {
  return (
    <div className="w-full max-w-2xl space-y-6">
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
        {team
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

function PinPrompt({ employee, onSubmit, onBack }: { employee: Employee; onSubmit: (pin: string) => boolean; onBack: () => void }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)

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
          onChange={(e) => {
            setPin(e.target.value.replace(/\D/g, '').slice(0, 4))
            setError(null)
          }}
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
          Aktivera
        </button>
      </form>
    </div>
  )
}

export function ProfileHero({ variant = 'full' }: { variant?: 'full' | 'compact' }) {
  const { activeEmployee, activeStore, timeLabel, logout, switchEmployee, switchStore, setEmployee, authenticate, isEmployeeActive } = useSession()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'God morgon' : hour < 17 ? 'God dag' : 'God kväll'

  if (variant === 'compact') {
    return (
      <div className="flex items-center justify-between gap-4">
        {activeEmployee ? (
          <div key={activeEmployee.id} className="profile-enter flex items-center gap-3">
            <Avatar image={activeEmployee.image} name={activeEmployee.name} size="xs" />
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted">{greeting}</p>
              <h1 className="text-xl font-semibold tracking-tight text-foreground">{activeEmployee.name}</h1>
            </div>
            {isEmployeeActive && (
              <span className="ml-1 hidden items-center gap-1 rounded-full bg-white/50 px-2.5 py-1 text-[11px] text-muted sm:inline-flex">
                <Clock className="h-3 w-3" strokeWidth={1.5} />
                {timeLabel}
              </span>
            )}
            <button
              onClick={logout}
              className="ml-1 rounded-full p-1.5 text-muted transition hover:bg-white/40 hover:text-foreground"
              aria-label="Logga ut"
            >
              <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
          </div>
        ) : (
          <div className="profile-enter min-w-0">
            <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">Välkommen</h1>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/40 bg-gradient-to-br from-white/60 via-white/40 to-white/20 px-6 py-16 text-center shadow-2xl backdrop-blur-2xl md:px-12 md:py-24">
      <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-foreground/[0.03] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-72 w-72 rounded-full bg-foreground/[0.04] blur-3xl" />

      {activeEmployee && isEmployeeActive ? (
        <div key={activeEmployee.id} className="profile-enter relative z-10 flex flex-col items-center">
          <Avatar image={activeEmployee.image} name={activeEmployee.name} size="xl" />
          <p className="mt-6 text-sm font-medium uppercase tracking-[0.2em] text-muted">{greeting}</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">{activeEmployee.name}</h1>
          <p className="mt-3 text-base text-muted">{activeEmployee.role}</p>
          {activeStore && <p className="mt-1 text-sm text-muted">{activeStore.name}</p>}
          <div className="mt-6 flex items-center gap-2 rounded-full border border-white/50 bg-white/50 px-4 py-2 text-sm text-muted backdrop-blur-xl">
            <Clock className="h-4 w-4" strokeWidth={1.5} />
            Aktiv · {timeLabel}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={switchEmployee}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-medium text-muted transition hover:text-foreground"
            >
              Byt säljare
            </button>
            <button
              onClick={switchStore}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-medium text-muted transition hover:text-foreground"
            >
              Byt butik
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-medium text-muted transition hover:text-foreground"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.5} />
              Logga ut
            </button>
          </div>
        </div>
      ) : activeEmployee ? (
        <div className="profile-enter relative z-10 flex flex-col items-center">
          <PinPrompt employee={activeEmployee} onSubmit={authenticate} onBack={switchEmployee} />
        </div>
      ) : (
        <div className="profile-enter relative z-10 flex flex-col items-center">
          {activeStore ? (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/40 bg-white/40 backdrop-blur-xl">
                <Users className="h-7 w-7 text-foreground/40" strokeWidth={1.5} />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{activeStore.name}</h1>
              <p className="mt-2 text-sm text-muted">Välj vem du är i {activeStore.city}.</p>
              <div className="mt-8 w-full">
                <TeamGrid team={activeStore.team} onSelect={setEmployee} />
              </div>
              <div className="mt-6">
                <button
                  onClick={switchStore}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-medium text-muted transition hover:text-foreground"
                >
                  Byt butik
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-white/40 backdrop-blur-xl">
                <Sparkles className="h-7 w-7 text-foreground/30" strokeWidth={1.5} />
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">Välkommen till ILVA Sales Hub</h1>
              <p className="mt-3 max-w-md text-base text-muted">Välj butik för att börja.</p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
