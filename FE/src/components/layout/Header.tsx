import {
  Factory,
  Heart,
  Mail,
  Box,
  Sun,
  Moon,
  User as UserIcon,
  PhoneCall,
  LogIn,
  LogOut,
  Flame,
} from 'lucide-react'
import { useProperties } from '@/context/PropertyContext'
import { useAuth } from '@/hooks/useAuth'
import { useTheme } from '@/hooks/useTheme'
import { useLanguage } from '@/hooks/useLanguage'
import { Link, useNavigate } from 'react-router-dom'
import { cn } from '@/utils/cn'

export function Header() {
  const { user, openAuthModal, logout } = useAuth()
  const {
    savedPropertyIds,
    openSavedModal,
    openSubscribeModal,
    filterState,
    setFilterState,
  } = useProperties()
  const { theme, toggleTheme } = useTheme()
  const { language, toggleLanguage, t } = useLanguage()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs dark:bg-slate-900/95 dark:border-slate-800">
      {/* Top Hotline Strip */}
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 sm:px-8 border-b border-slate-800 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-teal-400 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
              Sàn Mua Bán Khung Nhà Xưởng & Sắt Thép Miền Nam
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">
              Tổng kho: Dĩ An, Thuận An (Bình Dương) • Bảo Lộc (Lâm Đồng) • Đồng Nai
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="tel:0965985468"
              className="flex items-center gap-1.5 text-white hover:text-teal-400 transition font-semibold"
            >
              <PhoneCall className="w-3.5 h-3.5 text-teal-400" />
              <span>Hotline Kho Bãi: 0965 985 468</span>
            </a>
            <span className="text-slate-600">|</span>
            <button
              onClick={openSubscribeModal}
              className="hover:text-teal-400 transition text-slate-300 flex items-center gap-1 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-red-400" />
              <span>Nhận Báo Giá Real-time</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-14 sm:h-20 gap-1.5 sm:gap-4">
          {/* Logo Brand: NHAXUONG.VN */}
          <Link
            to="/"
            onClick={() => {
              setFilterState({ type: 'ALL' })
            }}
            className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-teal-400 shadow-md border border-slate-800 group-hover:from-teal-800 group-hover:to-slate-950 group-hover:text-white transition duration-300 shrink-0">
              <Factory className="h-4 w-4 sm:h-7 sm:w-7" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase font-sans whitespace-nowrap">
                  NHAXUONG<span className="text-teal-600 dark:text-teal-400">.VN</span>
                </span>
                <span className="hidden lg:inline-block rounded-md border border-teal-500/30 bg-teal-50 px-1.5 py-0.5 text-[9px] font-bold text-teal-700 dark:border-teal-900 dark:bg-teal-950/60 dark:text-teal-300">
                  KHO BÃI & SẮT THÉP
                </span>
              </div>
            </div>
          </Link>

          {/* Quick Header Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                navigate('/')
                setFilterState({ type: 'ALL' })
              }}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs transition flex items-center gap-1 cursor-pointer',
                filterState.type === 'ALL'
                  ? 'font-bold text-slate-900 bg-slate-100 dark:bg-slate-800 dark:text-white'
                  : 'font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
              )}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Tin Mới Nhất</span>
            </button>

            <button
              type="button"
              onClick={() => {
                navigate('/')
                setFilterState({ type: 'BAN_KHUNG_XUONG' })
              }}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs transition cursor-pointer',
                filterState.type === 'BAN_KHUNG_XUONG'
                  ? 'font-bold text-slate-900 bg-slate-100 dark:bg-slate-800 dark:text-white'
                  : 'font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
              )}
            >
              Khung Nhà Xưởng
            </button>

            <button
              type="button"
              onClick={() => {
                navigate('/')
                setFilterState({ type: 'THEP_HINH_I' })
              }}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs transition cursor-pointer',
                filterState.type === 'THEP_HINH_I'
                  ? 'font-bold text-slate-900 bg-slate-100 dark:bg-slate-800 dark:text-white'
                  : 'font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
              )}
            >
              Thép Hình I
            </button>

            <button
              type="button"
              onClick={() => {
                navigate('/')
                setFilterState({ type: 'THIET_KE_3D' })
              }}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs transition flex items-center gap-1 cursor-pointer',
                filterState.type === 'THIET_KE_3D'
                  ? 'font-bold text-cyan-600 bg-cyan-50 dark:bg-cyan-950/50 dark:text-cyan-300'
                  : 'font-semibold text-slate-600 hover:text-cyan-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
              )}
            >
              <Box className="w-3.5 h-3.5 text-cyan-500" />
              <span>Xem Thiết Kế 3D</span>
            </button>
          </nav>

          {/* Right Action CTAs: Language, Theme, Wishlist, Login */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Language Toggle */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="inline-flex items-center justify-center px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 font-extrabold text-[10.5px] sm:text-xs transition shadow-2xs cursor-pointer shrink-0"
              title={language === 'vi' ? 'Switch to English (Chuyển sang Tiếng Anh)' : 'Chuyển sang Tiếng Việt'}
            >
              <span>{language === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN'}</span>
            </button>

            {/* Theme Toggle (Sáng / Tối) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition cursor-pointer shrink-0 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              title={theme === 'dark' ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Wishlist Button */}
            <button
              type="button"
              onClick={openSavedModal}
              className="relative p-1.5 sm:p-2 rounded-xl text-slate-600 hover:text-red-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition cursor-pointer shrink-0"
              title={t('saved_list')}
            >
              <Heart className="w-4 h-4" />
              {savedPropertyIds.length > 0 && (
                <span className="absolute top-0.5 right-0.5 flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-red-500 text-[8.5px] sm:text-[9.5px] font-bold text-white shadow-xs">
                  {savedPropertyIds.length}
                </span>
              )}
            </button>

            {/* User Account / Login Button (Tối ưu không bao giờ bị lệch sang viền trắng) */}
            {!user ? (
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="inline-flex items-center gap-1 rounded-xl border border-teal-500/40 bg-teal-50/50 px-2 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs font-bold text-teal-700 hover:bg-teal-100 dark:border-teal-700/60 dark:bg-teal-950/40 dark:text-teal-300 dark:hover:bg-teal-900/60 transition shadow-2xs cursor-pointer shrink-0"
              >
                <LogIn className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                <span className="whitespace-nowrap">{t('login')}</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 p-1 pl-1.5 shrink-0">
                <div className="h-6 w-6 rounded-full overflow-hidden bg-teal-600 flex items-center justify-center text-[10px] text-white font-bold shrink-0">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="hidden lg:block text-left text-xs leading-none pr-1">
                  <span className="font-bold text-slate-800 dark:text-slate-100 truncate max-w-[90px] block">
                    {user.name}
                  </span>
                  <span className="text-[9.5px] text-slate-400 font-mono">
                    {user.phone || user.email.split('@')[0]}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="p-1 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                  title="Đăng xuất"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
