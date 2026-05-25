import { API_URL } from '../utils/constants'
import { useAuthStore } from '../store/auth.store'
import { socketService } from './socket'

export const announcementService = {
  getAll: async () => {
    const token = useAuthStore.getState().token
    const response = await fetch(`${API_URL}/announcements`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    const json = await response.json()

    if (!json.success) {
      throw new Error(json.message || 'Failed to fetch announcements')
    }

    return json.data
  },

  create: async (data: {
    title: string
    body: string
    category: string
    scheduledAt?: string
  }) => {
    const token = useAuthStore.getState().token
    const response = await fetch(`${API_URL}/announcements`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const json = await response.json()

    if (!json.success) {
      throw new Error(json.message || 'Failed to create announcement')
    }

    return json.data
  },

  send: async (id: string) => {
    const token = useAuthStore.getState().token
    const response = await fetch(`${API_URL}/announcements/${id}/send`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    const json = await response.json()

    if (!json.success) {
      throw new Error(json.message || 'Failed to send announcement')
    }

    // Emit via socket after successful send
    const announcement = json.data
    const user = useAuthStore.getState().user

    socketService.emitAnnouncement({
      id: announcement.id,
      title: announcement.title,
      body: announcement.body,
      postedBy: user?.name || user?.email || 'Unknown',
      postedAt: new Date().toISOString(),
    })

    return json.data
  },

  delete: async (id: string) => {
    const token = useAuthStore.getState().token
    const response = await fetch(`${API_URL}/announcements/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    const json = await response.json()

    if (!json.success) {
      throw new Error(json.message || 'Failed to delete announcement')
    }

    return json.data
  },
}