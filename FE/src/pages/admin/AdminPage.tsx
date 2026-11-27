import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ShieldCheck,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  AlertCircle,
  Factory,
  LogOut,
  ExternalLink,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useProperties } from '@/context/PropertyContext'
import { AdminPortalPage } from './AdminPortalPage'

export function AdminPage() {
  const { user, login, logout, isLoading: authLoading } = useAuth()
  const { role, setRole, showToast } = useProperties()
  const navigate = useNavigate()

  // Admin login form states
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isAdminAuthenticated = user?.role === 'admin' || role === 'admin'

  const handleAdminLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const u = username.trim()
    const p = password.trim()

    if (!u) {
      setError('Vui lòng nhập tài khoản admin')
      return
    }
    if (!p) {
      setError('Vui lòng nhập mật khẩu admin')
      return
    }

    setError(null)
    setIsSubmitting(true)
    try {
      await login({
        email: u.toLowerCase() === 'admin' ? 'admin@nhaxuong.vn' : u,
        password: p,
        pin: p,
      })
      setRole('admin')
      showToast('Đăng nhập Quản Trị Viên thành công! Chào mừng bạn vào trang điều hành.', 'success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tài khoản hoặc mật khẩu admin không chính xác!')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAdminLogout = async () => {
    await logout()
    setRole('user')
    showToast('Đã đăng xuất khỏi cổng Quản Trị')
  }

  // ================= VIEW A: ADMIN IS AUTHENTICATED -> SHOW ADMIN DASHBOARD =================
  if (isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
        {/* Dedicated Admin Header Bar */}
        <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-slate-900 text-white shadow-md border border-teal-500/30">
                <ShieldCheck className="h-5 w-5 text-teal-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-black tracking-tight text-white uppercase font-sans">
                    NHAXUONG<span className="text-teal-400">.VN</span>
                  </span>
                  <span className="rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                    CỔNG QUẢN TRỊ VIÊN
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 hidden sm:block">
                  Hệ thống kiểm soát bài đăng, danh mục, kích thước kết cấu & mô hình 3D
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition"
                title="Mở giao diện khách hàng ở tab mới"
              >
                <Factory className="w-3.5 h-3.5 text-teal-400" />
                <span className="hidden sm:inline">Xem Sàn Công Khai</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </Link>

              <button
                type="button"
                onClick={handleAdminLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-800/60 text-xs font-bold text-red-300 transition cursor-pointer"
                title="Đăng xuất khỏi tài khoản admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Đăng Xuất Admin</span>
              </button>
            </div>
          </div>
        </header>

        {/* Admin Main Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <AdminPortalPage />
        </main>
      </div>
    )
  }

  // ================= VIEW B: DEDICATED ADMIN LOGIN PORTAL (SEPARATE FROM USER LOGIN) =================
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        {/* Top Back Link */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-teal-400 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Về Sàn Khung Xưởng</span>
          </Link>
          <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-2 py-0.5 rounded-md">
            URL: /admin
          </span>
        </div>

        {/* Header Icon & Title */}
        <div className="text-center mb-6">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-slate-900 border border-teal-500/40 text-teal-300 shadow-lg shadow-teal-500/20 mb-3">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            CỔNG ĐĂNG NHẬP QUẢN TRỊ
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Khu vực bảo mật riêng dành cho Quản Trị Viên sàn NHAXUONG.VN
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-950/60 p-3 text-xs text-red-300 border border-red-800/80">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Admin Login Form */}
        <form noValidate onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Tài Khoản Quản Trị (Admin)
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Nhập tài khoản admin..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/90 py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono font-bold"
                autoComplete="username"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">
                Mật Khẩu Quản Trị
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu admin..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800/90 py-2.5 pl-9 pr-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono font-bold"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            formNoValidate
            disabled={isSubmitting || authLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-500 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-teal-600/30 active:scale-95 transition disabled:opacity-50 cursor-pointer mt-4"
          >
            <KeyRound className="w-4 h-4" />
            <span>ĐĂNG NHẬP VÀO TRANG QUẢN TRỊ</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-[11px] text-center text-slate-500 mt-6">
          Chỉ nhân sự kỹ thuật & quản lý kho bãi NHAXUONG.VN mới có quyền truy cập cổng này.
        </p>
      </div>
    </div>
  )
}
