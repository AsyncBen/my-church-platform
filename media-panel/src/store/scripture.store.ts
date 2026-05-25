import { create } from 'zustand'
import { socketService } from '../services/socket'

interface ScriptureState {
  lastBroadcast:      { reference: string; text: string } | null
  broadcastCount:     number
  query:              string
  activityLog:        { id: string; type: string; message: string; time: string }[]
  broadcastScripture: (reference: string, text: string) => void
  setQuery:           (query: string) => void
}

export const useScriptureStore = create<ScriptureState>((set) => ({
  lastBroadcast:  null,
  broadcastCount: 0,
  query:          '',
  activityLog:    [],

  broadcastScripture: (reference: string, text: string) => {
    socketService.emitScriptureUpdate({ reference, text })
    set((state) => ({
      lastBroadcast:  { reference, text },
      broadcastCount: state.broadcastCount + 1,
      activityLog: [
        { id: Date.now().toString(), type: 'scripture', message: `${reference} broadcast to congregation`, time: 'Just now' },
        ...state.activityLog.slice(0, 9)
      ],
    }))
  },

  setQuery: (query: string) => set({ query }),
}))