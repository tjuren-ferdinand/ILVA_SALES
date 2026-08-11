import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { TopBar } from './TopBar'
import { Assistant } from '../AI/Assistant'

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="relative min-h-screen text-foreground">
      <div className="fixed inset-0 -z-10 bg-background/40 backdrop-blur-sm" />
      <Header onMenuClick={() => setMobileOpen(true)} />
      <div className="flex min-h-screen flex-col md:flex-row md:p-6">
        <Sidebar
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />
        <main className="relative z-10 flex-1 overflow-y-auto rounded-none border border-white/30 bg-white/40 p-4 pt-20 shadow-2xl backdrop-blur-2xl md:ml-[21rem] md:my-0 md:min-h-[calc(100vh-3rem)] md:rounded-[2.5rem] md:p-10 md:pt-10">
          <TopBar />
          {children}
        </main>
      </div>
      <Assistant />
    </div>
  )
}
