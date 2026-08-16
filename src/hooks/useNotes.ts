import { useCallback, useEffect, useState } from 'react'

export type Note = {
  id: string
  memberId: string
  text: string
  customerName?: string
  createdAt: number
  done: boolean
}

const STORAGE_KEY = 'ilva-seller-notes'

function readAll(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function writeAll(notes: Note[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
}

export function useNotes(memberId?: string) {
  const [notes, setNotes] = useState<Note[]>([])

  useEffect(() => {
    setNotes(readAll())
  }, [])

  const addNote = useCallback((mId: string, text: string, customerName?: string) => {
    const note: Note = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      memberId: mId,
      text,
      customerName,
      createdAt: Date.now(),
      done: false,
    }
    setNotes((prev) => {
      const next = [note, ...prev]
      writeAll(next)
      return next
    })
  }, [])

  const toggleNote = useCallback((id: string) => {
    setNotes((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, done: !n.done } : n))
      writeAll(next)
      return next
    })
  }, [])

  const removeNote = useCallback((id: string) => {
    setNotes((prev) => {
      const next = prev.filter((n) => n.id !== id)
      writeAll(next)
      return next
    })
  }, [])

  const filtered = memberId ? notes.filter((n) => n.memberId === memberId) : notes

  return {
    notes: filtered.sort((a, b) => b.createdAt - a.createdAt),
    addNote,
    toggleNote,
    removeNote,
  }
}
