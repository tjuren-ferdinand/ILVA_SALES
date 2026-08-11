import { Eye, Copy, Printer, RotateCcw } from 'lucide-react'

export function ActionsPanel({
  onPreview,
  onCopy,
  copied,
  onPrint,
  onReset,
}: {
  onPreview: () => void
  onCopy: () => void
  copied: boolean
  onPrint: () => void
  onReset: () => void
}) {
  return (
    <div className="surface p-5 md:p-6">
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onPreview}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/40 bg-white/40 px-4 py-3 text-sm font-medium text-foreground backdrop-blur-xl transition hover:bg-white/60"
        >
          <Eye className="h-4 w-4" strokeWidth={1.5} />
          Förhandsvisa
        </button>
        <button
          onClick={onCopy}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/40 bg-white/40 px-4 py-3 text-sm font-medium text-foreground backdrop-blur-xl transition hover:bg-white/60"
        >
          <Copy className="h-4 w-4" strokeWidth={1.5} />
          {copied ? 'Kopierad' : 'Kopiera'}
        </button>
        <button
          onClick={onPrint}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-foreground px-4 py-3 text-sm font-medium text-surface transition hover:bg-foreground/90"
        >
          <Printer className="h-4 w-4" strokeWidth={1.5} />
          Skriv ut
        </button>
        <button
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/40 bg-white/40 px-4 py-3 text-sm font-medium text-foreground backdrop-blur-xl transition hover:bg-white/60"
        >
          <RotateCcw className="h-4 w-4" strokeWidth={1.5} />
          Ny offert
        </button>
      </div>
      <p className="mt-3 text-center text-xs text-muted">Utkastet sparas automatiskt.</p>
    </div>
  )
}
