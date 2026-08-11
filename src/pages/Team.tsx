import { useEffect, useState } from 'react'
import { PageHeader } from '../components/ui/PageHeader'

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

function Avatar({ image, name }: { image?: string; name: string }) {
  const [showImage, setShowImage] = useState(!!image)
  return (
    <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-white/70 bg-background shadow-soft ring-2 ring-white/40">
      {showImage && image ? (
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
          onLoad={() => setShowImage(true)}
          onError={() => setShowImage(false)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-foreground">
          <span className="text-xl font-semibold">{initials(name)}</span>
        </div>
      )}
    </div>
  )
}

export function Team() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/team/team.json')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: TeamMember[]) => setMembers(data))
      .catch(() => setMembers([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team"
        description="Profilbilder och kontakt för alla kollegor på ILVA Halmstad."
      />

      {loading ? (
        <p className="text-muted">Laddar...</p>
      ) : members.length === 0 ? (
        <div className="surface p-8 text-center">
          <p className="text-foreground">Inga kollegor ännu.</p>
          <p className="mt-2 text-sm text-muted">Lägg till /public/team/team.json med namn, roll och bild. Bilderna visas i runda ramar.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {members.map((m) => (
            <div key={m.id} className="surface flex flex-col items-center p-5 text-center transition hover:-translate-y-0.5 hover:shadow-soft">
              <Avatar image={m.image} name={m.name} />
              <h3 className="mt-4 text-lg font-semibold text-foreground">{m.name}</h3>
              <p className="text-sm text-muted">{m.role}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
