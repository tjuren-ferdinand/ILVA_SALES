import { PageHeader } from '../components/ui/PageHeader'
import { CopyButton } from '../components/ui/CopyButton'
import { contacts } from '../data/mockData'
import { Phone, Mail, User } from 'lucide-react'

export function Contacts() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Kontakter"
        description="Demo-kontakter för olika frågor och situationer."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {contacts.map((c) => (
          <div key={c.id} className="surface p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background text-foreground">
                <User className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">{c.name}</h2>
                <p className="text-sm text-muted">{c.role} • {c.department}</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background p-3">
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Phone className="h-4 w-4 text-muted" strokeWidth={1.5} />
                  {c.phone}
                </div>
                <CopyButton text={c.phone} label="Kopiera" />
              </div>
              <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background p-3">
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Mail className="h-4 w-4 text-muted" strokeWidth={1.5} />
                  {c.email}
                </div>
                <CopyButton text={c.email} label="Kopiera" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
