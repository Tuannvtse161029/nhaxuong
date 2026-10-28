import {
  Factory,
  Heart,
  Mail,
  Box,
  Sun,
  Moon,
  Plus,
  ShieldCheck,
  User as UserIcon,
} from 'lucide-react'
import { useProperties } from '@/context/PropertyContext'
import { useTheme } from '@/hooks/useTheme'
import { Link, useNavigate } from 'react-router-dom'

export function Header() {
  const {
    role,
    setRole,
    savedPropertyIds,
    openSavedModal,
    openSubscribeModal,
    open3DModal,
    openAdminEditModal,
    properties,
    setFilterState,
  } = useProperties()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  return (
    <header className="sticky top-[37px] z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs dark:bg-slate-900/95 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 py-2">
          {/* Logo Brand */}
          <Link
            to="/"
            onClick={() => {
              setRole('user')
              setFilterState({ type: 'ALL' })
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-teal-400 shadow-md border border-slate-800 group-hover:bg-teal-700 group-hover:text-white transition duration-300">
              <Factory className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center">
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  KCN <span className="text-teal-600 dark:text-teal-400">LAND</span>
                </span>
                <span className="ml-2.5 rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {role === 'user' ? 'PORTAL B2B' : 'ADMIN DASHBOARD'}
                </span>
              </div>
              <p className="hidden text-[11px] text-slate-500 dark:text-slate-400 sm:block">
                Sàn Giao Dịch Nhà Xưởng & Đất Công Nghiệp
              </p>
            </div>
          </Link>

          {/* Navigation Items (User Mode) */}
          {role === 'user' ? (
            <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
              <button
                type="button"
                onClick={() => {
                  navigate('/')
                  setFilterState({ type: 'ALL' })
                }}
                className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-900 bg-slate-100 dark:bg-slate-800 dark:text-white transition"
              >
                Tất Cả Kho Xưởng
              </button>
              <button
                type="button"
                onClick={() => {
                  navigate('/')
                  setFilterState({ type: 'SALE' })
                }}
                className="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition"
              >
                Bán Xưởng
              </button>
              <button
                type="button"
                onClick={() => {
                  navigate('/')
                  setFilterState({ type: 'RENT' })
                }}
                className="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition"
              >
                Cho Thuê
              </button>
              <button
                type="button"
                onClick={() => {
                  navigate('/')
                  setFilterState({ type: 'KCN_PROJECT' })
                }}
                className="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition"
              >
                Đất KCN
              </button>
              <button
                type="button"
                onClick={() => {
                  const first = properties[0]
                  if (first) open3DModal(first)
                }}
                className="ml-1 flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300 transition"
              >
                <Box className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>3D Tour 360°</span>
              </button>
            </nav>
          ) : (
            /* Navigation Items (Admin Mode) */
            <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                <ShieldCheck className="w-4 h-4" />
                <span>Hệ Thống Quản Trị Trung Tâm</span>
              </span>
            </nav>
          )}

          {/* Right Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition"
              title="Đổi giao diện Sáng / Tối"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {role === 'user' ? (
              <>
                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={openSavedModal}
                  className="relative p-2.5 rounded-xl text-slate-600 hover:text-red-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                  title="Nhà xưởng đã lưu"
                >
                  <Heart className="w-5 h-5" />
                  {savedPropertyIds.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                      {savedPropertyIds.length}
                    </span>
                  )}
                </button>

                {/* Subscribe Button */}
                <button
                  type="button"
                  onClick={openSubscribeModal}
                  className="hidden sm:flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 transition"
                >
                  <Mail className="w-4 h-4 text-red-500" />
                  <span>Nhận Bản Tin</span>
                </button>
              </>
            ) : (
              /* Admin CTA */
              <button
                type="button"
                onClick={() => openAdminEditModal()}
                className="flex items-center gap-1.5 rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Đăng Bài Mới</span>
              </button>
            )}

            {/* Switch Mode Button */}
            <button
              type="button"
              onClick={() => setRole(role === 'user' ? 'admin' : 'user')}
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 transition"
            >
              {role === 'user' ? <ShieldCheck className="w-4 h-4 text-amber-400" /> : <UserIcon className="w-4 h-4 text-teal-400" />}
              <span className="hidden sm:inline">{role === 'user' ? 'Vào Admin' : 'Về Khách'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
