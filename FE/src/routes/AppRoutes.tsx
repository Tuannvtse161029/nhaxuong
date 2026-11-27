import { Routes, Route } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { LoginPage } from '@/pages/auth/LoginPage'
import { AdminPage } from '@/pages/admin/AdminPage'
import { NotFoundPage } from '@/pages/errors/NotFoundPage'

export function AppRoutes() {
  return (
    <Routes>
      {/* Main Public Marketplace Portal */}
      <Route path="/" element={<MainLayout />} />
      <Route path="/dashboard" element={<MainLayout />} />

      {/* Dedicated Standalone Admin Portal Access (/admin) */}
      <Route path="/admin" element={<AdminPage />} />

      {/* User Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<LoginPage />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
