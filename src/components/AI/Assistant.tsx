import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Sparkles, Send, X, MessageSquare, AlertCircle, Maximize2, Minimize2 } from 'lucide-react'
import { sendChatMessage, type ChatMessage, type PageContext } from '../../lib/ai/gemini'
import { useSession } from '../../hooks/useSession'
import { topNav, bottomNav } from '../../data/navItems'

const routeLabels = new Map<string, string>([
  ...topNav.map((n) => [n.path, n.label] as [string, string]),
  ...bottomNav.map((n) => [n.path, n.label] as [string, string]),
])

function buildPageContext(pathname: string, storeName?: string, sellerName?: string): PageContext {
  const label = routeLabels.get(pathname)
  if (label) return { path: pathname, label, storeName, sellerName }
  if (pathname.startsWith('/delivery/')) return { path: pathname, label: 'Leveransdetaljer', detail: 'Visar detaljer för ett specifikt leveransalternativ', storeName, sellerName }
  return { path: pathname, label: 'ILVA Sälj-appen', storeName, sellerName }
}

export function Assistant() {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hej! Jag är din ILVA Säljassistent. Jag kan svara på allt om appen – leverans, rabatter, produkter, ordrar, returer, betalning, system, kontakter och mer. Fråga mig vad som helst!',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const { activeStore, activeEmployee } = useSession()

  useEffect(() => {
    if (open) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, open])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMessage: ChatMessage = { role: 'user', content: text }
    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setInput('')
    setError(null)
    setLoading(true)

    try {
      const pageCtx = buildPageContext(location.pathname, activeStore?.name, activeEmployee?.name)
      const answer = await sendChatMessage(nextMessages, pageCtx)
      setMessages([...nextMessages, { role: 'assistant', content: answer }])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Något gick fel.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleClose = () => {
    setOpen(false)
    setExpanded(false)
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-surface shadow-2xl transition hover:scale-105 hover:shadow-card print:hidden"
          aria-label="Öppna säljassistent"
        >
          <Sparkles className="h-5 w-5" strokeWidth={1.5} />
        </button>
      )}

      {open && (
        <div
          className={`fixed z-50 flex flex-col border border-white/50 bg-white/85 shadow-2xl backdrop-blur-2xl transition-all duration-300 print:hidden ${
            expanded
              ? 'inset-0 rounded-none p-4 md:p-6'
              : 'bottom-4 right-4 left-4 rounded-[2rem] p-4 md:bottom-6 md:right-6 md:left-auto md:h-[32rem] md:w-[26rem]'
          }`}
        >
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-surface">
                <MessageSquare className="h-4 w-4" strokeWidth={1.5} />
              </div>
              <span className="font-semibold text-foreground">ILVA Säljassistent</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setExpanded((e) => !e)}
                className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-foreground/5"
                aria-label={expanded ? 'Förminska' : 'Expandera till helskärm'}
              >
                {expanded ? (
                  <Minimize2 className="h-4 w-4 text-muted" strokeWidth={1.5} />
                ) : (
                  <Maximize2 className="h-4 w-4 text-muted" strokeWidth={1.5} />
                )}
              </button>
              <button
                onClick={handleClose}
                className="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-foreground/5"
                aria-label="Stäng"
              >
                <X className="h-4 w-4 text-muted" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-1 py-2">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'ml-auto bg-foreground text-surface'
                    : 'bg-background text-foreground'
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="w-fit rounded-2xl bg-background px-4 py-3 text-sm text-muted">
                Tänker…
              </div>
            )}
            {error && (
              <div className="flex items-start gap-2 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
                {error}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="mt-3 flex items-center gap-2 rounded-2xl border border-border bg-background p-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Fråga om vad som helst…"
              className="flex-1 bg-transparent px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-surface transition hover:bg-black disabled:opacity-40"
              aria-label="Skicka"
            >
              <Send className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
