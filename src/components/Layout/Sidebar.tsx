import { NavLink } from 'react-router-dom'
import { X } from 'lucide-react'
import { topNav, bottomNav } from '../../data/navItems'
import { ProductCredit } from '../Branding/ProductCredit'

export function Sidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean
  onClose: () => void
}) {
  return (
    <>
      <aside className="fixed left-6 top-6 z-30 hidden h-[calc(100vh-3rem)] w-72 flex-col rounded-[2rem] border border-white/30 bg-white/40 p-6 shadow-2xl backdrop-blur-2xl md:flex print:hidden">
        <div className="mb-8 select-none px-2">
          <div className="text-2xl font-semibold tracking-tight text-foreground">ILVA</div>
          <div className="text-sm font-medium text-muted">Sales Hub</div>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto" aria-label="Huvudnavigering">
          {topNav.map((item) => (
            <NavItem key={item.path} item={item} onClick={undefined} />
          ))}
        </nav>
        <nav className="space-y-1 border-t border-white/20 pt-4" aria-label="Sekundär navigering">
          {bottomNav.map((item) => (
            <NavItem key={item.path} item={item} onClick={undefined} />
          ))}
        </nav>
        <ProductCredit className="mt-8" />
      </aside>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-foreground/10 backdrop-blur-sm md:hidden"
            onClick={onClose}
          />
          <aside className="fixed left-0 top-0 z-50 h-full w-72 max-w-[80vw] flex-col rounded-r-[2rem] border-r border-white/30 bg-white/80 p-6 shadow-2xl backdrop-blur-2xl md:hidden flex">
            <div className="mb-6 flex items-center justify-between px-2">
              <div className="select-none">
                <div className="text-2xl font-semibold tracking-tight text-foreground">ILVA</div>
                <div className="text-sm font-medium text-muted">Sales Hub</div>
              </div>
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition hover:bg-white/30"
                aria-label="Stäng meny"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto" aria-label="Huvudnavigering">
              {topNav.map((item) => (
                <NavItem key={item.path} item={item} onClick={onClose} />
              ))}
            </nav>
            <nav className="space-y-1 border-t border-white/20 pt-4" aria-label="Sekundär navigering">
              {bottomNav.map((item) => (
                <NavItem key={item.path} item={item} onClick={onClose} />
              ))}
            </nav>
          </aside>
        </>
      )}
    </>
  )
}

function NavItem({
  item,
  onClick,
}: {
  item: (typeof topNav)[number]
  onClick?: () => void
}) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
          isActive
            ? 'bg-white/80 text-foreground shadow-card'
            : 'text-muted hover:bg-white/40 hover:text-foreground'
        }`
      }
    >
      <Icon className="h-[1.1rem] w-[1.1rem]" strokeWidth={1.5} />
      <span>{item.label}</span>
    </NavLink>
  )
}
