import { useCallback, useEffect, useState } from 'react'

export type ActiveUser = {
  id: string
  name: string
  role: string
  image?: string
}

const STORAGE_KEY = 'ilva-active-user'
const SESSION_MS = 15 * 60 * 1000 // 15 minutes

function readStored(): { user: ActiveUser | null; at: number } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed.user) return null
    return { user: parsed.user, at: parsed.at ?? 0 }
  } catch {
    return null
  }
}

function writeStored(user: ActiveUser | null) {
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, at: Date.now() }))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export function useActiveUser() {
  const [user, setUser] = useState<ActiveUser | null>(null)
  const [remaining, setRemaining] = useState(SESSION_MS)

  const activate = useCallback((u: ActiveUser) => {
    setUser(u)
    writeStored(u)
    setRemaining(SESSION_MS)
  }, [])

  const deactivate = useCallback(() => {
    setUser(null)
    writeStored(null)
    setRemaining(0)
  }, [])

  useEffect(() => {
    const stored = readStored()
    if (stored && stored.user) {
      const elapsed = Date.now() - stored.at
      if (elapsed < SESSION_MS) {
        setUser(stored.user)
        setRemaining(SESSION_MS - elapsed)
      } else {
        writeStored(null)
      }
    }
  }, [])

  useEffect(() => {
    if (!user) return
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1000) {
          setUser(null)
          writeStored(null)
          return 0
        }
        return prev - 1000
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [user])

  const minutes = Math.floor(remaining / 60000)
  const seconds = Math.floor((remaining % 60000) / 1000)

  return {
    user,
    activate,
    deactivate,
    remaining,
    timeLabel: `${minutes}:${seconds.toString().padStart(2, '0')}`,
  }
}
