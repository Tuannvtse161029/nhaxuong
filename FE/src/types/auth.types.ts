export type UserRole = 'admin' | 'manager' | 'user' | 'operator'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  phone?: string
  authProvider?: 'email' | 'google' | 'phone'
  createdAt?: string
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
  confirmPassword?: string
  phone?: string
}

export interface PhoneAuthCredentials {
  phone: string
  otp?: string
  name?: string
  password?: string
}

export interface AuthResponse {
  token: string
  refreshToken?: string
  user: User
}
