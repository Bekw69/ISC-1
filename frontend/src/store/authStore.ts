import { create } from 'zustand'

interface User { id: number; email: string; name: string; role: string }
interface AuthState {
  user: User | null
  token: string | null
  setAuth: (token: string, user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: (() => { try { return JSON.parse(localStorage.getItem('user') || 'null') } catch { return null } })(),
  token: localStorage.getItem('token'),
  setAuth: (token, user) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    set({ token, user })
  },
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ token: null, user: null })
  },
}))
