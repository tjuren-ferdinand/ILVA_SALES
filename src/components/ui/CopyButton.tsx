import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export function CopyButton({
  text,
  label = 'Kopiera kod',
}: {
  text: string
  label?: string
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // fallback
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-surface shadow-card transition hover:bg-black focus:outline-none focus:ring-2 focus:ring-foreground/20"
      aria-label={`${label}: ${text}`}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" /> Kod kopierad
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" /> {label}
        </>
      )}
    </button>
  )
}
