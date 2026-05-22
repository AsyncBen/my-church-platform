import { create } from 'zustand'

interface ScriptureState {
  query: string
  setQuery: (query: string) => void
}

export const useScriptureStore = create<ScriptureState>((set) => ({
  query: '',
  setQuery: (query) => set({ query }),
}))
