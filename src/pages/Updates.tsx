import { PageHeader } from '../components/ui/PageHeader'
import { UpdateCard } from '../components/ui/UpdateCard'
import { updates } from '../data/mockData'

export function Updates() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Uppdateringar"
        description="Senaste demo-ändringar som kan påverka försäljningen."
      />

      <div className="space-y-4">
        {updates.map((u) => (
          <UpdateCard key={u.id} update={u} />
        ))}
      </div>
    </div>
  )
}
