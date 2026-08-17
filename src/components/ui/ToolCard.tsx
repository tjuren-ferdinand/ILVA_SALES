import { ArrowUpRight, Check } from 'lucide-react'
import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'

export function ToolCard({
  title,
  description,
  href,
  file,
  command,
  icon: Icon,
}: {
  title: string
  description: string
  href?: string
  file?: string
  command?: string
  icon: LucideIcon
}) {
  const [copied, setCopied] = useState(false)

  const copyCommand = async () => {
    if (!command) return
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }

  const openFile = async () => {
    if (!file) {
      await copyCommand()
      return
    }
    const fileUrl = 'file:///' + encodeURI(file.replace(/\\/g, '/'))
    const win = window.open(fileUrl, '_blank')
    if (!win) {
      // Popup/file access blocked — give user the command to run manually
      await copyCommand()
    }
  }

  const content = (
    <div className="group surface flex items-start gap-3 rounded-2xl p-4 text-left transition-all duration-200 hover:bg-white/60">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background text-foreground">
        <Icon className="h-5 w-5" strokeWidth={1.5} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {(href || file || command) && (
            copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-600" strokeWidth={1.5} />
            ) : (
              <ArrowUpRight className="h-3.5 w-3.5 text-muted opacity-0 transition group-hover:opacity-100" strokeWidth={1.5} />
            )
          )}
        </div>
        <p className="line-clamp-2 text-[11px] leading-relaxed text-muted">{description}</p>
      </div>
    </div>
  )

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        aria-label={title}
      >
        {content}
      </a>
    )
  }

  if (file || command) {
    return (
      <button
        type="button"
        onClick={openFile}
        className="block w-full"
        aria-label={title}
      >
        <div className="relative">
          {content}
          {copied && (
            <div className="absolute right-3 top-3 text-[10px] font-medium text-emerald-600">
              Kopierat
            </div>
          )}
        </div>
      </button>
    )
  }

  return <div className="block">{content}</div>
}
