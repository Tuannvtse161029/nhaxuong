export type UserRole = 'admin' | 'manager' | 'user' | 'operator'

export interface User {
  id: number | string
  name: string
  email: string
  role: UserRole
  avatar?: string
  phone?: string
  authProvider?: 'email' | 'google' | 'phone'
  emailVerified?: boolean
  createdAt?: string
}

export interface LoginCredentials {
  email: string
  password?: string
  pin?: string
  otp?: string
  rememberMe?: boolean
}

export interface RegisterCredentials {
  name: string
  email: string
  password?: string
  pin?: string
  otp?: string
  confirmPassword?: string
  confirmPin?: string
  phone?: string
}

export interface PhoneAuthCredentials {
  phone: string
  otp?: string
  name?: string
  password?: string
  pin?: string
}

export interface ForgotPinSendOtpParams {
  method: 'email' | 'phone'
  target: string
}

export interface ForgotPinResetParams {
  method: 'email' | 'phone'
  target: string
  otp: string
  newPin: string
  confirmPin: string
}

export interface AuthResponse {
  token: string
  refreshToken?: string
  user: User
}
