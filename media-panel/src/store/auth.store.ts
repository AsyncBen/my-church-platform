import { create } from 'zustand'
import { authService, type AuthUser } from '../services/auth.service'
import { socketService } from '../services/socket'
import type { Role } from '../types/media.types'
import { useServiceStore } from './service.store'

// Map backend role strings to media panel Role type
const mapRole = (backendRole: string): Role => {
  const map: Record<string, Role> = {
    MEDIA:     'Media',
    PASTOR:    'Pastor',
    SECRETARY: 'Secretary',
    ADMIN:     'Admin',
  }
  return map[backendRole] ?? 'Media'
}

interface AuthState {
  user:      AuthUser | null
  token:     string | null
  role:      Role
  isLoading: boolean
  error:     string
  login:     (email: string, password: string) => Promise<void>
  logout:    () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user:      null,
  token:     null,
  role:      'Media',
  isLoading: false,
  error:     '',

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: '' })
    try {
      const result = await authService.login(email, password)

      // Only allow leadership roles into the media panel
      const allowedRoles = ['MEDIA', 'PASTOR', 'SECRETARY', 'ADMIN']
      if (!allowedRoles.includes(result.user.role)) {
        throw new Error('Access denied — this panel is for leadership roles only')
      }

      const role = mapRole(result.user.role)

      // Connect socket with JWT
      socketService.connect(result.token)
      setTimeout(() => useServiceStore.getState().startListening(), 500)

      set({ user: result.user, token: result.token, role, isLoading: false, error: '' })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      set({ isLoading: false, error: message })
    }
  },

  logout: () => {
    socketService.disconnect()
    set({ user: null, token: null, role: 'Media', error: '' })
  },
}))