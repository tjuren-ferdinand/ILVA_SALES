import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { TopBar } from './TopBar'
import { ActiveUserBadge } from './ActiveUserBadge'
import { Assistant } from '../AI/Assistant'
import { LoginFlow } from '../Session/LoginFlow'
import { useSession } from '../../hooks/useSession'

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isAuthenticated } = useSession()

  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen text-foreground">
        <LoginFlow />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen text-foreground">
      <Header onMenuClick={() => setMobileOpen(true)} />
      <ActiveUserBadge />
      <div className="flex min-h-screen flex-col md:flex-row">
        <Sidebar
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />
        <main className="relative z-10 m-4 flex-1 overflow-y-auto rounded-2xl bg-surface p-4 pt-20 shadow-2xl md:ml-[13rem] md:min-h-[calc(100vh-2rem)] md:rounded-[2rem] md:p-10 md:pt-10 print:m-0 print:ml-0 print:h-auto print:min-h-0 print:w-full print:max-w-none print:overflow-visible print:rounded-none print:bg-white print:p-0 print:shadow-none print:text-black">
          <TopBar />
          {children}
        </main>
      </div>
      <Assistant />
    </div>
  )
}
