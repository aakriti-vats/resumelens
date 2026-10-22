import { createContext, useContext, useState } from 'react'

const AnalysisContext = createContext(null)

const STORAGE_KEY = 'resumelens-last-analysis'

function readSavedAnalysis() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeSavedAnalysis(value) {
  try {
    if (value) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    // Ignore storage errors (e.g. private mode or quota restrictions)
  }
}

export function AnalysisProvider({ children }) {
  const [currentAnalysis, setCurrentAnalysisState] = useState(readSavedAnalysis)

  const setCurrentAnalysis = (analysis) => {
    setCurrentAnalysisState(analysis)
    writeSavedAnalysis(analysis)
  }

  const clearCurrentAnalysis = () => {
    setCurrentAnalysisState(null)
    writeSavedAnalysis(null)
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
