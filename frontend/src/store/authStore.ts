import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  username: string
  role: string
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

// Demo credentials - In production, this should be handled by backend API
const VALID_CREDENTIALS = {
  admin: 'admin123',
  user: 'user123',
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,

      login: async (username: string, password: string) => {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Validate credentials
        if (
          username in VALID_CREDENTIALS &&
          VALID_CREDENTIALS[username as keyof typeof VALID_CREDENTIALS] === password
        ) {
          const user: User = {
            username,
            role: username === 'admin' ? 'admin' : 'user',
          }

          set({ isAuthenticated: true, user })
          return true
        }

        return false
      },

      logout: () => {
        set({ isAuthenticated: false, user: null })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
