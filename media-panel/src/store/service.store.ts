import { create } from 'zustand'

interface ServiceState {
  isLive: boolean
  setLive: (value: boolean) => void
}

export const useServiceStore = create<ServiceState>((set) => ({
  isLive: false,
  setLive: (value) => set({ isLive: value }),
}))
