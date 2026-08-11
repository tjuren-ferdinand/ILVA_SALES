import { cn } from '../../lib/utils'

export function ProductCredit({ className }: { className?: string }) {
  return (
    <div className={cn('select-none', className)}>
      <div className="text-sm font-medium tracking-wide text-muted/80">Noblearc</div>
      <div className="mt-0.5 text-[10px] font-normal tracking-widest text-muted/60">
        Digital product · Simon Suits
      </div>
    </div>
  )
}
