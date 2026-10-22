import { configureStore } from '@reduxjs/toolkit'
import historyReducer from './historySlice.js'

const STORAGE_KEY = 'resumelens-history'

export const store = configureStore({
  reducer: {
    history: historyReducer,
  },
})

// Subscribe to Redux store updates to persist history to localStorage
store.subscribe(() => {
  try {
    const state = store.getState()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.history.entries))
  } catch {
    // Ignore storage errors (e.g. quota limits or private mode)
  }
})
