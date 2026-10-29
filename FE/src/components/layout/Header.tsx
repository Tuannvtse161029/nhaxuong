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
  PhoneCall,
  MapPin,
  Building2,
  FileCheck2,
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs dark:bg-slate-900/95 dark:border-slate-800">
      {/* Real Estate Top Hotline & Info Strip */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 sm:px-8 border-b border-slate-800 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-teal-400 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
              Sàn Giao Dịch BĐS Công Nghiệp & Nhà Xưởng Việt Nam
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1 text-slate-300">
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
              100% Mặt Bằng Kiểm Duyệt Pháp Lý & Nghiệm Thu PCCC
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="tel:0901234567"
              className="flex items-center gap-1.5 text-white hover:text-teal-400 transition font-semibold"
            >
              <PhoneCall className="w-3.5 h-3.5 text-teal-400" />
              <span>Hotline Tư Vấn Dự Án: 090 123 4567</span>
            </a>
            <span className="text-slate-600">|</span>
            <button
              onClick={openSubscribeModal}
              className="hover:text-teal-400 transition text-slate-300 flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5 text-red-400" />
              <span>Báo Cáo Thị Trường BĐS</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand: NHAXUONG.VN */}
          <Link
            to="/"
            onClick={() => {
              setRole('user')
              setFilterState({ type: 'ALL' })
            }}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-teal-400 shadow-md border border-slate-800 group-hover:from-teal-800 group-hover:to-slate-950 group-hover:text-white transition duration-300">
              <Factory className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase font-sans">
                  NHAXUONG<span className="text-teal-600 dark:text-teal-400">.VN</span>
                </span>
                <span className="rounded-md border border-teal-500/30 bg-teal-50 px-2 py-0.5 text-[9.5px] font-bold text-teal-700 dark:border-teal-900 dark:bg-teal-950/60 dark:text-teal-300">
                  {role === 'user' ? 'SÀN BĐS KCN' : 'ADMIN BĐS'}
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 hidden sm:block">
                Bất Động Sản Công Nghiệp & Kho Xưởng Toàn Quốc
              </p>
            </div>
          </Link>

          {/* Navigation Items (User Mode: BĐS Công Nghiệp) */}
          {role === 'user' ? (
            <nav className="hidden lg:flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  navigate('/')
                  setFilterState({ type: 'ALL' })
                }}
                className="px-3 py-2 rounded-xl text-xs font-bold text-slate-900 bg-slate-100 dark:bg-slate-800 dark:text-white transition"
              >
                Tất Cả BĐS
              </button>
              <button
                type="button"
                onClick={() => {
                  navigate('/')
                  setFilterState({ type: 'SALE' })
                }}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition"
              >
                Bán Nhà Xưởng
              </button>
              <button
                type="button"
                onClick={() => {
                  navigate('/')
                  setFilterState({ type: 'RENT' })
                }}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition"
              >
                Cho Thuê Kho Bãi
              </button>
              <button
                type="button"
                onClick={() => {
                  navigate('/')
                  setFilterState({ type: 'KCN_PROJECT' })
                }}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition"
              >
                Dự Án Đất KCN
              </button>
              <button
                type="button"
                onClick={() => {
                  const first = properties[0]
                  if (first) open3DModal(first)
                }}
                className="ml-1 flex items-center gap-1.5 rounded-xl border border-amber-300/80 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300 transition"
              >
                <Box className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>3D Tour 360°</span>
              </button>
            </nav>
          ) : (
            /* Navigation Items (Admin Mode) */
            <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-200 dark:border-teal-900">
                <ShieldCheck className="w-4 h-4" />
                <span>Hệ Thống Quản Trị Sàn BĐS Nhà Xưởng</span>
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
                  title="Danh sách xưởng đã lưu"
                >
                  <Heart className="w-5 h-5" />
                  {savedPropertyIds.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-xs">
                      {savedPropertyIds.length}
                    </span>
                  )}
                </button>

                {/* Nút Khách Hàng: Tư Vấn Mua / Thuê */}
                <button
                  type="button"
                  onClick={openSubscribeModal}
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-bold text-white shadow-md hover:bg-teal-700 transition"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Tư Vấn Mua / Thuê</span>
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
                <span>Đăng Xưởng Mới</span>
              </button>
            )}

            {/* Switch Mode Button */}
            <button
              type="button"
              onClick={() => setRole(role === 'user' ? 'admin' : 'user')}
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 transition"
            >
              {role === 'user' ? <ShieldCheck className="w-4 h-4 text-amber-400" /> : <UserIcon className="w-4 h-4 text-teal-400" />}
              <span className="hidden sm:inline">{role === 'user' ? 'Quản Trị' : 'Giao Diện BĐS'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
