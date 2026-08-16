import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { stores as allStores, getStoreById } from '../data/stores'
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

const emptySession: SessionData = {
  storeId: null,
  employeeId: null,
  authenticatedAt: null,
  expiresAt: null,
  pinAuth: false,
}

function loadSession(): SessionData {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return emptySession
    const parsed = JSON.parse(raw) as SessionData
    if (parsed.expiresAt && new Date(parsed.expiresAt).getTime() < Date.now()) return emptySession
    return parsed
  } catch {
    return emptySession
  }
}

function saveSession(data: SessionData) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(data))
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

let sessionData = loadSession()
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((fn) => fn())
}

function setSession(next: SessionData) {
  sessionData = next
  saveSession(next)
  emit()
}

function getSnapshot(): SessionData {
  return sessionData
}

function subscribe(callback: () => void) {
  listeners.add(callback)
  return () => listeners.delete(callback)
}

export function useSession() {
  const data = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const activeStore = useMemo(() => (data.storeId ? getStoreById(data.storeId) : undefined), [data.storeId])
  const activeEmployee = useMemo(
    () => activeStore?.team.find((e) => e.id === data.employeeId),
    [activeStore, data.employeeId]
  )

  const expiresAt = useMemo(() => (data.expiresAt ? new Date(data.expiresAt).getTime() : 0), [data.expiresAt])
  const isExpired = useMemo(() => (expiresAt ? now > expiresAt : true), [expiresAt, now])

  const isAuthenticated = useMemo(() => !!activeStore, [activeStore])

  const isEmployeeActive = useMemo(
    () => !!activeEmployee && data.pinAuth && !isExpired,
    [activeEmployee, data.pinAuth, isExpired]
  )

  const remainingMs = useMemo(() => Math.max(0, expiresAt - now), [expiresAt, now])
  const timeLabel = useMemo(() => {
    const m = Math.floor(remainingMs / 60000)
    const s = Math.floor((remainingMs % 60000) / 1000)
    return `${m}:${s.toString().padStart(2, '0')}`
  }, [remainingMs])

  const step = useMemo(() => {
    if (!data.storeId) return 'store'
    return 'active'
  }, [data.storeId])

  const setStore = useCallback((storeId: string) => {
    setSession({ ...sessionData, storeId, employeeId: null, authenticatedAt: null, expiresAt: null, pinAuth: false })
  }, [])

  const setEmployee = useCallback((employeeId: string) => {
    setSession({ ...sessionData, employeeId, authenticatedAt: null, expiresAt: null, pinAuth: false })
  }, [])

  const authenticate = useCallback((pin: string) => {
    const store = sessionData.storeId ? getStoreById(sessionData.storeId) : undefined
    const employee = store?.team.find((e) => e.id === sessionData.employeeId)
    if (!employee || employee.pin !== pin) return false
    const at = Date.now()
    const expires = at + SESSION_MS
    const next: SessionData = {
      ...sessionData,
      pinAuth: true,
      authenticatedAt: new Date(at).toISOString(),
      expiresAt: new Date(expires).toISOString(),
    }
    setSession(next)
    return true
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setSession(emptySession)
  }, [])

  const switchStore = useCallback(() => {
    setSession({ ...sessionData, employeeId: null, authenticatedAt: null, expiresAt: null, pinAuth: false })
  }, [])

  const switchEmployee = useCallback(() => {
    setSession({ ...sessionData, employeeId: null, authenticatedAt: null, expiresAt: null, pinAuth: false })
  }, [])

  const tick = useCallback(() => setNow(Date.now()), [])

  useEffect(() => {
    if (data.pinAuth && isExpired) {
      setSession({ ...sessionData, pinAuth: false, authenticatedAt: null, expiresAt: null })
    }
  }, [data.pinAuth, isExpired])

  return {
    stores: allStores,
    activeStore: activeStore as Store | undefined,
    activeEmployee: activeEmployee as Employee | undefined,
    isAuthenticated,
    isEmployeeActive,
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
