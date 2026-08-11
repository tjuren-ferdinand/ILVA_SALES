import { Package, Search } from 'lucide-react'

export function EmptyQuote({ onSearch }: { onSearch: () => void }) {
  return (
    <div className="surface p-8 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-background/50">
        <Package className="h-8 w-8 text-muted" strokeWidth={1.5} />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">Din offert är tom</h3>
      <p className="mt-1 text-sm text-muted">Sök efter en produkt för att börja.</p>
      <button
        onClick={onSearch}
        className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-foreground px-5 py-2.5 text-sm font-medium text-surface transition hover:bg-foreground/90"
      >
        <Search className="h-4 w-4" strokeWidth={1.5} />
        Lägg till produkt
      </button>
    </div>
  )
}
