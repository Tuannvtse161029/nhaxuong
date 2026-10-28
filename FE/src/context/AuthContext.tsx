import { createContext, useState, useEffect, type ReactNode } from 'react'
import type { User, LoginCredentials } from '@/types/auth.types'
import { authApi } from '@/api/authApi'
import { storage } from '@/utils/storage'

export interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  updateUser: (user: Partial<User>) => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => storage.getItem<User | null>('auth_user', null))
  const [token, setToken] = useState<string | null>(() => storage.getToken())
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    async function initAuth() {
      const storedToken = storage.getToken()
      if (storedToken) {
        try {
          const currentUser = await authApi.getMe()
          setUser(currentUser)
          storage.setItem('auth_user', currentUser)
        } catch (err) {
          console.error('Failed to restore session:', err)
          storage.removeToken()
          storage.removeItem('auth_user')
          setUser(null)
          setToken(null)
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    try {
      const res = await authApi.login(credentials)
      storage.setToken(res.token)
      storage.setItem('auth_user', res.user)
      setToken(res.token)
      setUser(res.user)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch (e) {
      console.warn('Logout API error:', e)
    } finally {
      storage.removeToken()
      storage.removeItem('auth_user')
      setToken(null)
      setUser(null)
    }
  }

  const updateUser = (updatedFields: Partial<User>) => {
    if (!user) return
    const updated = { ...user, ...updatedFields }
    setUser(updated)
    storage.setItem('auth_user', updated)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
