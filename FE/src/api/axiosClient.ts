import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { ENV } from '@/config/env.config'
import { storage } from '@/utils/storage'

export const axiosClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: ENV.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Request Interceptor: Attach Auth Token if exists
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storage.getToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response Interceptor: Format responses & handle global errors (401, 403, 500)
axiosClient.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Auto logout if unauthorized / token expired
      storage.removeToken()
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    const message =
      (error.response?.data as { message?: string })?.message ||
      error.message ||
      'Đã xảy ra lỗi không xác định. Vui lòng thử lại.'

    return Promise.reject(new Error(message))
  }
)

export default axiosClient
