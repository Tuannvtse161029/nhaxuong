import { Routes, Route } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { LoginPage } from '@/pages/auth/LoginPage'
import { NotFoundPage } from '@/pages/errors/NotFoundPage'

export function AppRoutes() {
  return (
    <Routes>
      {/* Main KCN Land Portal (User & Admin mode switchable in-app) */}
      <Route path="/" element={<MainLayout />} />
      <Route path="/dashboard" element={<MainLayout />} />
      <Route path="/admin" element={<MainLayout />} />

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<LoginPage />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
