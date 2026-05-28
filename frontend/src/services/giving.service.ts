import { API_URL } from '../constants'

export const givingService = {
  submit: async (
    data: {
      category: string
      amount: number
      reference?: string
      note?: string
      service: string
    },
    token: string
  ) => {
    const response = await fetch(`${API_URL}/giving`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    const json = await response.json()
    if (!response.ok) throw new Error(json.message || 'Failed to submit giving')
    return json.data
  },

  getMyHistory: async (token: string) => {
    const response = await fetch(`${API_URL}/giving/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const json = await response.json()
    if (!response.ok) throw new Error(json.message || 'Failed to fetch history')
    return json.data
  },
}
