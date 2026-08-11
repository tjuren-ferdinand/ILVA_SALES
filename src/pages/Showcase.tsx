import { useMemo, useState } from 'react'
import { PageHeader } from '../components/ui/PageHeader'
import { CopyButton } from '../components/ui/CopyButton'
import { Sofa, Share2, Monitor, Palette, ExternalLink } from 'lucide-react'

const colors = [
  { id: 'beige', name: 'Beige', value: '#d7c4b0' },
  { id: 'grå', name: 'Mörkgrå', value: '#4a4a4a' },
  { id: 'blå', name: 'Djupblå', value: '#2e4057' },
  { id: 'grön', name: 'Sage', value: '#7d8a74' },
  { id: 'brun', name: 'Cognac', value: '#8b5e3c' },
]

const materials = [
  { id: 'tyg', name: 'Tyg', texture: 'bg-gradient-to-br from-white/20 to-transparent' },
  { id: 'lader', name: 'Läder', texture: 'bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:8px_8px]' },
]

export function Showcase() {
  const [activeColor, setActiveColor] = useState(colors[0])
  const [material, setMaterial] = useState(materials[0])
  const [share, setShare] = useState(false)

  const shareText = useMemo(() => {
    return `Titta på ILVA-soffan i ${activeColor.name.toLowerCase()} ${material.name.toLowerCase()}`
  }, [activeColor, material])

  return (
    <div className="space-y-8">
      <PageHeader
        title="Visa kund"
        description="Interaktiv produktvy för kunden. Byt färg och material direkt i webbfönstret."
      />

      <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-[2.5rem] border border-white/50 bg-white/80 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center gap-2 border-b border-border bg-background/60 px-5 py-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-foreground/10" />
            <span className="h-3 w-3 rounded-full bg-foreground/10" />
            <span className="h-3 w-3 rounded-full bg-foreground/10" />
          </div>
          <div className="mx-4 flex flex-1 items-center gap-2 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs text-muted">
            <Monitor className="h-3 w-3" strokeWidth={1.5} />
            ilva.se/soffor/havanna
          </div>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2 md:p-10">
          <div className="relative aspect-[4/3] rounded-3xl bg-background p-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`relative h-40 w-64 rounded-3xl shadow-soft ${material.texture}`}
                style={{ backgroundColor: activeColor.value }}
              >
                <div className="absolute -bottom-2 left-4 h-10 w-14 rounded-2xl" style={{ backgroundColor: activeColor.value }} />
                <div className="absolute -bottom-2 right-4 h-10 w-14 rounded-2xl" style={{ backgroundColor: activeColor.value }} />
                <div className="absolute -top-10 left-2 right-2 h-14 rounded-3xl" style={{ backgroundColor: activeColor.value }} />
                <Sofa className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 text-foreground/20" strokeWidth={1} />
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <h2 className="text-2xl font-semibold text-foreground">Havanna 3-sits</h2>
            <p className="mt-2 text-muted">Soffa med hög rygg och avtagbar klädsel.</p>
            <p className="mt-4 text-2xl font-light text-foreground">14 995 kr</p>

            <div className="mt-6">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Färg</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {colors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveColor(c)}
                    aria-label={c.name}
                    className={`group flex h-11 w-11 items-center justify-center rounded-full border-2 transition ${
                      activeColor.id === c.id
                        ? 'border-foreground'
                        : 'border-transparent'
                    }`}
                  >
                    <span
                      className="h-8 w-8 rounded-full shadow-card"
                      style={{ backgroundColor: c.value }}
                    />
                  </button>
                ))}
              </div>
              <p className="mt-2 text-sm text-foreground">{activeColor.name}</p>
            </div>

            <div className="mt-6">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Material</p>
              <div className="mt-3 flex gap-2">
                {materials.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMaterial(m)}
                    className={`rounded-xl border px-4 py-2 text-sm transition ${
                      material.id === m.id
                        ? 'border-foreground bg-foreground text-surface'
                        : 'border-border bg-background text-foreground hover:bg-foreground/5'
                    }`}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShare(true)}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-foreground/5"
              >
                <Share2 className="h-4 w-4" strokeWidth={1.5} /> Dela med kund
              </button>
              {share && <CopyButton text={shareText} label="Kopiera text" />}
              <a
                href="https://ilva.se/vardagsrum/soffor/baddsoffor/innovation-living-havanna/p-b0085366-5637811326/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-foreground/5"
              >
                <ExternalLink className="h-4 w-4" strokeWidth={1.5} />
                Se på ilva.se
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="surface p-6">
        <div className="flex items-start gap-3">
          <Palette className="mt-0.5 h-5 w-5 text-muted" strokeWidth={1.5} />
          <p className="text-sm text-muted">
            Detta är en demo av produktvyn. I nästa version kan du koppla riktiga ILVA-bilder, färger och material.
          </p>
        </div>
      </div>
    </div>
  )
}
