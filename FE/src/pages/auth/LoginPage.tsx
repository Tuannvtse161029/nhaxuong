import { useState, type FormEvent } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import {
  Mail,
  Lock,
  Smartphone,
  User as UserIcon,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    login,
    register,
    loginWithGoogle,
    loginWithPhone,
    registerWithPhone,
    sendOtp,
  } = useAuth()

  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [method, setMethod] = useState<'phone' | 'email'>('phone')

  // Phone states
  const [phone, setPhone] = useState('')
  const [phoneName, setPhoneName] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpCountdown, setOtpCountdown] = useState(0)

  // Email states
  const [email, setEmail] = useState('admin@nhaxuong.vn')
  const [password, setPassword] = useState('123456')
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'

  const handleSendOtp = async () => {
    if (!phone.trim()) {
      setError('Vui lòng nhập số điện thoại')
      return
    }
    setError(null)
    setIsSubmitting(true)
    try {
      const code = await sendOtp(phone.trim())
      setOtpSent(true)
      setOtp(code)
      setSuccessMsg(`Mã OTP đã gửi tới ${phone}: ${code}`)
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
      setIsSubmitting(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError(null)
    setIsSubmitting(true)
    try {
      await loginWithGoogle()
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập Google không thành công')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePhoneSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!phone.trim()) {
      setError('Vui lòng nhập số điện thoại')
      return
    }
    setError(null)
    setIsSubmitting(true)
    try {
      if (isRegisterMode) {
        await registerWithPhone(phone.trim(), phoneName.trim() || `Khách Hàng (${phone.slice(-4)})`, otp.trim())
      } else {
        await loginWithPhone(phone.trim(), otp.trim())
      }
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xác thực số điện thoại thất bại')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('Vui lòng nhập email và mật khẩu')
      return
    }
    if (isRegisterMode && password !== confirmPassword) {
      setError('Mật khẩu xác nhận không trùng khớp')
      return
    }

    setError(null)
    setIsSubmitting(true)
    try {
      if (isRegisterMode) {
        await register({ email: email.trim(), password, name: name.trim() || email.split('@')[0] })
      } else {
        await login({ email: email.trim(), password })
      }
      navigate(from, { replace: true })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Thao tác không thành công')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      {/* Tab Switcher: Đăng Nhập vs Đăng Ký */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-5">
        <button
          type="button"
          onClick={() => {
            setIsRegisterMode(false)
            setError(null)
            setSuccessMsg(null)
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
            !isRegisterMode
              ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Đăng Nhập
        </button>
        <button
          type="button"
          onClick={() => {
            setIsRegisterMode(true)
            setError(null)
            setSuccessMsg(null)
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
            isRegisterMode
              ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          Đăng Ký Mới
        </button>
      </div>

      <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-teal-600" />
        {isRegisterMode ? 'Đăng Ký Tài Khoản Sàn' : 'Đăng Nhập Hệ Thống'}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
        {isRegisterMode
          ? 'Tạo tài khoản bằng Google, Số điện thoại hoặc Email để tìm kiếm kho xưởng.'
          : 'Truy cập để quản lý tin đăng, xem video flycam và nhận báo giá trực tiếp.'}
      </p>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs text-red-600 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-teal-50 p-3 text-xs text-teal-800 dark:bg-teal-950/40 dark:text-teal-300 border border-teal-200 dark:border-teal-900">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 1. GOOGLE AUTH BUTTON */}
      <GoogleLoginButton
        text={isRegisterMode ? 'signup_with' : 'continue_with'}
        onSuccess={() => navigate(from, { replace: true })}
        onError={(err) => setError(err.message)}
        className="mb-4"
      />

      {/* Divider */}
      <div className="relative flex items-center justify-center py-2 mb-3">
        <div className="w-full border-t border-slate-200 dark:border-slate-800" />
        <span className="absolute bg-white dark:bg-slate-900 px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Hoặc
        </span>
      </div>

      {/* Method Switcher */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4">
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
          <span>Email & Password</span>
        </button>
      </div>

      {/* 2. PHONE FORM */}
      {method === 'phone' && (
        <form onSubmit={handlePhoneSubmit} className="space-y-3.5">
          {isRegisterMode && (
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
                  required
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
                disabled={isSubmitting || otpCountdown > 0}
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
                  Mã OTP (6 số)
                </label>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">
                  Mã thử nghiệm: 123456
                </span>
              </div>
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-center text-sm font-mono tracking-widest font-bold focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-700 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-teal-800 transition disabled:opacity-50 mt-2"
          >
            <span>{isRegisterMode ? 'Đăng Ký Bằng Số Điện Thoại' : 'Đăng Nhập Số Điện Thoại'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* 3. EMAIL FORM */}
      {method === 'email' && (
        <form onSubmit={handleEmailSubmit} className="space-y-3.5">
          {isRegisterMode && (
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
                  required
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

          {isRegisterMode && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nhập Lại Mật Khẩu
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
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-slate-800 dark:bg-teal-700 dark:hover:bg-teal-600 transition disabled:opacity-50 mt-2"
          >
            <span>{isRegisterMode ? 'Tạo Tài Khoản Mới' : 'Đăng Nhập Với Email'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {!isRegisterMode && (
            <div className="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 p-2.5 text-[11px] text-amber-900 dark:text-amber-300">
              <span className="font-bold">Tài khoản Admin mẫu:</span> admin@nhaxuong.vn | Pass: 123456
            </div>
          )}
        </form>
      )}

      <div className="mt-5 text-center">
        <Link to="/" className="text-xs text-slate-500 hover:text-teal-600 dark:hover:text-teal-400">
          ← Quay về trang chủ Nhà Xưởng
        </Link>
      </div>
    </div>
  )
}
