import {
  Home,
  Search,
  Package,
  Users,
  Sofa,
  Percent,
  RotateCcw,
  CreditCard,
  Monitor,
  Phone,
  Bell,
  Star,
  Settings,
  NotebookPen,
  Tag,
  AlertCircle,
  HelpCircle,
  MessageSquare,
} from 'lucide-react'

export type NavItem = {
  label: string
  path: string
  icon: typeof Home
}

export const topNav: NavItem[] = [
  { label: 'Hem', path: '/', icon: Home },
  { label: 'Sök', path: '/search', icon: Search },
  { label: 'Ordrar', path: '/orders', icon: Package },
  { label: 'Produkter', path: '/products', icon: Sofa },
  { label: 'Kunder', path: '/customers', icon: Users },
  { label: 'Rabatter', path: '/discounts', icon: Percent },
  { label: 'Priser', path: '/prices', icon: Tag },
  { label: 'Returer', path: '/returns', icon: RotateCcw },
  { label: 'Reklamationer', path: '/reclamations', icon: AlertCircle },
  { label: 'Betalning', path: '/payment', icon: CreditCard },
  { label: 'System', path: '/systems', icon: Monitor },
  { label: 'Kontakter', path: '/contacts', icon: Phone },
  { label: 'Hjälp', path: '/help', icon: HelpCircle },
  { label: 'Uppdateringar', path: '/updates', icon: Bell },
  { label: 'Favoriter', path: '/favorites', icon: Star },
  { label: 'Anteckningar', path: '/notes', icon: NotebookPen },
  { label: 'Notiser', path: '/notifications', icon: MessageSquare },
]

export const bottomNav: NavItem[] = [
  { label: 'Inställningar', path: '/settings', icon: Settings },
]
