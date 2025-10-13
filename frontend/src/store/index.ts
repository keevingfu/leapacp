import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Auth Store Types
interface User {
  id: string
  email: string
  name: string
  role: string
  tenant_id?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
  setToken: (token: string) => void
}

// Tenant Store Types
interface Tenant {
  tenant_id: string
  name: string
  settings?: Record<string, any>
}

interface Brand {
  brand_id: string
  tenant_id: string
  name: string
  logo_url?: string
}

interface TenantState {
  currentTenant: Tenant | null
  tenants: Tenant[]
  currentBrand: Brand | null
  brands: Brand[]
  setCurrentTenant: (tenant: Tenant) => void
  setCurrentBrand: (brand: Brand | null) => void
  setTenants: (tenants: Tenant[]) => void
  setBrands: (brands: Brand[]) => void
}

// UI Store Types
interface UIState {
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  notifications: Notification[]
  toggleSidebar: () => void
  setTheme: (theme: 'light' | 'dark') => void
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}

// Auth Store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          // TODO: Replace with actual API call
          // const response = await api.post('/auth/login', { email, password })

          // Mock login for now
          const mockUser: User = {
            id: '1',
            email,
            name: 'Test User',
            role: 'admin',
            tenant_id: 'tenant-1',
          }
          const mockToken = 'mock-jwt-token'

          localStorage.setItem('auth_token', mockToken)
          localStorage.setItem('tenant_id', mockUser.tenant_id || '')

          set({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('tenant_id')
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true })
      },

      setToken: (token: string) => {
        localStorage.setItem('auth_token', token)
        set({ token })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// Tenant Store
export const useTenantStore = create<TenantState>()(
  persist(
    (set) => ({
      currentTenant: null,
      tenants: [],
      currentBrand: null,
      brands: [],

      setCurrentTenant: (tenant: Tenant) => {
        localStorage.setItem('tenant_id', tenant.tenant_id)
        set({ currentTenant: tenant })
      },

      setCurrentBrand: (brand: Brand | null) => {
        set({ currentBrand: brand })
      },

      setTenants: (tenants: Tenant[]) => {
        set({ tenants })
      },

      setBrands: (brands: Brand[]) => {
        set({ brands })
      },
    }),
    {
      name: 'tenant-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// UI Store
export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: true,
  theme: 'light',
  notifications: [],

  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }))
  },

  setTheme: (theme: 'light' | 'dark') => {
    set({ theme })
  },

  addNotification: (notification: Omit<Notification, 'id'>) => {
    const id = `notification-${Date.now()}-${Math.random()}`
    const newNotification = { ...notification, id }

    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }))

    // Auto-remove notification after duration (default 5s)
    const duration = notification.duration || 5000
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }))
    }, duration)
  },

  removeNotification: (id: string) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }))
  },
}))

// Export types
export type { User, Tenant, Brand, Notification }
