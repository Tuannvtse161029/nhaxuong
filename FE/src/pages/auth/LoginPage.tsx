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
  ShieldCheck,
  KeyRound,
  ArrowLeft,
  Eye,
  EyeOff,
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
    sendEmailOtp,
    forgotPinSendOtp,
    forgotPinReset,
  } = useAuth()

  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [isForgotPinMode, setIsForgotPinMode] = useState(false)
  const [method, setMethod] = useState<'phone' | 'email'>('phone')

  // Phone states
  const [phone, setPhone] = useState('')
  const [phoneName, setPhoneName] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpCountdown, setOtpCountdown] = useState(0)

  // Email / PIN states
  const [email, setEmail] = useState('')
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [name, setName] = useState('')
  const [showPin, setShowPin] = useState(false)
  const [emailOtp, setEmailOtp] = useState('')
  const [emailOtpSent, setEmailOtpSent] = useState(false)
  const [emailOtpCountdown, setEmailOtpCountdown] = useState(0)

  // Forgot PIN states
  const [forgotMethod, setForgotMethod] = useState<'email' | 'phone'>('email')
  const [forgotTarget, setForgotTarget] = useState('')
  const [forgotOtp, setForgotOtp] = useState('')
  const [forgotOtpSent, setForgotOtpSent] = useState(false)
  const [forgotOtpCountdown, setForgotOtpCountdown] = useState(0)
  const [forgotNewPin, setForgotNewPin] = useState('')
  const [forgotConfirmPin, setForgotConfirmPin] = useState('')

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
      await sendOtp(phone.trim(), isRegisterMode ? 'register' : 'login')
      setOtpSent(true)
      setOtp('')
      setSuccessMsg(`Mã OTP đã được gửi qua tin nhắn SMS tới số ${phone.trim()}. Vui lòng kiểm tra điện thoại của bạn!`)
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
    if (!otpSent) {
      setError('Vui lòng bấm nút "Gửi Mã OTP" để nhận mã xác thực qua tin nhắn SMS trước.')
      return
    }
    if (!otp.trim()) {
      setError('Vui lòng nhập mã OTP 6 số từ tin nhắn SMS.')
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

  const handleSendEmailOtp = async () => {
    if (!email.trim() || !email.includes('@')) {
      setError('Vui lòng nhập địa chỉ email hợp lệ')
      return
    }
    setError(null)
    setIsSubmitting(true)
    try {
      const generatedOtp = await sendEmailOtp(email.trim(), isRegisterMode ? 'register' : 'login')
      setEmailOtpSent(true)
      if (generatedOtp) {
        setEmailOtp(generatedOtp)
        setSuccessMsg(`Mã xác thực OTP đã gửi về hòm thư ${email.trim()} (Mã của bạn: ${generatedOtp}). Vui lòng kiểm tra email!`)
      } else {
        setEmailOtp('')
        setSuccessMsg(`Mã xác thực OTP đã được gửi qua email tới ${email.trim()}. Vui lòng kiểm tra hộp thư đến của bạn!`)
      }
      setEmailOtpCountdown(60)
      const timer = setInterval(() => {
        setEmailOtpCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể gửi mã OTP qua email')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !pin.trim()) {
      setError('Vui lòng nhập email và mã PIN 6 số')
      return
    }
    if (!/^\d{6}$/.test(pin.trim())) {
      setError('Mã PIN bảo mật bắt buộc phải có đúng 6 chữ số (từ 0-9)')
      return
    }
    if (isRegisterMode && pin !== confirmPin) {
      setError('Mã PIN xác nhận không trùng khớp!')
      return
    }
    if (email.trim().toLowerCase() !== 'admin@nhaxuong.vn') {
      if (!emailOtpSent) {
        setError('Vui lòng bấm nút "Gửi Mã OTP" để nhận mã xác thực qua email trước khi tiếp tục.')
        return
      }
      if (!emailOtp.trim()) {
        setError('Vui lòng nhập mã OTP 6 số đã được gửi về email của bạn.')
        return
      }
    }

    setError(null)
    setIsSubmitting(true)
    try {
      if (isRegisterMode) {
        await register({
          email: email.trim(),
          password: pin.trim(),
          pin: pin.trim(),
          name: name.trim() || email.split('@')[0],
          otp: emailOtp.trim(),
        })
      } else {
        await login({
          email: email.trim(),
          password: pin.trim(),
          pin: pin.trim(),
          otp: emailOtp.trim(),
        })
      }
      navigate(from, { replace: true })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Thao tác không thành công')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Forgot PIN Send OTP
  const handleForgotPinSendOtp = async () => {
    if (!forgotTarget.trim()) {
      setError(forgotMethod === 'email' ? 'Vui lòng nhập địa chỉ email đã đăng ký' : 'Vui lòng nhập số điện thoại đã đăng ký')
      return
    }
    setError(null)
    setIsSubmitting(true)
    try {
      const res = await forgotPinSendOtp({
        method: forgotMethod,
        target: forgotTarget.trim(),
      })
      setForgotOtpSent(true)
      if (res.otp) {
        setForgotOtp(res.otp)
      }
      setSuccessMsg(res.message || `Mã OTP đã được gửi đến ${forgotTarget.trim()}!`)
      setForgotOtpCountdown(60)
      const timer = setInterval(() => {
        setForgotOtpCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể gửi mã OTP đặt lại mã PIN')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Forgot PIN Reset
  const handleForgotPinResetSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!forgotTarget.trim()) {
      setError('Vui lòng nhập thông tin tài khoản')
      return
    }
    if (!forgotOtp.trim()) {
      setError('Vui lòng nhập mã xác thực OTP 6 số')
      return
    }
    if (!/^\d{6}$/.test(forgotNewPin.trim())) {
      setError('Mã PIN mới bắt buộc phải đúng 6 chữ số (ví dụ: 123456)')
      return
    }
    if (forgotNewPin.trim() !== forgotConfirmPin.trim()) {
      setError('Mã PIN mới và xác nhận mã PIN không trùng khớp')
      return
    }

    setError(null)
    setIsSubmitting(true)
    try {
      const res = await forgotPinReset({
        method: forgotMethod,
        target: forgotTarget.trim(),
        otp: forgotOtp.trim(),
        newPin: forgotNewPin.trim(),
        confirmPin: forgotConfirmPin.trim(),
      })
      setSuccessMsg(res.message || 'Đặt lại mã PIN 6 số thành công! Vui lòng đăng nhập với mã PIN mới.')
      setTimeout(() => {
        setIsForgotPinMode(false)
        setIsRegisterMode(false)
        setPin(forgotNewPin.trim())
        if (forgotMethod === 'email') {
          setEmail(forgotTarget.trim())
          setMethod('email')
        } else {
          setPhone(forgotTarget.trim())
          setMethod('phone')
        }
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đặt lại mã PIN không thành công')
    } finally {
      setIsSubmitting(false)
    }
  }

  // VIEW: FORGOT PIN FLOW
  if (isForgotPinMode) {
    return (
      <div>
        <button
          type="button"
          onClick={() => {
            setIsForgotPinMode(false)
            setError(null)
            setSuccessMsg(null)
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white mb-4 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại trang Đăng Nhập</span>
        </button>

        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1 flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-teal-600" />
          Quên Mã PIN Bảo Mật
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
          Nhập mã OTP từ Email hoặc Số điện thoại để đặt lại mã PIN 6 số mới cho tài khoản.
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

        {/* Method Switcher for Forgot PIN */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4">
          <button
            type="button"
            onClick={() => {
              setForgotMethod('email')
              setError(null)
            }}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition ${
              forgotMethod === 'email'
                ? 'bg-white text-teal-800 shadow-xs dark:bg-slate-700 dark:text-teal-300'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Qua Email</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setForgotMethod('phone')
              setError(null)
            }}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition ${
              forgotMethod === 'phone'
                ? 'bg-white text-teal-800 shadow-xs dark:bg-slate-700 dark:text-teal-300'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Qua Số Điện Thoại</span>
          </button>
        </div>

        <form onSubmit={handleForgotPinResetSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {forgotMethod === 'email' ? 'Địa Chỉ Email Đăng Ký' : 'Số Điện Thoại Đăng Ký (+84)'}
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                {forgotMethod === 'email' ? (
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                ) : (
                  <Smartphone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                )}
                <input
                  type={forgotMethod === 'email' ? 'email' : 'tel'}
                  placeholder={forgotMethod === 'email' ? 'VD: ban@gmail.com' : 'VD: 090 123 4567'}
                  value={forgotTarget}
                  onChange={(e) => setForgotTarget(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono"
                  required
                />
              </div>
              <button
                type="button"
                onClick={handleForgotPinSendOtp}
                disabled={isSubmitting || forgotOtpCountdown > 0}
                className="rounded-xl bg-teal-600 px-3 py-2 text-xs font-bold text-white hover:bg-teal-700 disabled:opacity-50 transition shrink-0"
              >
                {forgotOtpCountdown > 0 ? `${forgotOtpCountdown}s` : forgotOtpSent ? 'Gửi Lại OTP' : 'Gửi Mã OTP'}
              </button>
            </div>
          </div>

          {forgotOtpSent && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Mã Xác Thực OTP (6 Số)
                </label>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Hiệu lực 5 phút
                </span>
              </div>
              <input
                type="text"
                maxLength={6}
                inputMode="numeric"
                placeholder="Nhập 6 số OTP (VD: 123456)"
                value={forgotOtp}
                onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-center text-sm font-mono tracking-widest font-bold focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              />
            </div>
          )}

          {/* New PIN & Confirm PIN */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Mã PIN 6 Số Mới
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type={showPin ? 'text' : 'password'}
                maxLength={6}
                inputMode="numeric"
                placeholder="Nhập mã PIN 6 số (VD: 654321)"
                value={forgotNewPin}
                onChange={(e) => setForgotNewPin(e.target.value.replace(/\D/g, ''))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-9 text-xs font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Xác Nhận Mã PIN 6 Số Mới
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type={showPin ? 'text' : 'password'}
                maxLength={6}
                inputMode="numeric"
                placeholder="Nhập lại mã PIN 6 số"
                value={forgotConfirmPin}
                onChange={(e) => setForgotConfirmPin(e.target.value.replace(/\D/g, ''))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !forgotOtpSent}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-600 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-teal-700 transition disabled:opacity-50 mt-2"
          >
            <span>Xác Nhận & Đặt Lại Mã PIN</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    )
  }

  // VIEW: NORMAL LOGIN & REGISTER
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
          ? 'Tạo tài khoản bằng Mã PIN 6 số tiện lợi, an toàn, hỗ trợ số điện thoại & email.'
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
          <span>Email & Mã PIN</span>
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
                  Mã Xác Thực OTP (6 Số)
                </label>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Tin nhắn SMS Viễn Thông (Hạn 3 phút)
                </span>
              </div>
              <input
                type="text"
                maxLength={6}
                inputMode="numeric"
                placeholder="Nhập 6 số OTP (VD: 123456)"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
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

      {/* 3. EMAIL & PIN FORM */}
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
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="VD: ban@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono"
                  required
                />
              </div>
              <button
                type="button"
                onClick={handleSendEmailOtp}
                disabled={isSubmitting || emailOtpCountdown > 0}
                className="rounded-xl bg-teal-600 px-3 py-2 text-xs font-bold text-white hover:bg-teal-700 disabled:opacity-50 transition shrink-0"
              >
                {emailOtpCountdown > 0 ? `${emailOtpCountdown}s` : emailOtpSent ? 'Gửi Lại OTP' : 'Gửi Mã OTP'}
              </button>
            </div>
          </div>

          {emailOtpSent && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Mã Xác Thực Email (6 Số)
                </label>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Hộp thư đến/Spam (Hạn 5 phút)
                </span>
              </div>
              <input
                type="text"
                maxLength={6}
                inputMode="numeric"
                placeholder="Nhập 6 số OTP từ Email (VD: 123456)"
                value={emailOtp}
                onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-center text-sm font-mono tracking-widest font-bold focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required={email.trim().toLowerCase() !== 'admin@nhaxuong.vn'}
              />
            </div>
          )}

          {/* PIN 6 số */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {isRegisterMode ? 'Mã PIN Bảo Mật (6 Chữ Số)' : 'Mã PIN Bảo Mật (6 Số)'}
              </label>
              {!isRegisterMode && (
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPinMode(true)
                    setError(null)
                    setSuccessMsg(null)
                    setForgotTarget(email)
                    setForgotMethod('email')
                  }}
                  className="text-xs font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400"
                >
                  Quên mã PIN?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type={showPin ? 'text' : 'password'}
                maxLength={6}
                inputMode="numeric"
                placeholder="•••••• (Nhập 6 số PIN, VD: 123456)"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-9 text-xs font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
              Mã PIN gồm đúng 6 chữ số, dễ nhớ và an toàn hơn mật khẩu dài.
            </p>
          </div>

          {isRegisterMode && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nhập Lại Mã PIN (6 Số)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type={showPin ? 'text' : 'password'}
                  maxLength={6}
                  inputMode="numeric"
                  placeholder="•••••• (Nhập lại đúng 6 số)"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
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
            <span>{isRegisterMode ? 'Tạo Tài Khoản Với Mã PIN 6 Số' : 'Đăng Nhập Với Mã PIN'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {!isRegisterMode && (
            <div className="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 p-2.5 text-[11px] text-amber-900 dark:text-amber-300">
              <span className="font-bold">Tài khoản Admin mẫu:</span> admin@nhaxuong.vn | Mã PIN: 123456
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
