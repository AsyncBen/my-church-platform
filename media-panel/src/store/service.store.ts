import { create } from 'zustand'
import { socketService } from '../services/socket'
import { useAuthStore } from './auth.store'

interface ServiceState {
  isLive:     boolean
  serviceId:  string
  title:      string
  startedAt:  string | null
  setLive:    (active: boolean) => void
}

export const useServiceStore = create<ServiceState>((set, get) => ({
  isLive:    false,
  serviceId: '',
  title:     'Sunday Morning Service',
  startedAt: null,

  setLive: (active: boolean) => {
    const user = useAuthStore.getState().user

    const payload = {
      serviceId: get().serviceId || `svc-${Date.now()}`,
      title:     get().title,
      startedBy: user?.name ?? user?.email ?? 'Unknown',
    }

    if (active) {
      socketService.emitServiceStart({
        ...payload,
        startedAt: new Date().toISOString(),
      })
      set({ isLive: true, serviceId: payload.serviceId, startedAt: new Date().toISOString() })
    } else {
      socketService.emitServiceEnd({
        ...payload,
        endedAt: new Date().toISOString(),
      })
      set({ isLive: false, startedAt: null })
    }
  },
}))