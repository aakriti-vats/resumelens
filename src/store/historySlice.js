import { createSlice } from '@reduxjs/toolkit'

const STORAGE_KEY = 'resumelens-history'

function normalizeEntry(entry) {
  if (!entry || typeof entry !== 'object' || !entry.id) return null
  return {
    ...entry,
    profileId: entry.profileId ?? null,
  }
}

function readSavedHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map(normalizeEntry).filter(Boolean)
  } catch {
    return []
  }
}

const initialState = {
  entries: readSavedHistory(),
}

export const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addAnalysis: (state, action) => {
      const normalized = normalizeEntry(action.payload)
      if (normalized) {
        state.entries.unshift(normalized)
      }
    },
    deleteAnalysis: (state, action) => {
      const targetId = typeof action.payload === 'object' ? action.payload?.id : action.payload
      state.entries = state.entries.filter((entry) => entry && entry.id !== targetId)
    },
    clearHistory: (state, action) => {
      if (action && action.payload !== undefined) {
        const targetProfileId =
          typeof action.payload === 'object' ? action.payload?.profileId : action.payload
        state.entries = state.entries.filter(
          (entry) => (entry?.profileId ?? null) !== (targetProfileId ?? null)
        )
      } else {
        state.entries = []
      }
    },
  },
})

export const { addAnalysis, deleteAnalysis, clearHistory } = historySlice.actions

export const selectAllHistoryEntries = (state) => state?.history?.entries || []

export const selectHistoryEntries = (state) => state?.history?.entries || []

export const selectHistoryByProfile = (state, profileId) => {
  const targetId = profileId ?? null
  const entries = state?.history?.entries
  if (!Array.isArray(entries)) return []
  return entries.filter((entry) => entry && (entry.profileId ?? null) === targetId)
}

export default historySlice.reducer
