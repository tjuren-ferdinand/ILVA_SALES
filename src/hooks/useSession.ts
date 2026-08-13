import { useCallback, useEffect, useMemo, useState } from 'react'
import { activeStores, getStoreById } from '../data/stores'
import type { Employee, Store } from '../types'

const SESSION_KEY = 'ilva-session'
const SESSION_MS = 15 * 60 * 1000

type SessionData = {
  storeId: string | null
  employeeId: string | null
  authenticatedAt: string | null
  expiresAt: string | null
  pinAuth: boolean
}

function loadSession(): SessionData | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as SessionData
  } catch {
    return null
  }
}

function saveSession(data: SessionData) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(data))
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

export function useSession() {
  const [session, setSession] = useState<SessionData>(
    () =>
      loadSession() ?? {
        storeId: null,
        employeeId: null,
        authenticatedAt: null,
        expiresAt: null,
        pinAuth: false,
      }
  )
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const activeStore = useMemo(() => (session.storeId ? getStoreById(session.storeId) : undefined), [session.storeId])
  const activeEmployee = useMemo(
    () => activeStore?.team.find((e) => e.id === session.employeeId),
    [activeStore, session.employeeId]
  )

  const expiresAt = useMemo(() => (session.expiresAt ? new Date(session.expiresAt).getTime() : 0), [session.expiresAt])
  const isExpired = useMemo(() => (expiresAt ? now > expiresAt : true), [expiresAt, now])

  const isAuthenticated = useMemo(
    () => !!activeStore && !!activeEmployee && session.pinAuth && !isExpired,
    [activeStore, activeEmployee, session.pinAuth, isExpired]
  )

  const remainingMs = useMemo(() => Math.max(0, expiresAt - now), [expiresAt, now])
  const timeLabel = useMemo(() => {
    const m = Math.floor(remainingMs / 60000)
    const s = Math.floor((remainingMs % 60000) / 1000)
    return `${m}:${s.toString().padStart(2, '0')}`
  }, [remainingMs])

  const step = useMemo(() => {
    if (!session.storeId) return 'store'
    if (!session.employeeId) return 'team'
    if (!session.pinAuth || isExpired) return 'pin'
    return 'active'
  }, [session.storeId, session.employeeId, session.pinAuth, isExpired])

  const setStore = useCallback((storeId: string) => {
    const next = { storeId, employeeId: null, authenticatedAt: null, expiresAt: null, pinAuth: false }
    setSession(next)
    saveSession(next)
  }, [])

  const setEmployee = useCallback((employeeId: string) => {
    setSession((s) => {
      const next = { ...s, employeeId, authenticatedAt: null, expiresAt: null, pinAuth: false }
      saveSession(next)
      return next
    })
  }, [])

  const authenticate = useCallback(
    (pin: string) => {
      if (!activeEmployee) return false
      if (activeEmployee.pin !== pin) return false
      const at = Date.now()
      const expires = at + SESSION_MS
      const next: SessionData = {
        ...session,
        pinAuth: true,
        authenticatedAt: new Date(at).toISOString(),
        expiresAt: new Date(expires).toISOString(),
      }
      setSession(next)
      saveSession(next)
      return true
    },
    [activeEmployee, session]
  )

  const logout = useCallback(() => {
    clearSession()
    setSession({
      storeId: null,
      employeeId: null,
      authenticatedAt: null,
      expiresAt: null,
      pinAuth: false,
    })
  }, [])

  const switchStore = useCallback(() => {
    setSession((s) => {
      const next = { ...s, employeeId: null, authenticatedAt: null, expiresAt: null, pinAuth: false }
      saveSession(next)
      return next
    })
  }, [])

  const switchEmployee = useCallback(() => {
    setSession((s) => {
      const next = { ...s, employeeId: null, authenticatedAt: null, expiresAt: null, pinAuth: false }
      saveSession(next)
      return next
    })
  }, [])

  const tick = useCallback(() => setNow(Date.now()), [])

  useEffect(() => {
    if (isAuthenticated) return
    if (session.employeeId && isExpired) {
      setSession((s) => {
        const next = { ...s, employeeId: null, authenticatedAt: null, expiresAt: null, pinAuth: false }
        saveSession(next)
        return next
      })
    }
  }, [isAuthenticated, isExpired, session.employeeId])

  return {
    stores: activeStores,
    activeStore: activeStore as Store | undefined,
    activeEmployee: activeEmployee as Employee | undefined,
    isAuthenticated,
    step,
    setStore,
    setEmployee,
    authenticate,
    logout,
    switchStore,
    switchEmployee,
    timeLabel,
    remainingMs,
    tick,
  }
}
