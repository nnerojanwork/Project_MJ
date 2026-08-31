import { useEffect, useState } from 'react'

const PREFIX = 'tennisfit.'

export function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (raw == null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function saveJSON(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // storage unavailable (private mode, quota) — fail silently, in-memory state still works
  }
}

// Persistent state backed by localStorage. Lazily reads on mount and writes
// on every change, so data survives reloads without an explicit save step.
export function usePersistentState(key, initial) {
  const [state, setState] = useState(() => loadJSON(key, typeof initial === 'function' ? initial() : initial))

  useEffect(() => {
    saveJSON(key, state)
  }, [key, state])

  return [state, setState]
}
