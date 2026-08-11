import { cn } from '../../lib/utils'

export function PilotLabel({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'select-none text-[10px] font-medium uppercase tracking-[0.25em] text-muted/70',
        className
      )}
      aria-label="Pilotbutik Halmstad"
    >
      Pilotbutik · Halmstad
    </span>
  )
}
