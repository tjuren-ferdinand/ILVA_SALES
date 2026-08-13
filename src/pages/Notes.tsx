import { useEffect, useState } from 'react'
import { PageHeader } from '../components/ui/PageHeader'
import { useActiveUser } from '../hooks/useActiveUser'
import { useNotes } from '../hooks/useNotes'
import { Check, Plus, Trash2 } from 'lucide-react'

type TeamMember = {
  id: string
  name: string
  role: string
  image?: string
}

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function Avatar({ image, name, active }: { image?: string; name: string; active?: boolean }) {
  const [showImage, setShowImage] = useState(!!image)
  return (
    <div
      className={`h-11 w-11 overflow-hidden rounded-full border-2 bg-gradient-to-br from-background to-surface transition ${
        active ? 'border-foreground shadow-soft' : 'border-white/70'
      }`}
    >
      {showImage && image ? (
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
          onLoad={() => setShowImage(true)}
          onError={() => setShowImage(false)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-foreground/40">
          {initials(name)}
        </div>
      )}
    </div>
  )
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString('sv-SE', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function Notes() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const { user } = useActiveUser()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')

  useEffect(() => {
    fetch('/team/team.json')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: TeamMember[]) => setMembers(data))
      .catch(() => setMembers([]))
  }, [])

  useEffect(() => {
    if (!selectedId && user) setSelectedId(user.id)
  }, [user, selectedId])

  useEffect(() => {
    if (!selectedId && members.length > 0) setSelectedId(members[0].id)
  }, [members, selectedId])

  const selected = members.find((m) => m.id === selectedId)
  const { notes, addNote, toggleNote, removeNote } = useNotes(selectedId ?? undefined)

  const submit = () => {
    const text = draft.trim()
    if (!text || !selectedId) return
    addNote(selectedId, text)
    setDraft('')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Anteckningar"
        description="Personliga att-göra-anteckningar per säljare, t.ex. 'Ring Anne om kuddfodral 15/8'."
      />

      <div className="flex flex-wrap gap-2">
        {members.map((m) => (
          <button
            key={m.id}
            onClick={() => setSelectedId(m.id)}
            className={`flex items-center gap-2 rounded-full py-1 pl-1 pr-3 transition ${
              selectedId === m.id ? 'bg-foreground/5' : 'hover:bg-foreground/5'
            }`}
          >
            <Avatar image={m.image} name={m.name} active={selectedId === m.id} />
            <span className={`text-sm font-medium ${selectedId === m.id ? 'text-foreground' : 'text-muted'}`}>
              {m.name}
            </span>
          </button>
        ))}
      </div>

      {selected && (
        <div className="surface p-5">
          <div className="flex items-center gap-3">
            <Avatar image={selected.image} name={selected.name} active />
            <div>
              <h2 className="text-base font-semibold text-foreground">{selected.name}s anteckningar</h2>
              <p className="text-xs text-muted">{notes.length} st sparade</p>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              placeholder="Ring Anne om kuddfodral 15/8…"
              className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-foreground/30"
            />
            <button
              onClick={submit}
              disabled={!draft.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-surface transition disabled:opacity-30"
            >
              <Plus className="h-4 w-4" strokeWidth={1.5} />
              Lägg till
            </button>
          </div>

          <div className="mt-5 space-y-2">
            {notes.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted">Inga anteckningar än.</p>
            ) : (
              notes.map((n) => (
                <div
                  key={n.id}
                  className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/40 p-3"
                >
                  <button
                    onClick={() => toggleNote(n.id)}
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                      n.done ? 'border-foreground bg-foreground text-surface' : 'border-border text-transparent'
                    }`}
                  >
                    <Check className="h-3 w-3" strokeWidth={2.5} />
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm ${n.done ? 'text-muted line-through' : 'text-foreground'}`}>{n.text}</p>
                    <p className="mt-0.5 text-[11px] text-muted">{formatDate(n.createdAt)}</p>
                  </div>
                  <button
                    onClick={() => removeNote(n.id)}
                    className="shrink-0 rounded-full p-1.5 text-muted transition hover:bg-foreground/5 hover:text-foreground"
                    aria-label="Ta bort"
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
