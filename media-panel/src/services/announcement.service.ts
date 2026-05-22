import { api } from './api'

export const announcementService = {
  list: () => api.get('/announcements'),
}
