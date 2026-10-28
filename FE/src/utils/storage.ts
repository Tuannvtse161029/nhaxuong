/**
 * Safe LocalStorage helpers with JSON parsing & error fallback
 */

const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
  THEME: 'theme_mode',
} as const

export const storage = {
  getToken(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.TOKEN)
    } catch {
      return null
    }
  },

  setToken(token: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token)
    } catch (e) {
      console.error('Failed to save token to localStorage', e)
    }
  },

  removeToken(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
    } catch (e) {
      console.error('Failed to remove token from localStorage', e)
    }
  },

  getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : defaultValue
    } catch {
      return defaultValue
    }
  },

  setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.error(`Failed to save ${key} to localStorage`, e)
    }
  },

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (e) {
      console.error(`Failed to remove ${key} from localStorage`, e)
    }
  },

  clear(): void {
    try {
      localStorage.clear()
    } catch (e) {
      console.error('Failed to clear localStorage', e)
    }
  },
}
