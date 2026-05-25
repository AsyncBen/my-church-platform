import { API_ROUTES } from '../utils/constants'

export interface AuthUser {
  id:    string
  name:  string
  email: string
  role:  string
}

export interface AuthResponse {
  user:  AuthUser
  token: string
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(API_ROUTES.auth.login, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password }),
    })

    const json = await res.json()

    if (!json.success) {
      if (json.errors?.length) throw new Error(json.errors[0].message)
      throw new Error(json.message || 'Login failed')
    }

    return json.data as AuthResponse
  },
}