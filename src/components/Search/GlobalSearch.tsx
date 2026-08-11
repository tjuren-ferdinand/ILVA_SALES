import { useState, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const suggestions = ['Leveranskod', 'Maxrabatt', 'Reklamation', 'Beställning', 'Produktinformation']

export function GlobalSearch({
  variant = 'hero',
  autoFocus = false,
  initialValue = '',
  onChange,
}: {
  variant?: 'hero' | 'compact'
  autoFocus?: boolean
  initialValue?: string
  onChange?: (value: string) => void
}) {
  const [query, setQuery] = useState(initialValue)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const handleChange = (value: string) => {
    setQuery(value)
    onChange?.(value)
    setShowSuggestions(value.trim().length === 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const applySuggestion = (text: string) => {
    setQuery(text)
    setShowSuggestions(false)
    navigate(`/search?q=${encodeURIComponent(text)}`)
    inputRef.current?.blur()
  }

  const clear = () => {
    setQuery('')
    onChange?.('')
    inputRef.current?.focus()
  }

  const isHero = variant === 'hero'

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div
        className={`group relative flex w-full items-center gap-3 rounded-2xl border border-border bg-surface shadow-card transition-all duration-200 focus-within:border-foreground/30 focus-within:shadow-soft ${
          isHero ? 'px-6 py-5' : 'px-4 py-3'
        }`}
      >
        <Search className="h-5 w-5 text-muted" strokeWidth={1.5} />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setShowSuggestions(query.trim().length === 0)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Vad letar du efter?"
          autoFocus={autoFocus}
          aria-label="Sök"
          className={`w-full border-0 bg-transparent text-foreground placeholder:text-muted focus:ring-0 ${
            isHero ? 'text-lg' : 'text-base'
          }`}
        />
        {query && (
          <button
            type="button"
            onClick={clear}
            className="rounded-full p-1 text-muted transition hover:bg-background hover:text-foreground"
            aria-label="Rensa sökning"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {showSuggestions && isHero && (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-2xl border border-border bg-surface p-2 shadow-soft">
          <p className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted">Förslag</p>
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => applySuggestion(s)}
              className="w-full rounded-xl px-3 py-2 text-left text-sm text-foreground transition hover:bg-background"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </form>
  )
}
