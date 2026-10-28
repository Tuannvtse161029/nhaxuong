export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
  },
  USERS: {
    LIST: '/users',
    DETAIL: (id: string | number) => `/users/${id}`,
    UPDATE: (id: string | number) => `/users/${id}`,
    DELETE: (id: string | number) => `/users/${id}`,
  },
  ITEMS: {
    LIST: '/items',
    DETAIL: (id: string | number) => `/items/${id}`,
    CREATE: '/items',
    UPDATE: (id: string | number) => `/items/${id}`,
    DELETE: (id: string | number) => `/items/${id}`,
  },
} as const
