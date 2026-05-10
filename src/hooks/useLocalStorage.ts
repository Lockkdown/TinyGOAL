import { useCallback, useState } from 'react'

function readStored<T>(key: string, initialValue: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return initialValue
    return JSON.parse(raw) as T
  } catch {
    return initialValue
  }
}

function writeStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore quota / unavailable storage
  }
}

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [state, setState] = useState<T>(() => readStored(key, initialValue))

  const setValue = useCallback(
    (value: T) => {
      setState(value)
      writeStored(key, value)
    },
    [key],
  )

  return [state, setValue]
}
