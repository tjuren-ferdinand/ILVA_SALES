import { useEffect, useRef, useState } from 'react'
import { Bell, User, LogOut, X, Store, ArrowRightLeft } from 'lucide-react'
import { GlobalSearch } from '../Search/GlobalSearch'
import { useSession } from '../../hooks/useSession'

function useClickOutside(ref: React.RefObject<HTMLElement | null>, onClose: () => void) {
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [ref, onClose])
}

export function TopBar() {
  const [showNotis, setShowNotis] = useState(false)
  const [showUser, setShowUser] = useState(false)
  const notisRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)
  const { activeStore, activeEmployee, isEmployeeActive, timeLabel, switchStore, logout } = useSession()

  useClickOutside(notisRef, () => setShowNotis(false))
  useClickOutside(userRef, () => setShowUser(false))

  return (
    <div className="mb-8 hidden items-center justify-between gap-4 md:flex print:hidden">
      <div className="max-w-2xl flex-1">
        <GlobalSearch variant="compact" />
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 rounded-2xl border border-white/40 bg-white/40 px-3 py-1.5 text-sm text-foreground backdrop-blur-xl">
          <Store className="h-4 w-4 text-muted" strokeWidth={1.5} />
          <span className="font-medium">{activeStore?.name}</span>
          {isEmployeeActive && (
            <>
              <span className="text-xs text-muted">· {activeEmployee?.name}</span>
              <span className="hidden text-xs text-muted lg:inline">· {timeLabel}</span>
            </>
          )}
        </div>

        <div ref={notisRef} className="relative">
          <button
            onClick={() => {
              setShowNotis((s) => !s)
              setShowUser(false)
            }}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/40 text-foreground backdrop-blur-xl transition hover:bg-white/60"
            aria-label="Notiser"
          >
            <Bell className="h-5 w-5" strokeWidth={1.5} />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-amber-500" />
          </button>

          {showNotis && (
            <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-2xl border border-white/40 bg-white/85 p-4 shadow-2xl backdrop-blur-2xl">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">Notiser</span>
                <button onClick={() => setShowNotis(false)} aria-label="Stäng" className="text-muted transition hover:text-foreground">
                  <X className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
              <p className="text-sm text-muted">Inga nya notiser just nu.</p>
            </div>
          )}
        </div>

        <div ref={userRef} className="relative">
          <button
            onClick={() => {
              setShowUser((s) => !s)
              setShowNotis(false)
            }}
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/40 text-foreground backdrop-blur-xl transition hover:bg-white/60"
            aria-label="Min profil"
          >
            <User className="h-5 w-5" strokeWidth={1.5} />
          </button>

          {showUser && (
            <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-white/40 bg-white/85 p-3 shadow-2xl backdrop-blur-2xl">
              <button
                onClick={() => {
                  setShowUser(false)
                  switchStore()
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-foreground transition hover:bg-white/50"
              >
                <ArrowRightLeft className="h-4 w-4" strokeWidth={1.5} />
                Byt butik
              </button>
              <button
                onClick={() => {
                  setShowUser(false)
                  logout()
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-foreground transition hover:bg-white/50"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.5} />
                Logga ut
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
