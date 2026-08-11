import { Menu, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const navigate = useNavigate()

  return (
    <header className="fixed left-4 right-4 top-4 z-40 flex h-16 items-center justify-between rounded-2xl border border-white/30 bg-white/60 px-4 shadow-soft backdrop-blur-2xl md:hidden">
      <button
        onClick={onMenuClick}
        className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition hover:bg-white/30"
        aria-label="Öppna meny"
      >
        <Menu className="h-5 w-5" strokeWidth={1.5} />
      </button>
      <div className="text-lg font-semibold tracking-tight text-foreground">ILVA</div>
      <button
        onClick={() => navigate('/search')}
        className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition hover:bg-white/30"
        aria-label="Sök"
      >
        <Search className="h-5 w-5" strokeWidth={1.5} />
      </button>
    </header>
  )
}
