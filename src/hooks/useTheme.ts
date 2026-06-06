import { useCallback, useEffect, useState } from 'react'
import type { AppTheme } from '../types'
import { useLocalStorage } from './useLocalStorage'

function getSystemTheme(): AppTheme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

type ThemeListener = (theme: AppTheme) => void
const listeners = new Set<ThemeListener>()

function emitTheme(theme: AppTheme) {
  listeners.forEach((listener) => listener(theme))
}

function subscribe(listener: ThemeListener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function applyThemeClass(theme: AppTheme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

/** Apply theme class before React paint — keeps Tailwind `dark:` in sync with stored preference. */
export function initThemeClass(): void {
  if (typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem('tinygoal-theme')
    if (raw === null) {
      applyThemeClass(getSystemTheme())
      return
    }
    const parsed = JSON.parse(raw) as AppTheme | null
    applyThemeClass(parsed === 'light' || parsed === 'dark' ? parsed : getSystemTheme())
  } catch {
    applyThemeClass(getSystemTheme())
  }
}

export function useTheme(): { theme: AppTheme; toggleTheme: () => void } {
  const [storedTheme, setStoredTheme] = useLocalStorage<AppTheme | null>('tinygoal-theme', null)
  const [syncedTheme, setSyncedTheme] = useState<AppTheme | null>(null)

  const theme: AppTheme = syncedTheme ?? storedTheme ?? getSystemTheme()

  useEffect(() => subscribe(setSyncedTheme), [])

  useEffect(() => {
    applyThemeClass(theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    const next: AppTheme = theme === 'dark' ? 'light' : 'dark'
    setStoredTheme(next)
    setSyncedTheme(next)
    emitTheme(next)
  }, [theme, setStoredTheme])

  return { theme, toggleTheme }
}
