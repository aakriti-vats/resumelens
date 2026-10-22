import { createSlice } from '@reduxjs/toolkit'

const STORAGE_KEY = 'resumelens-history'

function readSavedHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
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
      state.entries.unshift(action.payload)
    },
    deleteAnalysis: (state, action) => {
      state.entries = state.entries.filter((entry) => entry.id !== action.payload)
    },
    clearHistory: (state) => {
      state.entries = []
    },
  },
})

export const { addAnalysis, deleteAnalysis, clearHistory } = historySlice.actions

export const selectHistoryEntries = (state) => state.history.entries

export default historySlice.reducer
