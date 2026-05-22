import { api } from './api'

export const givingService = {
  report: () => api.get('/giving/reports'),
}
