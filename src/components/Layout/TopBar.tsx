import { GlobalSearch } from '../Search/GlobalSearch'
import { PilotLabel } from '../Branding/PilotLabel'
import { Bell, User } from 'lucide-react'

export function TopBar() {
  return (
    <div className="mb-8 hidden items-center justify-between gap-4 md:flex">
      <div className="max-w-2xl flex-1">
        <GlobalSearch variant="compact" />
      </div>
      <div className="flex items-center gap-4">
        <PilotLabel />
        <button
          className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/40 text-foreground backdrop-blur-xl transition hover:bg-white/60"
          aria-label="Notiser"
        >
          <Bell className="h-5 w-5" strokeWidth={1.5} />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-amber-500" />
        </button>
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/40 text-foreground backdrop-blur-xl transition hover:bg-white/60">
          <User className="h-5 w-5" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  )
}
