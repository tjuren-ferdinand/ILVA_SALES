import { useMemo, useRef, useState } from 'react'
import { PageHeader } from '../components/ui/PageHeader'
import { Badge } from '../components/ui/Badge'
import {
  deliveryOptions,
  codes,
  discounts,
  productRules,
  orderProcedures,
  returnProcedures,
  systems,
  contacts,
  updates,
  saveAppData,
  resetAppData,
} from '../data/mockData'
import type { AppData } from '../types'
import { Download, Upload, RotateCcw, Save, AlertCircle } from 'lucide-react'

export function Settings() {
  const fileRef = useRef<HTMLInputElement>(null)

  const currentData: AppData = useMemo(
    () => ({
      deliveryOptions,
      codes,
      discounts,
      productRules,
      orderProcedures,
      returnProcedures,
      systems,
      contacts,
      updates,
    }),
    []
  )

  const [json, setJson] = useState(() => JSON.stringify(currentData, null, 2))
  const [error, setError] = useState<string | null>(null)

  const handleSave = () => {
    try {
      const parsed = JSON.parse(json) as AppData
      saveAppData(parsed)
      setError(null)
      window.location.reload()
    } catch (e) {
      setError('Ogiltig JSON. Kontrollera syntaxen.')
    }
  }

  const handleReset = () => {
    if (confirm('Återställ allt till ursprungsdata?')) {
      resetAppData()
      window.location.reload()
    }
  }

  const handleDownload = () => {
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ilva-data.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = String(ev.target?.result ?? '')
      setJson(text)
      setError(null)
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data & admin"
        description="Redigera leverans, rabatter, koder och allt annat. Sparas lokalt i din webbläsare."
      />

      <div className="surface flex items-start gap-4 border-l-4 border-l-amber-400 p-5">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" strokeWidth={1.5} />
        <p className="text-sm leading-relaxed text-foreground">
          Detta är admin-läget. Alla ändringar skrivs till <code className="rounded bg-background px-1 py-0.5 text-xs">localStorage</code> och ersätter grunddatan. Klicka på <strong>Återställ</strong> för att gå tillbaka.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-surface shadow-card transition hover:bg-black"
        >
          <Save className="h-4 w-4" strokeWidth={1.5} /> Spara & ladda om
        </button>
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-foreground/5"
        >
          <Download className="h-4 w-4" strokeWidth={1.5} /> Exportera JSON
        </button>
        <button
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-foreground/5"
        >
          <Upload className="h-4 w-4" strokeWidth={1.5} /> Importera JSON
        </button>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-foreground/5"
        >
          <RotateCcw className="h-4 w-4" strokeWidth={1.5} /> Återställ
        </button>
        <input ref={fileRef} type="file" accept="application/json" onChange={handleFile} className="hidden" />
      </div>

      {error && (
        <div className="surface border-l-4 border-l-amber-400 p-4 text-sm text-amber-700">
          {error}
        </div>
      )}

      <div className="surface p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Redigera JSON</h2>
          <Badge>Admin</Badge>
        </div>
        <textarea
          value={json}
          onChange={(e) => setJson(e.target.value)}
          className="h-[28rem] w-full rounded-2xl border border-border bg-background p-4 font-mono text-xs text-foreground outline-none focus:border-foreground/30"
          spellCheck={false}
        />
      </div>
    </div>
  )
}
