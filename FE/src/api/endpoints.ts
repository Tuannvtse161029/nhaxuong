export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    GOOGLE: '/auth/google',
    PHONE_LOGIN: '/auth/phone/login',
    PHONE_REGISTER: '/auth/phone/register',
    PHONE_SEND_OTP: '/auth/phone/send-otp',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
  },
  PROPERTIES: {
    LIST: '/properties',
    DETAIL: (id: string | number) => `/properties/${id}`,
    CREATE: '/properties',
    UPDATE: (id: string | number) => `/properties/${id}`,
    DELETE: (id: string | number) => `/properties/${id}`,
  },
  CATEGORIES: {
    LIST: '/categories',
    CREATE: '/categories',
    DELETE: (code: string) => `/categories/${code}`,
  },
  SUBSCRIBERS: {
    LIST: '/subscribers',
    CREATE: '/subscribers',
  },
  NOTICES: {
    LIST: '/notices',
    CREATE: '/notices',
    DELETE: (id: string | number) => `/notices/${id}`,
    TICKER: '/notices/ticker',
  },
  UPLOADS: {
    IMAGE: '/uploads/image',
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
