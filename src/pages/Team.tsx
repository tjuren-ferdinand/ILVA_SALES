import { MapPin, Phone, Mail } from 'lucide-react'
import { ProfileHero } from '../components/Profile/ProfileHero'
import { useActiveUser } from '../hooks/useActiveUser'
import { useSession } from '../hooks/useSession'

export function Team() {
  const { user, timeLabel } = useActiveUser()
  const { activeStore } = useSession()

  return (
    <div className="space-y-10">
      <ProfileHero variant="full" />

      {activeStore && (
        <div className="surface p-6">
          <h2 className="text-lg font-semibold text-foreground">Kontaktuppgifter</h2>
          <div className="mt-4 space-y-3 text-sm text-muted">
            {activeStore.address && (
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4" strokeWidth={1.5} />
                {activeStore.address}
              </p>
            )}
            {activeStore.phone && (
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4" strokeWidth={1.5} />
                {activeStore.phone}
              </p>
            )}
            {activeStore.email && (
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4" strokeWidth={1.5} />
                {activeStore.email}
              </p>
            )}
          </div>
        </div>
      )}

      {user && (
        <div className="profile-enter-2 surface p-6">
          <h2 className="text-lg font-semibold text-foreground">Om denna session</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Du är inloggad som <strong className="text-foreground">{user.name}</strong>. Din session
            är aktiv i {timeLabel} till. Klicka på din profil längst upp för att byta eller logga ut.
            Efter 15 minuter utan aktivitet återgår appen automatiskt till gemensamt läge.
          </p>
        </div>
      )}
    </div>
  )
}

