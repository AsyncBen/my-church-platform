import { create } from 'zustand'
import { socketService } from '../services/socket'

interface ScriptureState {
  lastBroadcast: { reference: string; text: string } | null
  broadcastCount: number
  broadcastScripture: (reference: string, text: string) => void
}

export const useScriptureStore = create<ScriptureState>((set) => ({
  lastBroadcast:  null,
  broadcastCount: 0,

  broadcastScripture: (reference: string, text: string) => {
    socketService.emitScriptureUpdate({ reference, text })
    set((state) => ({
      lastBroadcast:  { reference, text },
      broadcastCount: state.broadcastCount + 1,
    }))
  },
}))