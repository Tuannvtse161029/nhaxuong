import axiosClient from './axiosClient'
import { API_ENDPOINTS } from './endpoints'
import { ENV } from '@/config/env.config'
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  PhoneAuthCredentials,
  User,
} from '@/types/auth.types'

const MOCK_USER: User = {
  id: 'usr_01',
  name: 'Quản Trị Viên (Demo)',
  email: 'admin@nhaxuong.vn',
  role: 'admin',
  phone: '0901234567',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&auto=format&fit=crop&q=80',
  authProvider: 'email',
  createdAt: '2026-01-01',
}

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (ENV.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (credentials.email && credentials.password) {
        return {
          token: 'mock-jwt-token-abcdef123456',
          refreshToken: 'mock-refresh-token-987654',
          user: {
            ...MOCK_USER,
            email: credentials.email,
            name: credentials.email.split('@')[0],
            authProvider: 'email',
          },
        }
      }
      throw new Error('Email hoặc mật khẩu không hợp lệ')
    }

    return axiosClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials)
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    if (ENV.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return {
        token: 'mock-jwt-token-newuser',
        user: {
          id: 'usr_' + Date.now(),
          name: credentials.name,
          email: credentials.email,
          role: 'user',
          phone: credentials.phone || '0901234567',
          authProvider: 'email',
          createdAt: new Date().toISOString(),
        },
      }
    }

    return axiosClient.post(API_ENDPOINTS.AUTH.REGISTER, credentials)
  },

  async loginWithGoogle(): Promise<AuthResponse> {
    if (ENV.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 600))
      return {
        token: 'mock-jwt-google-' + Date.now(),
        user: {
          id: 'usr_gg_' + Date.now(),
          name: 'Nguyễn Thành Tùng (Google)',
          email: 'tung.nguyen@gmail.com',
          role: 'user',
          phone: '0918765432',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&auto=format&fit=crop&q=80',
          authProvider: 'google',
          createdAt: new Date().toISOString(),
        },
      }
    }

    return axiosClient.post('/auth/google')
  },

  async loginWithPhone(credentials: PhoneAuthCredentials): Promise<AuthResponse> {
    if (ENV.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return {
        token: 'mock-jwt-phone-' + Date.now(),
        user: {
          id: 'usr_ph_' + Date.now(),
          name: credentials.name || `Khách Hàng (${credentials.phone.slice(-4)})`,
          email: `${credentials.phone}@nhaxuong.vn`,
          role: 'user',
          phone: credentials.phone,
          avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=128&auto=format&fit=crop&q=80',
          authProvider: 'phone',
          createdAt: new Date().toISOString(),
        },
      }
    }

    return axiosClient.post('/auth/phone/login', credentials)
  },

  async registerWithPhone(credentials: PhoneAuthCredentials): Promise<AuthResponse> {
    if (ENV.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      return {
        token: 'mock-jwt-phone-reg-' + Date.now(),
        user: {
          id: 'usr_ph_' + Date.now(),
          name: credentials.name || `Nhà Đầu Tư (${credentials.phone.slice(-4)})`,
          email: `${credentials.phone}@nhaxuong.vn`,
          role: 'user',
          phone: credentials.phone,
          avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=128&auto=format&fit=crop&q=80',
          authProvider: 'phone',
          createdAt: new Date().toISOString(),
        },
      }
    }

    return axiosClient.post('/auth/phone/register', credentials)
  },

  async sendOtp(phone: string): Promise<{ otp: string; message: string }> {
    if (ENV.USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return {
        otp: '123456',
        message: `Mã OTP đã được gửi đến số điện thoại ${phone}: 123456`,
      }
    }
    return axiosClient.post('/auth/phone/send-otp', { phone })
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
