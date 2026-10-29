import { useState } from 'react'
import {
  X,
  Smartphone,
  Mail,
  Lock,
  User as UserIcon,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    openAuthModal,
    login,
    register,
    loginWithGoogle,
    loginWithPhone,
    registerWithPhone,
    sendOtp,
  } = useAuth()

  // Form Modes
  const [method, setMethod] = useState<'phone' | 'email'>('phone')

  // Phone Form States
  const [phone, setPhone] = useState('')
  const [phoneName, setPhoneName] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpCountdown, setOtpCountdown] = useState(0)

  // Email Form States
  const [email, setEmail] = useState('admin@nhaxuong.vn')
  const [password, setPassword] = useState('123456')
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // General States
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  if (!isAuthModalOpen) return null

  const isLogin = authModalTab === 'login'

  const handleSendOtp = async () => {
    if (!phone.trim()) {
      setError('Vui lòng nhập số điện thoại')
      return
    }
    setError(null)
    setIsLoading(true)
    try {
      const code = await sendOtp(phone.trim())
      setOtpSent(true)
      setOtp(code)
      setSuccessMsg(`Mã OTP đã được gửi đến số ${phone}: ${code}`)
      setOtpCountdown(60)
      const timer = setInterval(() => {
        setOtpCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể gửi mã OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setError(null)
    setIsLoading(true)
    try {
      await loginWithGoogle()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập Google thất bại')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone.trim()) {
      setError('Vui lòng nhập số điện thoại')
      return
    }
    if (otpSent && !otp.trim()) {
      setError('Vui lòng nhập mã OTP')
      return
    }

    setError(null)
    setIsLoading(true)
    try {
      if (isLogin) {
        await loginWithPhone(phone.trim(), otp.trim())
      } else {
        await registerWithPhone(phone.trim(), phoneName.trim() || `Khách Hàng (${phone.slice(-4)})`, otp.trim())
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xác thực số điện thoại không thành công')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('Vui lòng điền đầy đủ email và mật khẩu')
      return
    }
    if (!isLogin && password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      return
    }

    setError(null)
    setIsLoading(true)
    try {
      if (isLogin) {
        await login({ email: email.trim(), password })
      } else {
        await register({ email: email.trim(), password, name: name.trim() || email.split('@')[0] })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Thao tác không thành công')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-md rounded-3xl bg-white shadow-2xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {/* Header Tabs: Đăng Nhập vs Đăng Ký */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-2">
          <div className="flex items-center gap-1.5 flex-1">
            <button
              type="button"
              onClick={() => {
                openAuthModal('login')
                setError(null)
                setSuccessMsg(null)
              }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-2xl transition ${
                isLogin
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Đăng Nhập
            </button>
            <button
              type="button"
              onClick={() => {
                openAuthModal('register')
                setError(null)
                setSuccessMsg(null)
              }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-2xl transition ${
                !isLogin
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Đăng Ký Tài Khoản
            </button>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-2 ml-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
          {/* Title description */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-600" />
              {isLogin ? 'Chào Mừng Trở Lại' : 'Tạo Tài Khoản Nhà Xưởng'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isLogin
                ? 'Đăng nhập để lưu tin, nhận báo cáo thị trường và liên hệ trực tiếp.'
                : 'Đăng ký ngay bằng Google hoặc Số điện thoại để bắt đầu.'}
            </p>
          </div>

          {/* Feedback messages */}
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-600 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 rounded-xl bg-teal-50 p-3 text-xs text-teal-800 dark:bg-teal-950/40 dark:text-teal-300 border border-teal-200 dark:border-teal-900">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. GOOGLE LOGIN BUTTON */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm shadow-xs transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            {/* Official Google SVG Icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>{isLogin ? 'Đăng nhập bằng Google' : 'Đăng ký nhanh với Google'}</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center py-1">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            <span className="absolute bg-white dark:bg-slate-900 px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Hoặc Tiếp Tục Với
            </span>
          </div>

          {/* 2. METHOD SWITCHER: SỐ ĐIỆN THOẠI vs EMAIL */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setMethod('phone')
                setError(null)
              }}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition ${
                method === 'phone'
                  ? 'bg-white text-teal-800 shadow-xs dark:bg-slate-700 dark:text-teal-300'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Số Điện Thoại</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMethod('email')
                setError(null)
              }}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition ${
                method === 'email'
                  ? 'bg-white text-teal-800 shadow-xs dark:bg-slate-700 dark:text-teal-300'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email & Mật Khẩu</span>
            </button>
          </div>

          {/* 3. PHONE AUTH FORM */}
          {method === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-3 pt-1">
              {!isLogin && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Họ và Tên
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="VD: Nguyễn Văn An"
                      value={phoneName}
                      onChange={(e) => setPhoneName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Số Điện Thoại (+84)
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Smartphone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="VD: 090 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isLoading || otpCountdown > 0}
                    className="rounded-xl bg-teal-600 px-3 py-2 text-xs font-bold text-white hover:bg-teal-700 disabled:opacity-50 transition shrink-0"
                  >
                    {otpCountdown > 0 ? `${otpCountdown}s` : otpSent ? 'Gửi Lại OTP' : 'Gửi Mã OTP'}
                  </button>
                </div>
              </div>

              {otpSent && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Mã Xác Thực OTP (6 Số)
                    </label>
                    <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">
                      Mã thử nghiệm: 123456
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Nhập 6 số OTP (VD: 123456)"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-center text-sm font-mono tracking-widest font-bold focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-700 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-teal-800 transition disabled:opacity-50"
              >
                <span>{isLogin ? 'Đăng Nhập Bằng Số Điện Thoại' : 'Đăng Ký Bằng Số Điện Thoại'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* 4. EMAIL & PASSWORD FORM */}
          {method === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-3 pt-1">
              {!isLogin && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Họ và Tên
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="VD: Trần Hoàng Long"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Địa Chỉ Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="admin@nhaxuong.vn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mật Khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    required
                  />
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Xác Nhận Mật Khẩu
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      required
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-slate-800 dark:bg-teal-700 dark:hover:bg-teal-600 transition disabled:opacity-50"
              >
                <span>{isLogin ? 'Đăng Nhập Với Email' : 'Đăng Ký Tài Khoản'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {isLogin && (
                <div className="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 p-2.5 text-[11px] text-amber-900 dark:text-amber-300">
                  <span className="font-bold">Tài khoản Admin mẫu:</span> admin@nhaxuong.vn | Pass: 123456
                </div>
              )}
            </form>
          )}

          {/* Privacy & Terms */}
          <p className="text-[10px] text-center text-slate-400 leading-relaxed pt-2">
            Bằng việc tiếp tục, bạn đồng ý với <b>Quy chế hoạt động sàn</b> và <b>Chính sách bảo mật</b> của NHAXUONG.VN.
          </p>
        </div>
      </div>
    </div>
  )
}
