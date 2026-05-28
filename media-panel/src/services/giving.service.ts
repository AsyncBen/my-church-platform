import { API_URL } from '../utils/constants'
import { useAuthStore } from '../store/auth.store'

export const givingService = {
  getAll: async (filter?: string, search?: string) => {
    const token = useAuthStore.getState().token
    const params = new URLSearchParams()
    if (filter) params.append('type', filter)
    if (search) params.append('search', search)

    const queryString = params.toString()
    const url = queryString ? `${API_URL}/giving?${queryString}` : `${API_URL}/giving`

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const json = await response.json()
    if (!response.ok) throw new Error(json.message || 'Failed to fetch givings')
    return json.data
  },

  getSummary: async () => {
    const token = useAuthStore.getState().token

    const response = await fetch(`${API_URL}/giving/summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const json = await response.json()
    if (!response.ok) throw new Error(json.message || 'Failed to fetch summary')
    return json.data
  },
}
