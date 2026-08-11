import {
  Home,
  Search,
  Truck,
  FileCode,
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
  Image,
} from 'lucide-react'

export type NavItem = {
  label: string
  path: string
  icon: typeof Home
}

export const topNav: NavItem[] = [
  { label: 'Hem', path: '/', icon: Home },
  { label: 'Sök', path: '/search', icon: Search },
  { label: 'Leverans', path: '/delivery', icon: Truck },
  { label: 'Koder', path: '/codes', icon: FileCode },
  { label: 'Rabatter', path: '/discounts', icon: Percent },
  { label: 'Beställningar', path: '/orders', icon: Package },
  { label: 'Produkter', path: '/products', icon: Sofa },
  { label: 'Retur & reklamation', path: '/returns', icon: RotateCcw },
  { label: 'Betalning', path: '/payment', icon: CreditCard },
  { label: 'System', path: '/systems', icon: Monitor },
  { label: 'Kontakter', path: '/contacts', icon: Phone },
  { label: 'Uppdateringar', path: '/updates', icon: Bell },
  { label: 'Visa kund', path: '/showcase', icon: Image },
  { label: 'Team', path: '/team', icon: Users },
]

export const bottomNav: NavItem[] = [
  { label: 'Favoriter', path: '/favorites', icon: Star },
  { label: 'Data & admin', path: '/settings', icon: Settings },
]
