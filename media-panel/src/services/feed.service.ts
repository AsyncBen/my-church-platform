import { API_URL } from '../utils/constants'
import { useAuthStore } from '../store/auth.store'

export const feedService = {
  getAll: async () => {
    const token = useAuthStore.getState().token
    const response = await fetch(`${API_URL}/feed`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    const json = await response.json()

    if (!json.success) {
      throw new Error(json.message || 'Failed to fetch feed posts')
    }

    return json.data
  },

  create: async (data: {
    type: string
    title: string
    body: string
    imageUrl?: string
  }) => {
    const token = useAuthStore.getState().token
    const response = await fetch(`${API_URL}/feed`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    const json = await response.json()

    if (!json.success) {
      throw new Error(json.message || 'Failed to create feed post')
    }

    return json.data
  },

  delete: async (postId: string) => {
    const token = useAuthStore.getState().token
    const response = await fetch(`${API_URL}/feed/${postId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    const json = await response.json()

    if (!json.success) {
      throw new Error(json.message || 'Failed to delete feed post')
    }

    return json.data
  },

  uploadImage: async (file: File): Promise<{ url: string }> => {
    const token = useAuthStore.getState().token
    const formData = new FormData()
    formData.append('image', file)

    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type — browser sets it for FormData with boundary
      },
      body: formData,
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`Upload failed: ${response.status} ${response.statusText}`)
    }

    const json = await response.json()
    if (!json.success) {
      throw new Error(json.message || 'Failed to upload image')
    }
    return json.data
  },
}
