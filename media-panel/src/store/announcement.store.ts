import { create } from 'zustand'

interface AnnouncementState {
  drafts: string[]
  addDraft: (text: string) => void
}

export const useAnnouncementStore = create<AnnouncementState>((set) => ({
  drafts: [],
  addDraft: (text) => set((state) => ({ drafts: [...state.drafts, text] })),
}))
