import { API_URL } from '../utils/constants'
import { useAuthStore } from '../store/auth.store'

export const sermonService = {
  getAll: async () => {
    const token = useAuthStore.getState().token
    const response = await fetch(`${API_URL}/sermons`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    const json = await response.json()

    if (!json.success) {
      throw new Error(json.message || 'Failed to fetch sermons')
    }

    return json.data
  },

  create: async (data: {
    title: string
    description?: string
    scriptureList?: string[]
    queue?: string[]
  }) => {
    const token = useAuthStore.getState().token
    const response = await fetch(`${API_URL}/sermons`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const json = await response.json()

    if (!json.success) {
      throw new Error(json.message || 'Failed to create sermon')
    }

    return json.data
  },

  updateStatus: async (id: string, status: string) => {
    const token = useAuthStore.getState().token
    const response = await fetch(`${API_URL}/sermons/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    })

    const json = await response.json()

    if (!json.success) {
      throw new Error(json.message || 'Failed to update sermon status')
    }

    return json.data
  },

  delete: async (id: string) => {
    const token = useAuthStore.getState().token
    const response = await fetch(`${API_URL}/sermons/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    const json = await response.json()

    if (!json.success) {
      throw new Error(json.message || 'Failed to delete sermon')
    }

    return json.data
  },
}