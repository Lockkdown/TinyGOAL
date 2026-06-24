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
  pause: () => void
  resume: () => void
} {
  const [endsAt, setEndsAt] = useState<number | null>(null)
  const [pausedRemainingMs, setPausedRemainingMs] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const finishedFiredRef = useRef(false)
  const onFinishedRef = useRef(onFinished)

  useEffect(() => {
    onFinishedRef.current = onFinished
  }, [onFinished])

  const remainingMs =
    pausedRemainingMs !== null
      ? pausedRemainingMs
      : endsAt === null
        ? durationMs
        : Math.max(0, endsAt - now)

  const status: PomodoroPhaseStatus =
    pausedRemainingMs !== null
      ? 'paused'
      : endsAt === null
        ? 'idle'
        : remainingMs > 0
          ? 'running'
          : 'finished'

  const start = useCallback(() => {
    finishedFiredRef.current = false
    setPausedRemainingMs(null)
    setEndsAt(Date.now() + durationMs)
    setNow(Date.now())
  }, [durationMs])

  const reset = useCallback(() => {
    finishedFiredRef.current = false
    setPausedRemainingMs(null)
    setEndsAt(null)
    setNow(Date.now())
  }, [])

  const pause = useCallback(() => {
    if (endsAt === null) return
    setPausedRemainingMs(Math.max(0, endsAt - Date.now()))
    setEndsAt(null)
  }, [endsAt])

  const resume = useCallback(() => {
    if (pausedRemainingMs === null) return
    setEndsAt(Date.now() + pausedRemainingMs)
    setPausedRemainingMs(null)
    setNow(Date.now())
  }, [pausedRemainingMs])

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

  return { remainingMs, status, start, reset, pause, resume }
}
