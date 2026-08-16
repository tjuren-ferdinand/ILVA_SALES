import {
  Home,
  Search,
  Truck,
  Percent,
  Package,
  Sofa,
  RotateCcw,
  CreditCard,
  Monitor,
  Phone,
  Bell,
  Star,
  Settings,
  Users,
  FileText,
  NotebookPen,
  Wallet,
} from 'lucide-react'

export type NavItem = {
  label: string
  path: string
  icon: typeof Home
}

export const topNav: NavItem[] = [
  { label: 'Hem', path: '/', icon: Home },
  { label: 'Offert', path: '/offert', icon: FileText },
  { label: 'Resurs', path: '/resurs', icon: Wallet },
  { label: 'Sök', path: '/search', icon: Search },
  { label: 'Leverans', path: '/delivery', icon: Truck },
  { label: 'Rabatter', path: '/discounts', icon: Percent },
  { label: 'Beställningar', path: '/orders', icon: Package },
  { label: 'Produkter', path: '/products', icon: Sofa },
  { label: 'Returer', path: '/returns', icon: RotateCcw },
  { label: 'Betalning', path: '/payment', icon: CreditCard },
  { label: 'System', path: '/systems', icon: Monitor },
  { label: 'Kontakter', path: '/contacts', icon: Phone },
  { label: 'Uppdateringar', path: '/updates', icon: Bell },
  { label: 'Profil', path: '/team', icon: Users },
  { label: 'Anteckningar', path: '/notes', icon: NotebookPen },
]

export const bottomNav: NavItem[] = [
  { label: 'Favoriter', path: '/favorites', icon: Star },
  { label: 'Data & admin', path: '/settings', icon: Settings },
]
