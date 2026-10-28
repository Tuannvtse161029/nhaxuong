import axiosClient from './axiosClient'
import { API_ENDPOINTS } from './endpoints'
import { ENV } from '@/config/env.config'
import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from '@/types/auth.types'

const MOCK_USER: User = {
  id: 'usr_01',
  name: 'Quản Trị Viên (Demo)',
  email: 'admin@nhaxuong.vn',
  role: 'admin',
  phone: '0901234567',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&auto=format&fit=crop&q=80',
  createdAt: '2026-01-01',
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (ENV.USE_MOCK_API) {
      // Simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 600))

      if (credentials.email && credentials.password) {
        return {
          token: 'mock-jwt-token-abcdef123456',
          refreshToken: 'mock-refresh-token-987654',
          user: {
            ...MOCK_USER,
            email: credentials.email,
            name: credentials.email.split('@')[0],
          },
        }
      }
      throw new Error('Email hoặc mật khẩu không hợp lệ')
    }

    return axiosClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials)
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    if (ENV.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 600))
      return {
        token: 'mock-jwt-token-newuser',
        user: {
          id: 'usr_' + Date.now(),
          name: credentials.name,
          email: credentials.email,
          role: 'user',
          phone: credentials.phone,
        },
      }
    }

    return axiosClient.post(API_ENDPOINTS.AUTH.REGISTER, credentials)
  },

  async getMe(): Promise<User> {
    if (ENV.USE_MOCK_API) {
      return MOCK_USER
    }
    return axiosClient.get(API_ENDPOINTS.AUTH.ME)
  },

  async logout(): Promise<void> {
    if (ENV.USE_MOCK_API) {
      return
    }
    await axiosClient.post(API_ENDPOINTS.AUTH.LOGOUT)
  },
}
