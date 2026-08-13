import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useActiveUser } from '../../hooks/useActiveUser'
import { LogOut, ChevronDown } from 'lucide-react'

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function ActiveUserBadge() {
  const { user, deactivate, timeLabel } = useActiveUser()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  if (!user) return null

  return (
    <div className="fixed right-4 top-4 z-50 hidden md:block print:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 rounded-full border border-white/40 bg-white/60 py-1.5 pl-1.5 pr-4 shadow-soft backdrop-blur-2xl transition hover:bg-white/80"
      >
        <div className="h-9 w-9 overflow-hidden rounded-full border-2 border-white/70 bg-gradient-to-br from-background to-surface">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-foreground/40">
              {initials(user.name)}
            </div>
          )}
        </div>
        <div className="text-left">
          <p className="text-xs font-semibold leading-tight text-foreground">{user.name}</p>
          <p className="text-[10px] leading-tight text-muted">{timeLabel}</p>
        </div>
        <ChevronDown
          className={`h-3.5 w-3.5 text-muted transition ${open ? 'rotate-180' : ''}`}
          strokeWidth={1.5}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-14 z-50 w-56 overflow-hidden rounded-2xl border border-white/40 bg-white/80 shadow-2xl backdrop-blur-2xl">
            <div className="border-b border-border/40 p-4">
              <p className="text-sm font-semibold text-foreground">{user.name}</p>
              <p className="text-xs text-muted">{user.role}</p>
              <p className="mt-2 text-xs text-muted">Session: {timeLabel} kvar</p>
            </div>
            <div className="p-2">
              <button
                onClick={() => {
                  navigate('/team')
                  setOpen(false)
                }}
                className="w-full rounded-xl px-3 py-2 text-left text-sm text-foreground transition hover:bg-foreground/5"
              >
                Byt profil
              </button>
              <button
                onClick={() => {
                  deactivate()
                  setOpen(false)
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-muted transition hover:bg-foreground/5 hover:text-foreground"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.5} />
                Logga ut
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
