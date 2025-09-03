import { http } from './http'

export type LoginCredentials = { email: string; password: string }
export type User = { id: string; email: string; name?: string }
export type AuthResponse = { token: string; user: User }

export const AuthService = {
  async login(creds: LoginCredentials, useReal: boolean): Promise<AuthResponse> {
    if (!useReal) return { token: 'sim-token', user: { id: 'sim', email: creds.email, name: 'Sim User' } }
    return http<AuthResponse>('/auth/login', { method: 'POST', body: creds })
  },
  async me(useReal: boolean): Promise<User | null> {
    if (!useReal) return { id: 'sim', email: 'sim@example.com', name: 'Sim User' }
    return http<User>('/auth/me')
  },
  async logout(useReal: boolean): Promise<void> {
    if (!useReal) return
    await http('/auth/logout', { method: 'POST' })
  },
}


