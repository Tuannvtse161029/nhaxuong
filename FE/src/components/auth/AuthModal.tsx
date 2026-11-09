import { useState } from 'react'
import {
  X,
  Smartphone,
  Mail,
  User as UserIcon,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Sparkles,
  KeyRound,
  ArrowLeft,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { GoogleLoginButton } from './GoogleLoginButton'
import { PinBoxInput } from './PinBoxInput'

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
    sendEmailOtp,
    forgotPinSendOtp,
    forgotPinReset,
  } = useAuth()

  // Form Modes
  const [method, setMethod] = useState<'phone' | 'email'>('phone')
  const [isForgotPinMode, setIsForgotPinMode] = useState(false)

  // Phone Form States
  const [phone, setPhone] = useState('')
  const [phoneName, setPhoneName] = useState('')
  const [phonePin, setPhonePin] = useState('')
  const [phoneConfirmPin, setPhoneConfirmPin] = useState('')
  const [phoneUseOtpLogin, setPhoneUseOtpLogin] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpCountdown, setOtpCountdown] = useState(0)

  // Email & PIN Form States
  const [email, setEmail] = useState('')
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [name, setName] = useState('')
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

  // General States
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  if (!isAuthModalOpen) return null

  const isLogin = authModalTab === 'login'

  const handleSendPhoneOtp = async () => {
    const cleanedPhone = phone.replace(/\D/g, '')
    if (!cleanedPhone) {
      setError('Vui lòng nhập số điện thoại')
      return
    }
    if (cleanedPhone.length !== 10 && cleanedPhone.length !== 11) {
      setError('Số điện thoại không hợp lệ! Bắt buộc phải có đúng 10 hoặc 11 chữ số.')
      return
    }
    setError(null)
    setSuccessMsg(null)
    setIsLoading(true)

    try {
      await sendOtp(phone.trim(), isLogin ? 'login' : 'register')
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
    } catch (err: unknown) {
      console.error('Send OTP error:', err)
      setError(err instanceof Error ? err.message : 'Không thể gửi mã OTP. Vui lòng thử lại sau.')
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
    const cleanedPhone = phone.replace(/\D/g, '')
    if (!cleanedPhone) {
      setError('Vui lòng nhập số điện thoại')
      return
    }
    if (cleanedPhone.length !== 10 && cleanedPhone.length !== 11) {
      setError('Số điện thoại không hợp lệ! Bắt buộc phải có đúng 10 hoặc 11 chữ số.')
      return
    }

    if (!isLogin) {
      // Register with Phone
      if (!otpSent) {
        setError('Vui lòng bấm nút "Gửi Mã OTP" để nhận mã xác thực qua tin nhắn SMS trước.')
        return
      }
      if (otp.length !== 6) {
        setError('Vui lòng nhập đầy đủ mã OTP 6 số từ tin nhắn SMS.')
        return
      }
      if (phonePin.length !== 6) {
        setError('Mã PIN bảo mật bắt buộc phải có đúng 6 chữ số.')
        return
      }
      if (phonePin !== phoneConfirmPin) {
        setError('Mã PIN và Xác nhận mã PIN không trùng khớp!')
        return
      }
    } else {
      // Login with Phone
      if (phoneUseOtpLogin) {
        if (!otpSent) {
          setError('Vui lòng bấm nút "Gửi Mã OTP" để nhận mã đăng nhập qua tin nhắn SMS.')
          return
        }
        if (otp.length !== 6) {
          setError('Vui lòng nhập mã OTP 6 số từ tin nhắn SMS.')
          return
        }
      } else {
        if (phonePin.length !== 6) {
          setError('Vui lòng nhập đúng mã PIN bảo mật 6 số của bạn.')
          return
        }
      }
    }

    setError(null)
    setIsLoading(true)

    try {
      if (isLogin) {
        if (phoneUseOtpLogin) {
          await loginWithPhone(phone.trim(), otp.trim())
        } else {
          await loginWithPhone(phone.trim(), undefined, undefined, phonePin.trim())
        }
      } else {
        await registerWithPhone(
          phone.trim(),
          phoneName.trim() || `Khách Hàng (${phone.slice(-4)})`,
          otp.trim(),
          phonePin.trim()
        )
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Thao tác số điện thoại thất bại')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendEmailOtp = async () => {
    if (!email.trim() || !email.includes('@')) {
      setError('Vui lòng nhập địa chỉ email hợp lệ')
      return
    }
    setError(null)
    setSuccessMsg(null)
    setIsLoading(true)

    try {
      const generatedOtp = await sendEmailOtp(email.trim(), isLogin ? 'login' : 'register')
      setEmailOtpSent(true)
      if (generatedOtp) {
        setEmailOtp(generatedOtp)
        setSuccessMsg(`Mã xác thực OTP đã gửi về hòm thư ${email.trim()} (Mã của bạn: ${generatedOtp}).`)
      } else {
        setEmailOtp('')
        setSuccessMsg(`Mã xác thực OTP đã được gửi về hòm thư ${email.trim()}. Vui lòng kiểm tra hộp thư đến (hoặc hòm thư spam)!`)
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
    } catch (err: unknown) {
      console.error('Send Email OTP error:', err)
      setError(err instanceof Error ? err.message : 'Không thể gửi mã xác thực qua email.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) {
      setError('Vui lòng nhập địa chỉ email')
      return
    }
    if (pin.length !== 6) {
      setError('Mã PIN bảo mật bắt buộc phải có đúng 6 chữ số')
      return
    }
    if (!isLogin && pin !== confirmPin) {
      setError('Mã PIN xác nhận không trùng khớp!')
      return
    }
    if (!isLogin && email.trim().toLowerCase() !== 'admin@nhaxuong.vn') {
      if (!emailOtpSent) {
        setError('Vui lòng bấm nút "Gửi Mã OTP" để nhận mã xác thực qua email trước.')
        return
      }
      if (emailOtp.length !== 6) {
        setError('Vui lòng nhập mã xác thực OTP 6 số đã được gửi về email của bạn.')
        return
      }
    }

    setError(null)
    setIsLoading(true)

    try {
      if (isLogin) {
        await login({
          email: email.trim(),
          password: pin.trim(),
          pin: pin.trim(),
          otp: emailOtp.trim(),
        })
      } else {
        await register({
          email: email.trim(),
          password: pin.trim(),
          pin: pin.trim(),
          name: name.trim() || email.split('@')[0],
          otp: emailOtp.trim(),
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập / Đăng ký không thành công')
    } finally {
      setIsLoading(false)
    }
  }

  // Forgot PIN Handlers
  const handleForgotPinSendOtp = async () => {
    if (!forgotTarget.trim()) {
      setError(forgotMethod === 'email' ? 'Vui lòng nhập địa chỉ email đã đăng ký' : 'Vui lòng nhập số điện thoại đã đăng ký')
      return
    }
    setError(null)
    setIsLoading(true)
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
      setIsLoading(false)
    }
  }

  const handleForgotPinResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!forgotTarget.trim()) {
      setError('Vui lòng nhập thông tin tài khoản')
      return
    }
    if (forgotOtp.length !== 6) {
      setError('Vui lòng nhập mã xác thực OTP 6 số')
      return
    }
    if (forgotNewPin.length !== 6) {
      setError('Mã PIN mới bắt buộc phải đúng 6 chữ số')
      return
    }
    if (forgotNewPin !== forgotConfirmPin) {
      setError('Mã PIN mới và xác nhận mã PIN không trùng khớp')
      return
    }

    setError(null)
    setIsLoading(true)
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
        openAuthModal('login')
        setPin(forgotNewPin.trim())
        setPhonePin(forgotNewPin.trim())
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
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="mb-5">
            {isForgotPinMode ? (
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPinMode(false)
                    setError(null)
                    setSuccessMsg(null)
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white mb-2 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại Đăng Nhập</span>
                </button>
                <div className="flex items-center gap-2 mb-1">
                  <KeyRound className="w-5 h-5 text-teal-600" />
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    Quên Mã PIN Bảo Mật
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Nhận mã OTP qua Email hoặc Số điện thoại để tạo mã PIN 6 số mới.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-5 h-5 text-teal-600" />
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    {isLogin ? 'Đăng Nhập Hệ Thống' : 'Đăng Ký Tài Khoản'}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isLogin
                    ? 'Đăng nhập nhanh bằng Mã PIN 6 số bảo mật chuẩn ngân hàng.'
                    : 'Đăng ký tài khoản với Mã PIN 6 số tiện lợi, an toàn.'}
                </p>
              </div>
            )}
          </div>

          {/* Feedback alerts */}
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

          {/* IF FORGOT PIN MODE */}
          {isForgotPinMode ? (
            <div>
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

              <form onSubmit={handleForgotPinResetSubmit} className="space-y-4">
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
                        placeholder={forgotMethod === 'email' ? 'ban@gmail.com' : '090 123 4567'}
                        value={forgotTarget}
                        onChange={(e) => setForgotTarget(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleForgotPinSendOtp}
                      disabled={isLoading || forgotOtpCountdown > 0}
                      className="rounded-xl bg-teal-600 px-3 py-2 text-xs font-bold text-white hover:bg-teal-700 disabled:opacity-50 transition shrink-0"
                    >
                      {forgotOtpCountdown > 0 ? `${forgotOtpCountdown}s` : forgotOtpSent ? 'Gửi Lại OTP' : 'Gửi Mã OTP'}
                    </button>
                  </div>
                </div>

                {forgotOtpSent && (
                  <PinBoxInput
                    label="Mã Xác Thực OTP"
                    value={forgotOtp}
                    onChange={setForgotOtp}
                    isOtp={true}
                    idPrefix="modal-forgot-otp"
                    sublabel="Nhập 6 số OTP từ hòm thư / điện thoại"
                  />
                )}

                <PinBoxInput
                  label="Mã PIN 6 Số Mới"
                  value={forgotNewPin}
                  onChange={setForgotNewPin}
                  idPrefix="modal-forgot-new-pin"
                  sublabel="Nhập 6 số PIN mới bạn muốn đặt"
                />

                <PinBoxInput
                  label="Xác Nhận Mã PIN 6 Số Mới"
                  value={forgotConfirmPin}
                  onChange={setForgotConfirmPin}
                  idPrefix="modal-forgot-confirm-pin"
                  sublabel="Nhập lại đúng 6 số PIN ở trên"
                />

                <button
                  type="submit"
                  disabled={isLoading || !forgotOtpSent}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-600 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-teal-700 transition disabled:opacity-50 mt-2"
                >
                  <span>Xác Nhận & Đổi Mã PIN</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            <div>
              {/* Login / Register Tab switcher */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-4">
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition ${
                    isLogin
                      ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  Đăng Nhập
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition ${
                    !isLogin
                      ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  Đăng Ký Mới
                </button>
              </div>

              {/* 1. GOOGLE LOGIN */}
              <GoogleLoginButton
                text={isLogin ? 'continue_with' : 'signup_with'}
                onSuccess={closeAuthModal}
                onError={(err) => setError(err.message)}
                className="mb-4"
              />

              {/* Divider */}
              <div className="relative flex items-center justify-center py-1 mb-3">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                <span className="absolute bg-white dark:bg-slate-900 px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Hoặc
                </span>
              </div>

              {/* 2. METHOD SWITCHER (PHONE / EMAIL) */}
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

              {/* 3. PHONE FORM */}
              {method === 'phone' && (
                <form onSubmit={handlePhoneSubmit} className="space-y-4 pt-1">
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
                      {(!isLogin || phoneUseOtpLogin) && (
                        <button
                          type="button"
                          onClick={handleSendPhoneOtp}
                          disabled={isLoading || otpCountdown > 0}
                          className="rounded-xl bg-teal-600 px-3 py-2 text-xs font-bold text-white hover:bg-teal-700 disabled:opacity-50 transition shrink-0"
                        >
                          {otpCountdown > 0 ? `${otpCountdown}s` : otpSent ? 'Gửi Lại OTP' : 'Gửi Mã OTP'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* If Register: OTP + PIN setup */}
                  {!isLogin && (
                    <>
                      {otpSent && (
                        <PinBoxInput
                          label="Mã Xác Thực SMS"
                          value={otp}
                          onChange={setOtp}
                          isOtp={true}
                          idPrefix="modal-phone-otp"
                          sublabel="Mã OTP 6 số từ tin nhắn SMS"
                        />
                      )}

                      <PinBoxInput
                        label="Tạo Mã PIN Bảo Mật (6 Số)"
                        value={phonePin}
                        onChange={setPhonePin}
                        idPrefix="modal-phone-reg-pin"
                        sublabel="Thiết lập mã PIN 6 số cho tài khoản SĐT"
                      />

                      <PinBoxInput
                        label="Xác Nhận Mã PIN (6 Số)"
                        value={phoneConfirmPin}
                        onChange={setPhoneConfirmPin}
                        idPrefix="modal-phone-reg-confirm-pin"
                        sublabel="Nhập lại đúng 6 số PIN ở trên"
                      />
                    </>
                  )}

                  {/* If Login: Phone PIN code OR quick SMS OTP */}
                  {isLogin && (
                    <>
                      {!phoneUseOtpLogin ? (
                        <>
                          <PinBoxInput
                            label="Mã PIN Bảo Mật (6 Số)"
                            value={phonePin}
                            onChange={setPhonePin}
                            idPrefix="modal-phone-login-pin"
                            onForgotPin={() => {
                              setIsForgotPinMode(true)
                              setError(null)
                              setSuccessMsg(null)
                              setForgotTarget(phone)
                              setForgotMethod('phone')
                            }}
                            sublabel="Nhập 6 số PIN để đăng nhập"
                          />
                          <div className="text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setPhoneUseOtpLogin(true)
                                setError(null)
                              }}
                              className="text-[11px] text-teal-600 hover:text-teal-700 dark:text-teal-400 font-semibold"
                            >
                              ⚡ Đăng nhập bằng SMS OTP thay vì PIN
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          {otpSent && (
                            <PinBoxInput
                              label="Mã Xác Thực SMS (6 Số)"
                              value={otp}
                              onChange={setOtp}
                              isOtp={true}
                              idPrefix="modal-phone-login-otp"
                              sublabel="Nhập 6 số từ tin nhắn SMS"
                            />
                          )}
                          <div className="text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setPhoneUseOtpLogin(false)
                                setError(null)
                              }}
                              className="text-[11px] text-teal-600 hover:text-teal-700 dark:text-teal-400 font-semibold"
                            >
                              🔑 Đăng nhập bằng Mã PIN 6 số
                            </button>
                          </div>
                        </>
                      )}
                    </>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-700 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-teal-800 transition disabled:opacity-50"
                  >
                    <span>{isLogin ? 'Đăng Nhập Số Điện Thoại' : 'Đăng Ký Tài Khoản SĐT'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* 4. EMAIL & PIN FORM */}
              {method === 'email' && (
                <form onSubmit={handleEmailSubmit} className="space-y-4 pt-1">
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
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type="email"
                          placeholder="ban@gmail.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono"
                          required
                        />
                      </div>
                      {!isLogin && (
                        <button
                          type="button"
                          onClick={handleSendEmailOtp}
                          disabled={isLoading || emailOtpCountdown > 0}
                          className="rounded-xl bg-teal-600 px-3 py-2 text-xs font-bold text-white hover:bg-teal-700 disabled:opacity-50 transition shrink-0"
                        >
                          {emailOtpCountdown > 0 ? `${emailOtpCountdown}s` : emailOtpSent ? 'Gửi Lại OTP' : 'Gửi Mã OTP'}
                        </button>
                      )}
                    </div>
                  </div>

                  {!isLogin && emailOtpSent && (
                    <PinBoxInput
                      label="Mã Xác Thực Email"
                      value={emailOtp}
                      onChange={setEmailOtp}
                      isOtp={true}
                      idPrefix="modal-email-reg-otp"
                      sublabel="Nhập 6 số xác thực từ hòm thư của bạn"
                    />
                  )}

                  {/* Mã PIN 6 số */}
                  <PinBoxInput
                    label={isLogin ? 'Mã PIN Bảo Mật (6 Số)' : 'Tạo Mã PIN Bảo Mật (6 Số)'}
                    value={pin}
                    onChange={setPin}
                    idPrefix="modal-email-pin"
                    onForgotPin={
                      isLogin
                        ? () => {
                            setIsForgotPinMode(true)
                            setError(null)
                            setSuccessMsg(null)
                            setForgotTarget(email)
                            setForgotMethod('email')
                          }
                        : undefined
                    }
                    sublabel={isLogin ? 'Nhập 6 số PIN để đăng nhập' : 'Thiết lập mã PIN 6 số dễ nhớ'}
                  />

                  {!isLogin && (
                    <PinBoxInput
                      label="Nhập Lại Mã PIN (6 Số)"
                      value={confirmPin}
                      onChange={setConfirmPin}
                      idPrefix="modal-email-confirm-pin"
                      sublabel="Xác nhận đúng 6 số PIN ở trên"
                    />
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-slate-800 dark:bg-teal-700 dark:hover:bg-teal-600 transition disabled:opacity-50"
                  >
                    <span>{isLogin ? 'Đăng Nhập Với Mã PIN' : 'Tạo Tài Khoản Với Mã PIN'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {isLogin && (
                    <div className="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 p-2.5 text-[11px] text-amber-900 dark:text-amber-300">
                      <span className="font-bold">Tài khoản Admin mẫu:</span> admin@nhaxuong.vn | Mã PIN: 123456
                    </div>
                  )}
                </form>
              )}

              {/* Privacy & Terms */}
              <p className="text-[10px] text-center text-slate-400 leading-relaxed pt-2">
                Bằng việc tiếp tục, bạn đồng ý với <b>Quy chế hoạt động sàn</b> và <b>Chính sách bảo mật</b> của NHAXUONG.VN.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
