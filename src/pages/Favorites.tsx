import { PageHeader } from '../components/ui/PageHeader'
import { SearchResultItem } from '../components/ui/SearchResultItem'
import { EmptyState } from '../components/ui/EmptyState'
import { useFavorites } from '../hooks/useFavorites'
import { searchIndex } from '../data/mockData'

export function Favorites() {
  const { keys } = useFavorites()

  const favoriteItems = searchIndex.filter((item) =>
    keys.includes(`${item.type}:${item.id}`)
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Favoriter"
        description="Sparad information för snabb åtkomst."
      />

      {favoriteItems.length === 0 ? (
        <EmptyState
          title="Inga favoriter ännu"
          description="Stjärnmarkera information du använder ofta, så dyker den upp här."
        />
      ) : (
        <div className="space-y-3">
          {favoriteItems.map((item) => (
            <SearchResultItem key={`${item.type}:${item.id}`} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
