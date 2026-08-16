import { useEffect, useRef, useState } from 'react'
import { Building2, ArrowRight, Store as StoreIcon, Lock, ArrowLeft } from 'lucide-react'
import { useSession } from '../../hooks/useSession'
import type { Store } from '../../types'

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function StorePinPrompt({
  store,
  onSubmit,
  onBack,
  error,
}: {
  store: Store
  onSubmit: (pin: string) => void
  onBack: () => void
  error?: string | null
}) {
  const [pin, setPin] = useState('')
  const [lengthError, setLengthError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (pin.length !== 4) {
      setLengthError('Ange 4 siffror')
      return
    }
    setLengthError(null)
    onSubmit(pin)
  }

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-center">
        <button
          onClick={onBack}
          className="mb-4 inline-flex items-center gap-1 text-xs text-muted transition hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} /> Tillbaka
        </button>
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/40 bg-white/40 backdrop-blur-xl">
          <span className="text-2xl font-semibold text-foreground">{initials(store.name)}</span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{store.name}</h1>
        <p className="mt-2 text-sm text-muted">Ange butikens kod.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div
          className="flex cursor-text justify-center gap-2"
          onClick={() => inputRef.current?.focus()}
          onTouchStart={() => inputRef.current?.focus()}
        >
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
          ref={inputRef}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={4}
          autoComplete="off"
          value={pin}
          onChange={(e) => {
            setPin(e.target.value.replace(/\D/g, '').slice(0, 4))
            setLengthError(null)
          }}
          className="sr-only"
          aria-label="Butikskod"
          autoFocus
        />

        {(lengthError || error) && (
          <p className="text-center text-xs text-red-600">{lengthError || error}</p>
        )}

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

function StoreSelector({ onSelect }: { onSelect: (store: Store) => void }) {
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
        {stores.map((store) => {
          const clickable = store.active
          return (
            <button
              key={store.id}
              onClick={() => clickable && onSelect(store)}
              disabled={!clickable}
              className={`group flex items-center gap-4 rounded-2xl border border-white/40 p-4 text-left shadow-soft backdrop-blur-xl transition ${
                clickable
                  ? 'bg-white/40 hover:bg-white/60 hover:shadow-card'
                  : 'cursor-not-allowed bg-white/20 opacity-60'
              }`}
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                  clickable ? 'bg-foreground text-surface' : 'bg-foreground/40 text-surface/70'
                }`}
              >
                <Building2 className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <div className="min-w-0">
                <h3 className={`font-semibold ${clickable ? 'text-foreground' : 'text-foreground/60'}`}>
                  {store.name}
                </h3>
                <p className="text-xs text-muted">{store.city} · {store.code}</p>
              </div>
              {clickable && (
                <ArrowRight
                  className="ml-auto h-4 w-4 shrink-0 text-muted transition group-hover:translate-x-0.5"
                  strokeWidth={1.5}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function LoginFlow() {
  const { setStore } = useSession()
  const [pending, setPending] = useState<Store | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSelect = (store: Store) => {
    if (!store.active) return
    if (!store.storePin) {
      setStore(store.id)
      return
    }
    setPending(store)
    setError(null)
  }

  const handlePin = (pin: string) => {
    if (!pending) return
    if (pin !== pending.storePin) {
      setError('Fel butikskod')
      return
    }
    setStore(pending.id)
  }

  if (pending) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background p-6">
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-foreground/[0.03] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-foreground/[0.04] blur-3xl" />
        <StorePinPrompt
          store={pending}
          onSubmit={handlePin}
          onBack={() => {
            setPending(null)
            setError(null)
          }}
          error={error}
        />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background p-6">
      <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-foreground/[0.03] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-foreground/[0.04] blur-3xl" />
      <StoreSelector onSelect={handleSelect} />
    </div>
  )
}
