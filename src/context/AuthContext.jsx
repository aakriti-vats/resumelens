import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'resumelens-profile'

function getProfileId(email) {
  if (!email) return null
  return `profile_${String(email).trim().toLowerCase()}`
}

function normalizeProfile(profile) {
  if (!profile || typeof profile !== 'object' || !profile.email) return null
  const email = String(profile.email).trim().toLowerCase()
  const name = String(profile.name || '').trim() || 'Demo User'
  const id = getProfileId(email)
  return {
    ...profile,
    id,
    name,
    email,
  }
}

function readSavedProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return normalizeProfile(parsed)
  } catch {
    return null
  }
}

function writeSavedProfile(profile) {
  try {
    if (profile) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    // Ignore storage quota / private browsing errors
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSavedProfile)

  const login = (profile) => {
    const normalized = normalizeProfile(profile)
    setUser(normalized)
    writeSavedProfile(normalized)
  }

  const logout = () => {
    setUser(null)
    writeSavedProfile(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// oxlint-disable-next-line react/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
