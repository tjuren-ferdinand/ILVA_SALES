import { useEffect, useRef, useState } from 'react'
import { Lock, ArrowRight } from 'lucide-react'
import { useSession } from '../hooks/useSession'

export function PinGuard({
  children,
  title = 'Låst innehåll',
  description = 'Ange din 4-siffriga PIN-kod.',
  position = 'center',
}: {
  children: React.ReactNode
  title?: string
  description?: string
  position?: 'bottom' | 'center'
}) {
  const { activeEmployee, isAuthenticated, authenticate } = useSession()
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!/^\d{4}$/.test(pin)) {
      setError('4 siffror')
      return
    }

    if (authenticate(pin)) {
      setError(null)
    } else {
      setError('Fel PIN')
      setPin('')
      inputRef.current?.focus()
    }
  }

  if (isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="relative">
      <div className="select-none blur-[1px] opacity-30">{children}</div>

      <div
        className={`absolute inset-0 z-10 flex ${
          position === 'bottom' ? 'items-end justify-center pb-6' : 'items-center justify-center'
        } bg-foreground/[0.03] backdrop-blur-sm`}
      >
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-72 space-y-3 rounded-[2rem] border border-white/30 bg-white/50 p-5 shadow-soft backdrop-blur-2xl"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/40 text-foreground">
              <Lock className="h-4 w-4" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
              <p className="text-xs text-muted">{description}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="password"
              inputMode="numeric"
              pattern="\d{4}"
              maxLength={4}
              value={pin}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, '').slice(0, 4)
                setPin(v)
                setError(null)
              }}
              placeholder="----"
              className="h-10 min-w-0 flex-1 rounded-2xl border border-border bg-background text-center text-lg tracking-[0.2em] text-foreground outline-none transition focus:border-foreground/30"
              aria-label="4-siffrig PIN-kod"
              autoFocus
            />
            <button
              type="submit"
              disabled={pin.length !== 4}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-foreground text-surface transition hover:bg-foreground/90 disabled:opacity-40"
              aria-label="Lås upp"
            >
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>

          {error && (
            <p className="text-center text-xs text-red-600">
              {error}
            </p>
          )}

          <p className="text-center text-[10px] leading-relaxed text-muted">
            Ange din 4-siffriga personliga PIN-kod för {activeEmployee?.name ?? 'säljare'}.
          </p>
        </form>
      </div>
    </div>
  )
}
