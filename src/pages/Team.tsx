import { ProfileHero } from '../components/Profile/ProfileHero'
import { useActiveUser } from '../hooks/useActiveUser'

export function Team() {
  const { user, timeLabel } = useActiveUser()

  return (
    <div className="space-y-10">
      <ProfileHero variant="full" />

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

