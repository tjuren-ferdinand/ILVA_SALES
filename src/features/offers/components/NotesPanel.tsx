import { MessageSquare, Lock } from 'lucide-react'

export function NotesPanel({
  customerNote,
  internalNote,
  onChange,
}: {
  customerNote: string
  internalNote: string
  onChange: (customerNote: string, internalNote: string) => void
}) {
  return (
    <div className="surface p-5 md:p-6">
      <h2 className="text-lg font-semibold text-foreground">Anteckningar</h2>
      <div className="mt-4 space-y-4">
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-muted">
            <MessageSquare className="h-3.5 w-3.5" strokeWidth={1.5} />
            Kommentar till kund
          </label>
          <textarea
            value={customerNote}
            onChange={(e) => onChange(e.target.value, internalNote)}
            className="mt-1 h-20 w-full resize-none rounded-2xl border border-white/40 bg-white/40 p-3 text-sm text-foreground outline-none backdrop-blur-xl placeholder:text-muted focus:border-white/60"
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-muted">
            <Lock className="h-3.5 w-3.5" strokeWidth={1.5} />
            Intern anteckning (visas ej för kund)
          </label>
          <textarea
            value={internalNote}
            onChange={(e) => onChange(customerNote, e.target.value)}
            className="mt-1 h-20 w-full resize-none rounded-2xl border border-white/40 bg-white/40 p-3 text-sm text-foreground outline-none backdrop-blur-xl placeholder:text-muted focus:border-white/60"
          />
        </div>
      </div>
    </div>
  )
}
