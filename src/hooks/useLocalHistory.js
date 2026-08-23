import { useCallback, useState } from 'react'

const STORAGE_KEY = 'resumelens-history'
const LAST_KEY = 'resumelens-last-analysis'

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function useLocalHistory() {
  const [entries, setEntries] = useState(() => readJson(STORAGE_KEY, []))

  const addEntry = useCallback((entry) => {
    const userRaw = localStorage.getItem('resumelens-user')
    let user = null
    try {
      user = userRaw ? JSON.parse(userRaw) : null
    } catch {
      user = userRaw
    }

    const record = {
      ...entry,
      id: entry.id ?? crypto.randomUUID(),
      createdAt: entry.createdAt ?? new Date().toISOString(),
      user: user ? { id: user.id, name: user.name, email: user.email } : null,
    }
    setEntries((prev) => {
      const next = [record, ...prev]
      writeJson(STORAGE_KEY, next)
      return next
    })
    writeJson(LAST_KEY, record)
    return record
  }, [])

  const removeEntry = useCallback((id) => {
    setEntries((prev) => {
      const next = prev.filter((item) => item.id !== id)
      writeJson(STORAGE_KEY, next)
      return next
    })
  }, [])

  const getLastAnalysis = useCallback(() => readJson(LAST_KEY, null), [])

  const setLastAnalysis = useCallback((entry) => {
    writeJson(LAST_KEY, entry)
  }, [])

  return { entries, addEntry, removeEntry, getLastAnalysis, setLastAnalysis }
}
