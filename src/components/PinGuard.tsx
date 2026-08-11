import { useEffect, useRef, useState } from 'react'
import { Lock, ArrowRight } from 'lucide-react'

const STORAGE_KEY = 'ilva-employee-pins'

function loadPins(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed.filter((p) => /^\d{4}$/.test(p))
  } catch {
    /* ignore */
  }
  return []
}

function savePins(pins: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pins))
  } catch {
    /* ignore */
  }
}

export function PinGuard({
  children,
  title = 'Maxrabatter',
  description = 'Ange din personliga 4-siffriga PIN-kod för att se rabatterna.',
}: {
  children: React.ReactNode
  title?: string
  description?: string
}) {
  const [pins, setPins] = useState<string[]>(() => loadPins())
  const [unlocked, setUnlocked] = useState(false)
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [hint, setHint] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!/^\d{4}$/.test(pin)) {
      setError('Ange exakt 4 siffror.')
      return
    }

    if (pins.length === 0) {
      const first = [pin]
      savePins(first)
      setPins(first)
      setUnlocked(true)
      setHint('Din PIN-kod har sparats på denna enhet.')
      return
    }

    if (pins.includes(pin)) {
      setUnlocked(true)
      setError(null)
      setHint(null)
    } else {
      setError('Fel PIN-kod.')
      setPin('')
      inputRef.current?.focus()
    }
  }

  if (unlocked) {
    return <>{children}</>
  }

  return (
    <div className="relative">
      <div className="blur-[2px] select-none opacity-40">{children}</div>

      <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl">
        <form
          onSubmit={handleSubmit}
          className="surface w-full max-w-sm space-y-5 rounded-[2rem] border border-white/40 p-6 shadow-2xl backdrop-blur-2xl md:p-8"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100/50 text-amber-700">
            <Lock className="h-6 w-6" strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="mt-1 text-sm text-muted">{description}</p>
          </div>

          <div className="relative mx-auto w-fit">
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmit()
              }}
              className="h-14 w-44 rounded-2xl border border-border bg-background text-center text-2xl tracking-[0.5em] text-foreground outline-none transition focus:border-foreground/30"
              aria-label="4-siffrig PIN-kod"
              autoFocus
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-4 opacity-0" />
          </div>

          {hint && (
            <p className="text-center text-xs text-amber-700">{hint}</p>
          )}
          {error && (
            <p className="text-center text-xs text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={pin.length !== 4}
            className="mx-auto flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground px-6 py-3 text-sm font-medium text-surface transition hover:bg-foreground/90 disabled:opacity-40"
          >
            Lås upp
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </button>

          <p className="text-center text-xs text-muted">
            PIN-koder hanteras lokalt på enheten.
          </p>
        </form>
      </div>
    </div>
  )
}
