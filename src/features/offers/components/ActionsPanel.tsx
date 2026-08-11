import { Eye, Copy, Printer, RotateCcw, Mail, Save, History } from 'lucide-react'

export function ActionsPanel({
  onPreview,
  onCopy,
  copied,
  onPrint,
  onEmail,
  onSave,
  onHistory,
  onReset,
}: {
  onPreview: () => void
  onCopy: () => void
  copied: boolean
  onPrint: () => void
  onEmail: () => void
  onSave: () => void
  onHistory: () => void
  onReset: () => void
}) {
  return (
    <div className="surface p-5 md:p-6">
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={onPreview}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/40 bg-white/40 px-2 py-3 text-xs font-medium text-foreground backdrop-blur-xl transition hover:bg-white/60"
        >
          <Eye className="h-4 w-4" strokeWidth={1.5} />
          Visa
        </button>
        <button
          onClick={onCopy}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/40 bg-white/40 px-2 py-3 text-xs font-medium text-foreground backdrop-blur-xl transition hover:bg-white/60"
        >
          <Copy className="h-4 w-4" strokeWidth={1.5} />
          {copied ? 'Kopierat' : 'Kopiera'}
        </button>
        <button
          onClick={onEmail}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/40 bg-white/40 px-2 py-3 text-xs font-medium text-foreground backdrop-blur-xl transition hover:bg-white/60"
        >
          <Mail className="h-4 w-4" strokeWidth={1.5} />
          Mejl
        </button>
        <button
          onClick={onSave}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/40 bg-white/40 px-2 py-3 text-xs font-medium text-foreground backdrop-blur-xl transition hover:bg-white/60"
        >
          <Save className="h-4 w-4" strokeWidth={1.5} />
          Spara
        </button>
        <button
          onClick={onHistory}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/40 bg-white/40 px-2 py-3 text-xs font-medium text-foreground backdrop-blur-xl transition hover:bg-white/60"
        >
          <History className="h-4 w-4" strokeWidth={1.5} />
          Historik
        </button>
        <button
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/40 bg-white/40 px-2 py-3 text-xs font-medium text-foreground backdrop-blur-xl transition hover:bg-white/60"
        >
          <RotateCcw className="h-4 w-4" strokeWidth={1.5} />
          Ny
        </button>
        <button
          onClick={onPrint}
          className="col-span-3 inline-flex items-center justify-center gap-2 rounded-2xl bg-foreground px-4 py-3 text-sm font-medium text-surface transition hover:bg-foreground/90"
        >
          <Printer className="h-4 w-4" strokeWidth={1.5} />
          Skriv ut / PDF
        </button>
      </div>
      <p className="mt-3 text-center text-xs text-muted">Utkastet sparas automatiskt.</p>
    </div>
  )
}
