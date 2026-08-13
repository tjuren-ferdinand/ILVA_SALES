import { useEffect, useState } from 'react'
import { useActiveUser } from '../../hooks/useActiveUser'
import { Check, Clock, LogOut, Sparkles } from 'lucide-react'

type TeamMember = {
  id: string
  name: string
  role: string
  image?: string
}

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const CATCHY_LINES = [
  'Hej, vem assisterar jag idag?',
  'Redo att göra ett kundmöte magiskt?',
  'Vem tar rodret nu?',
  'Klicka in dig — kunden väntar.',
]

function Avatar({
  image,
  name,
  size = 'md',
  ring = false,
}: {
  image?: string
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  ring?: boolean
}) {
  const [showImage, setShowImage] = useState(!!image)
  const sizes = {
    xs: 'h-12 w-12 text-[10px]',
    sm: 'h-16 w-16 text-xs',
    md: 'h-20 w-20 text-sm',
    lg: 'h-28 w-28 text-lg',
    xl: 'h-36 w-36 text-2xl',
  }
  return (
    <div
      className={`${sizes[size]} overflow-hidden rounded-full ${
        ring ? 'ring-4 ring-white/60 ring-offset-2 ring-offset-surface' : ''
      } border-2 border-white/70 bg-gradient-to-br from-background to-surface shadow-soft`}
    >
      {showImage && image ? (
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
          onLoad={() => setShowImage(true)}
          onError={() => setShowImage(false)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center font-semibold text-foreground/40">
          <span>{initials(name)}</span>
        </div>
      )}
    </div>
  )
}

export function ProfileHero({ variant = 'full' }: { variant?: 'full' | 'compact' }) {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [catchyLine, setCatchyLine] = useState(CATCHY_LINES[0])
  const { user, activate, deactivate, timeLabel } = useActiveUser()

  useEffect(() => {
    fetch('/team/team.json')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: TeamMember[]) => setMembers(data))
      .catch(() => setMembers([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!user) {
      setCatchyLine(CATCHY_LINES[Math.floor(Math.random() * CATCHY_LINES.length)])
    }
  }, [user])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'God morgon' : hour < 17 ? 'God dag' : 'God kväll'
  const compact = variant === 'compact'

  if (compact) {
    return (
      <div className="flex flex-col items-center gap-3 py-1 text-center sm:flex-row sm:justify-between sm:text-left">
        {user ? (
          <div key={user.id} className="profile-enter flex items-center gap-3">
            <Avatar image={user.image} name={user.name} size="xs" ring />
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted">{greeting}</p>
              <h1 className="text-xl font-semibold tracking-tight text-foreground">{user.name}</h1>
            </div>
            <span className="ml-1 hidden items-center gap-1 rounded-full bg-white/50 px-2.5 py-1 text-[11px] text-muted sm:inline-flex">
              <Clock className="h-3 w-3" strokeWidth={1.5} />
              {timeLabel}
            </span>
            <button
              onClick={deactivate}
              className="ml-1 rounded-full p-1.5 text-muted transition hover:bg-white/40 hover:text-foreground"
              aria-label="Byt profil"
              title="Byt profil"
            >
              <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
          </div>
        ) : (
          <div className="profile-enter">
            <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">{catchyLine}</h1>
          </div>
        )}

        {(!user || true) && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            {!user &&
              members.map((m, i) => (
                <button
                  key={m.id}
                  onClick={() => activate(m)}
                  style={{ animationDelay: `${i * 40}ms` }}
                  className="profile-card group flex items-center gap-1.5 rounded-full py-1 pl-1 pr-2.5 transition hover:bg-white/40"
                  title={m.name}
                >
                  <Avatar image={m.image} name={m.name} size="xs" />
                  <span className="text-xs font-medium text-muted transition group-hover:text-foreground">
                    {m.name}
                  </span>
                </button>
              ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/40 bg-gradient-to-br from-white/60 via-white/40 to-white/20 px-6 py-16 text-center shadow-2xl backdrop-blur-2xl md:px-12 md:py-24">
      <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-foreground/[0.03] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-72 w-72 rounded-full bg-foreground/[0.04] blur-3xl" />

      {user ? (
        <div key={user.id} className="profile-enter relative z-10 flex flex-col items-center">
          <Avatar image={user.image} name={user.name} size={compact ? 'sm' : 'xl'} ring />
          <p className={`mt-4 font-medium uppercase tracking-[0.2em] text-muted ${compact ? 'text-[10px]' : 'text-sm mt-6'}`}>
            {greeting}
          </p>
          <h1
            className={`mt-1 font-semibold tracking-tight text-foreground ${
              compact ? 'text-2xl' : 'mt-2 text-4xl md:text-5xl'
            }`}
          >
            {user.name}
          </h1>
          {!compact && <p className="mt-3 text-base text-muted">{user.role}</p>}
          <div
            className={`flex items-center gap-2 rounded-full border border-white/50 bg-white/50 text-muted backdrop-blur-xl ${
              compact ? 'mt-3 px-3 py-1 text-xs' : 'mt-6 px-4 py-2 text-sm'
            }`}
          >
            <Clock className={compact ? 'h-3 w-3' : 'h-4 w-4'} strokeWidth={1.5} />
            Aktiv · {timeLabel}
          </div>
          <button
            onClick={deactivate}
            className={`inline-flex items-center gap-2 rounded-full border border-border bg-surface font-medium text-muted transition hover:text-foreground ${
              compact ? 'mt-3 px-4 py-1.5 text-xs' : 'mt-6 px-5 py-2.5 text-sm'
            }`}
          >
            <LogOut className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} strokeWidth={1.5} />
            Byt profil
          </button>
        </div>
      ) : (
        <div className="profile-enter relative z-10 flex flex-col items-center">
          {!compact && (
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-white/40 backdrop-blur-xl">
              <Sparkles className="h-7 w-7 text-foreground/30" strokeWidth={1.5} />
            </div>
          )}
          <h1
            className={`font-semibold tracking-tight text-foreground ${
              compact ? 'text-xl md:text-2xl' : 'text-3xl md:text-4xl'
            }`}
          >
            {catchyLine}
          </h1>
          {!compact && (
            <p className="mt-3 max-w-md text-base text-muted">
              Välj din profil för att personalisera din session.
            </p>
          )}

          {loading ? (
            <div className={`mt-6 flex flex-wrap items-center justify-center gap-3 ${compact ? '' : 'mt-8'}`}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`animate-pulse rounded-full bg-white/40 ${compact ? 'h-12 w-12' : 'h-20 w-20'}`}
                />
              ))}
            </div>
          ) : (
            <div className={`flex flex-wrap items-center justify-center gap-3 ${compact ? 'mt-6' : 'mt-8 gap-4'}`}>
              {members.map((m, i) => (
                <button
                  key={m.id}
                  onClick={() => activate(m)}
                  style={{ animationDelay: `${i * 50}ms` }}
                  className="profile-card group flex flex-col items-center gap-1.5"
                  title={m.name}
                >
                  <div className="relative">
                    <Avatar image={m.image} name={m.name} size={compact ? 'xs' : 'md'} />
                    <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-surface opacity-0 shadow-lg transition group-hover:opacity-100">
                      <Check className="h-3 w-3" strokeWidth={2} />
                    </div>
                  </div>
                  {compact && (
                    <span className="text-[10px] font-medium text-muted transition group-hover:text-foreground">
                      {m.name}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
