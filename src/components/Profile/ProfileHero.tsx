import { useSession } from '../../hooks/useSession'
import { Clock, LogOut, Sparkles } from 'lucide-react'

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

export function ProfileHero({ variant = 'full' }: { variant?: 'full' | 'compact' }) {
  const { activeEmployee, activeStore, timeLabel, logout, switchEmployee, switchStore } = useSession()
  const compact = variant === 'compact'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'God morgon' : hour < 17 ? 'God dag' : 'God kväll'

  if (compact) {
    return (
      <div className="flex items-center justify-between gap-4">
        {activeEmployee ? (
          <div key={activeEmployee.id} className="profile-enter flex items-center gap-3">
            <Avatar image={activeEmployee.image} name={activeEmployee.name} size="xs" />
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted">{greeting}</p>
              <h1 className="text-xl font-semibold tracking-tight text-foreground">{activeEmployee.name}</h1>
            </div>
            <span className="ml-1 hidden items-center gap-1 rounded-full bg-white/50 px-2.5 py-1 text-[11px] text-muted sm:inline-flex">
              <Clock className="h-3 w-3" strokeWidth={1.5} />
              {timeLabel}
            </span>
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

      {activeEmployee ? (
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
      ) : (
        <div className="profile-enter relative z-10 flex flex-col items-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-white/40 backdrop-blur-xl">
            <Sparkles className="h-7 w-7 text-foreground/30" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">Välkommen till ILVA Sales Hub</h1>
          <p className="mt-3 max-w-md text-base text-muted">Välj butik och säljare för att börja.</p>
        </div>
      )}
    </div>
  )
}
