import { useCallback, useEffect, useRef, useState } from 'react'

const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'click', 'touchstart', 'pointerdown', 'scroll']

export function useIdle(timeoutMs = 120000, enabled = true) {
  const [idle, setIdle] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const startTimer = useCallback(() => {
    clearTimer()
    if (!enabled) return
    timerRef.current = setTimeout(() => {
      setIdle(true)
    }, timeoutMs)
  }, [clearTimer, enabled, timeoutMs])

  const wake = useCallback(() => {
    setIdle(false)
    startTimer()
  }, [startTimer])

  useEffect(() => {
    if (!enabled) {
      clearTimer()
      setIdle(false)
      return
    }

    const handleActivity = () => {
      wake()
    }

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'F8') {
        e.preventDefault()
        if (idle) {
          wake()
        } else {
          setIdle(true)
          clearTimer()
        }
        return
      }
      wake()
    }

    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true })
    })
    window.addEventListener('keydown', handleKeydown, { passive: false })

    startTimer()

    return () => {
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, handleActivity)
      })
      window.removeEventListener('keydown', handleKeydown)
      clearTimer()
    }
  }, [enabled, idle, wake, startTimer, clearTimer])

  return { idle, wake }
}
