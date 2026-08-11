import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { GlobalSearch } from '../components/Search/GlobalSearch'
import { SearchResultItem } from '../components/ui/SearchResultItem'
import { EmptyState } from '../components/ui/EmptyState'
import { searchItems } from '../lib/search'

export function SearchPage() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const [query, setQuery] = useState(q)

  useEffect(() => {
    setQuery(q)
  }, [q])

  const results = searchItems(query)

  const handleQueryChange = (value: string) => {
    setQuery(value)
    if (value.trim()) {
      setParams({ q: value.trim() })
    } else {
      setParams({})
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Sök
        </h1>
        <p className="mt-1 text-muted">Sök bland demo-informationen.</p>
      </div>
      <GlobalSearch variant="compact" initialValue={query} onChange={handleQueryChange} />

      {!query && (
        <div className="surface p-8 text-center">
          <p className="text-muted">Börja skriva för att se resultat.</p>
          <p className="mt-2 text-sm text-muted">Prova “leverans”, “rabatt” eller “kod”.</p>
        </div>
      )}

      {query && results.length === 0 && (
        <EmptyState title="Inga resultat" description="Inget hittades för din sökning. Prova ett annat ord." />
      )}

      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((item) => (
            <SearchResultItem key={`${item.type}:${item.id}`} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
