import { api } from './api'

export const sermonService = {
  fetch: () => api.get('/sermons'),
}
