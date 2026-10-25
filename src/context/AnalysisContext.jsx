import { createContext, useContext, useState } from 'react'
import { useAuth } from './AuthContext'

const AnalysisContext = createContext(null)

const STORAGE_KEY = 'resumelens-last-analysis'

function readSavedAnalyses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
    // If legacy single analysis record was stored, migrate it safely to guest
    if (parsed.id && typeof parsed.id === 'string' && parsed.score !== undefined) {
      return { guest: { ...parsed, profileId: null } }
    }
    return parsed
  } catch {
    return {}
  }
}

function writeSavedAnalyses(analyses) {
  try {
    if (analyses && typeof analyses === 'object' && Object.keys(analyses).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(analyses))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    // Ignore storage errors (e.g. private mode or quota restrictions)
  }
}

export function AnalysisProvider({ children }) {
  const { user } = useAuth()
  const [analysesByProfile, setAnalysesByProfile] = useState(readSavedAnalyses)

  const activeKey = user?.id ?? 'guest'
  const profileRecord =
    analysesByProfile && typeof analysesByProfile === 'object' && !Array.isArray(analysesByProfile)
      ? analysesByProfile[activeKey]
      : null
  const currentAnalysis =
    profileRecord && typeof profileRecord === 'object' && profileRecord.id ? profileRecord : null

  const setCurrentAnalysis = (analysis) => {
    if (!analysis || typeof analysis !== 'object') return
    const record = {
      ...analysis,
      profileId: user?.id ?? null,
    }
    setAnalysesByProfile((prev) => {
      const base = prev && typeof prev === 'object' && !Array.isArray(prev) ? prev : {}
      const next = { ...base, [activeKey]: record }
      writeSavedAnalyses(next)
      return next
    })
  }

  const clearCurrentAnalysis = () => {
    setAnalysesByProfile((prev) => {
      const base = prev && typeof prev === 'object' && !Array.isArray(prev) ? prev : {}
      const next = { ...base }
      delete next[activeKey]
      writeSavedAnalyses(next)
      return next
    })
  }

  return (
    <AnalysisContext.Provider
      value={{
        currentAnalysis,
        setCurrentAnalysis,
        clearCurrentAnalysis,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  )
}

// oxlint-disable-next-line react/only-export-components
export function useAnalysis() {
  const context = useContext(AnalysisContext)
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider')
  }
  return context
}
