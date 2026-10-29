import { createContext, useState, useEffect, type ReactNode } from 'react'
import type { User, LoginCredentials, RegisterCredentials } from '@/types/auth.types'
import { authApi } from '@/api/authApi'
import { storage } from '@/utils/storage'

export interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  isAuthModalOpen: boolean
  authModalTab: 'login' | 'register'
  openAuthModal: (tab?: 'login' | 'register') => void
  closeAuthModal: () => void
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  loginWithGoogle: (idToken?: string) => Promise<void>
  loginWithPhone: (phone: string, otp?: string, name?: string) => Promise<void>
  registerWithPhone: (phone: string, name: string, otp?: string) => Promise<void>
  sendOtp: (phone: string) => Promise<string>
  logout: () => Promise<void>
  updateUser: (user: Partial<User>) => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => storage.getItem<User | null>('auth_user', null))
  const [token, setToken] = useState<string | null>(() => storage.getToken())
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login')

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

  const openAuthModal = (tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab)
    setIsAuthModalOpen(true)
  }

  const closeAuthModal = () => {
    setIsAuthModalOpen(false)
  }

  const handleAuthSuccess = (res: { token: string; user: User }) => {
    storage.setToken(res.token)
    storage.setItem('auth_user', res.user)
    setToken(res.token)
    setUser(res.user)
    setIsAuthModalOpen(false)
  }

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    try {
      const res = await authApi.login(credentials)
      handleAuthSuccess(res)
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (credentials: RegisterCredentials) => {
    setIsLoading(true)
    try {
      const res = await authApi.register(credentials)
      handleAuthSuccess(res)
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = async (idToken?: string) => {
    setIsLoading(true)
    try {
      const res = await authApi.loginWithGoogle(idToken)
      handleAuthSuccess(res)
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithPhone = async (phone: string, otp?: string, name?: string) => {
    setIsLoading(true)
    try {
      const res = await authApi.loginWithPhone({ phone, otp, name })
      handleAuthSuccess(res)
    } finally {
      setIsLoading(false)
    }
  }

  const registerWithPhone = async (phone: string, name: string, otp?: string) => {
    setIsLoading(true)
    try {
      const res = await authApi.registerWithPhone({ phone, name, otp })
      handleAuthSuccess(res)
    } finally {
      setIsLoading(false)
    }
  }

  const sendOtp = async (phone: string): Promise<string> => {
    const res = await authApi.sendOtp(phone)
    return res.otp
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
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        loginWithGoogle,
        loginWithPhone,
        registerWithPhone,
        sendOtp,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
