export const ENV = {
  APP_TITLE: import.meta.env.VITE_APP_TITLE || 'Nền Tảng Nhà Xưởng & Kho Bãi Toàn Quốc',
  APP_DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION || 'Hệ thống giao dịch & cho thuê kho xưởng trực tuyến',
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD ? 'https://nhaxuong-backend.onrender.com/api' : 'http://localhost:5000/api'),
  API_TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 15000,
  USE_MOCK_API: import.meta.env.VITE_USE_MOCK_API === 'true',
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const
