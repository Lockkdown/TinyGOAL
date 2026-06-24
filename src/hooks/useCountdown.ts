import { useCallback, useEffect, useRef, useState } from 'react'
import type { PomodoroPhaseStatus } from '../types'

const TICK_MS = 250

export function useCountdown(
  durationMs: number,
  onFinished?: () => void,
): {
  remainingMs: number
  status: PomodoroPhaseStatus
  start: () => void
  reset: () => void
} {
  const [endsAt, setEndsAt] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const finishedFiredRef = useRef(false)
  const onFinishedRef = useRef(onFinished)

  useEffect(() => {
    onFinishedRef.current = onFinished
  }, [onFinished])

  const remainingMs =
    endsAt === null ? durationMs : Math.max(0, endsAt - now)

  const status: PomodoroPhaseStatus =
    endsAt === null
      ? 'idle'
      : remainingMs > 0
        ? 'running'
        : 'finished'

  const start = useCallback(() => {
    finishedFiredRef.current = false
    setEndsAt(Date.now() + durationMs)
    setNow(Date.now())
  }, [durationMs])

  const reset = useCallback(() => {
    finishedFiredRef.current = false
    setEndsAt(null)
    setNow(Date.now())
  }, [])

  useEffect(() => {
    if (endsAt === null) return

    const id = window.setInterval(() => {
      setNow(Date.now())
    }, TICK_MS)

    return () => window.clearInterval(id)
  }, [endsAt])

  useEffect(() => {
    if (endsAt === null || remainingMs > 0) return
    if (finishedFiredRef.current) return

    finishedFiredRef.current = true
    onFinishedRef.current?.()
    setEndsAt(null)
  }, [endsAt, remainingMs])

  return { remainingMs, status, start, reset }
}
