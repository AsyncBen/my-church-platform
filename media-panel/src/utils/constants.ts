export const API_URL = 'https://expert-dollop-4qjj9jpgv5rg2757q-4000.app.github.dev'
export const SOCKET_URL = 'https://expert-dollop-4qjj9jpgv5rg2757q-4000.app.github.dev'

export const API_ROUTES = {
  auth: {
    login:    `${API_URL}/auth/login`,
    me:       `${API_URL}/auth/me`,
  },
} as const