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
  ShieldCheck,
  Send,
  Eye,
  EyeOff,
  Lock,
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

  // General States
  const [regStep, setRegStep] = useState<1 | 2>(1)
  const [isForgotPinMode, setIsForgotPinMode] = useState(false)
  const [regMethod, setRegMethod] = useState<'phone' | 'email'>('phone')

  // UNIFIED LOGIN FORM STATES
  const [loginIdentifier, setLoginIdentifier] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [useSmsOtpLogin, setUseSmsOtpLogin] = useState(false)
  const [loginOtp, setLoginOtp] = useState('')
  const [loginOtpSent, setLoginOtpSent] = useState(false)
  const [loginOtpCountdown, setLoginOtpCountdown] = useState(0)

  // PHONE REGISTRATION FORM STATES
  const [phone, setPhone] = useState('')
  const [phoneName, setPhoneName] = useState('')
  const [phonePin, setPhonePin] = useState('')
  const [phoneConfirmPin, setPhoneConfirmPin] = useState('')
  const [phoneOtp, setPhoneOtp] = useState('')
  const [phoneOtpCountdown, setPhoneOtpCountdown] = useState(0)

  // EMAIL REGISTRATION FORM STATES
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [emailPin, setEmailPin] = useState('')
  const [emailConfirmPin, setEmailConfirmPin] = useState('')
  const [emailOtp, setEmailOtp] = useState('')
  const [emailOtpCountdown, setEmailOtpCountdown] = useState(0)

  // FORGOT PIN STATES
  const [forgotMethod, setForgotMethod] = useState<'email' | 'phone'>('email')
  const [forgotTarget, setForgotTarget] = useState('')
  const [forgotOtp, setForgotOtp] = useState('')
  const [forgotOtpSent, setForgotOtpSent] = useState(false)
  const [forgotOtpCountdown, setForgotOtpCountdown] = useState(0)
  const [forgotNewPin, setForgotNewPin] = useState('')
  const [forgotConfirmPin, setForgotConfirmPin] = useState('')

  // Feedback States
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  if (!isAuthModalOpen) return null

  const isLogin = authModalTab === 'login'

  const handleTabSwitch = (tab: 'login' | 'register') => {
    openAuthModal(tab)
    setRegStep(1)
    setError(null)
    setSuccessMsg(null)
  }

  // --- UNIFIED LOGIN SUBMIT (Handles 'admin', email, or phone) ---
  const handleUnifiedLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const id = loginIdentifier.trim()
    const pass = loginPassword.trim()

    if (!id) {
      setError('Vui lòng nhập tên tài khoản, địa chỉ email hoặc số điện thoại của bạn.')
      return
    }

    // If using SMS OTP login mode for phone
    if (useSmsOtpLogin) {
      const cleanedPhone = id.replace(/\D/g, '')
      if (cleanedPhone.length < 9) {
        setError('Vui lòng nhập số điện thoại hợp lệ để nhận mã OTP SMS.')
        return
      }
      if (!loginOtpSent) {
        setError('Vui lòng nhấn nút "Gửi Mã OTP" để nhận mã xác thực đăng nhập qua tin nhắn SMS.')
        return
      }
      if (loginOtp.length !== 6) {
        setError('Vui lòng nhập đủ mã OTP 6 số từ tin nhắn SMS.')
        return
      }

      setError(null)
      setIsLoading(true)
      try {
        await loginWithPhone(cleanedPhone, loginOtp.trim())
        closeAuthModal()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Đăng nhập bằng mã OTP thất bại')
      } finally {
        setIsLoading(false)
      }
      return
    }

    if (!pass) {
      setError('Vui lòng nhập mật khẩu hoặc mã PIN 6 số.')
      return
    }

    setError(null)
    setIsLoading(true)
    try {
      const isEmailLike = id.includes('@')
      const isPurePhone = /^[0-9+ ]+$/.test(id) && id.replace(/\D/g, '').length >= 9
      const isAdmin = id.toLowerCase() === 'admin'

      if (isAdmin) {
        await login({
          email: 'admin@nhaxuong.vn',
          password: pass,
          pin: pass,
        })
      } else if (isPurePhone) {
        const cleanPhone = id.replace(/\D/g, '')
        await loginWithPhone(cleanPhone, undefined, undefined, pass)
      } else {
        await login({
          email: isEmailLike ? id.toLowerCase() : `${id}@nhaxuong.vn`,
          password: pass,
          pin: pass,
        })
      }
      closeAuthModal()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin!')
    } finally {
      setIsLoading(false)
    }
  }

  // Send SMS OTP for Login
  const handleSendLoginOtp = async () => {
    const cleaned = loginIdentifier.replace(/\D/g, '')
    if (cleaned.length < 10) {
      setError('Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 hoặc 11 chữ số.')
      return
    }
    setError(null)
    setIsLoading(true)
    try {
      await sendOtp(cleaned, 'login')
      setLoginOtpSent(true)
      setLoginOtp('')
      setSuccessMsg(`Mã OTP đã được gửi qua SMS tới số ${cleaned}. Vui lòng kiểm tra tin nhắn!`)
      setLoginOtpCountdown(60)
      const timer = setInterval(() => {
        setLoginOtpCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể gửi mã OTP SMS.')
    } finally {
      setIsLoading(false)
    }
  }

  // --- PHONE REGISTRATION STEP 1 ---
  const handlePhoneRegisterStep1 = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length < 10 || cleaned.length > 11) {
      setError('Số điện thoại không hợp lệ! Bắt buộc phải có đúng 10 hoặc 11 chữ số.')
      return
    }
    if (!phoneName.trim()) {
      setError('Vui lòng nhập Họ và Tên của bạn.')
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

    setError(null)
    setIsLoading(true)
    try {
      await sendOtp(cleaned, 'register')
      setPhoneOtp('')
      setSuccessMsg(`Mã xác thực OTP 6 số đã được gửi qua tin nhắn SMS tới ${cleaned}. Vui lòng kiểm tra điện thoại!`)
      setPhoneOtpCountdown(60)
      setRegStep(2)
      const timer = setInterval(() => {
        setPhoneOtpCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể gửi mã OTP qua tin nhắn SMS.')
    } finally {
      setIsLoading(false)
    }
  }

  // PHONE REGISTRATION STEP 2 (Verify OTP)
  const handlePhoneRegisterStep2 = async (e: React.FormEvent) => {
    e.preventDefault()
    if (phoneOtp.length !== 6) {
      setError('Vui lòng nhập đầy đủ mã xác thực OTP 6 số từ tin nhắn SMS.')
      return
    }
    setError(null)
    setIsLoading(true)
    try {
      await registerWithPhone(
        phone.replace(/\D/g, '').trim(),
        phoneName.trim() || `Khách Hàng (${phone.slice(-4)})`,
        phoneOtp.trim(),
        phonePin.trim()
      )
      closeAuthModal()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xác thực mã OTP thất bại')
    } finally {
      setIsLoading(false)
    }
  }

  // --- EMAIL REGISTRATION STEP 1 ---
  const handleEmailRegisterStep1 = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Vui lòng nhập Họ và Tên của bạn.')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Vui lòng nhập địa chỉ email hợp lệ.')
      return
    }
    if (emailPin.length !== 6) {
      setError('Mã PIN bảo mật bắt buộc phải có đúng 6 chữ số.')
      return
    }
    if (emailPin !== emailConfirmPin) {
      setError('Mã PIN và Xác nhận mã PIN không trùng khớp!')
      return
    }

    setError(null)
    setIsLoading(true)
    try {
      await sendEmailOtp(email.trim(), 'register')
      setEmailOtp('')
      setSuccessMsg(`Mã xác thực OTP 6 số đã được gửi tới hòm thư ${email.trim()}. Vui lòng kiểm tra hộp thư đến (hoặc spam)!`)
      setEmailOtpCountdown(60)
      setRegStep(2)
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
      setError(err instanceof Error ? err.message : 'Không thể gửi mã xác thực qua email.')
    } finally {
      setIsLoading(false)
    }
  }

  // EMAIL REGISTRATION STEP 2 (Verify OTP)
  const handleEmailRegisterStep2 = async (e: React.FormEvent) => {
    e.preventDefault()
    if (emailOtp.length !== 6) {
      setError('Vui lòng nhập đầy đủ mã xác thực OTP 6 số từ email của bạn.')
      return
    }
    setError(null)
    setIsLoading(true)
    try {
      await register({
        email: email.trim(),
        password: emailPin.trim(),
        pin: emailPin.trim(),
        name: name.trim() || email.split('@')[0],
        otp: emailOtp.trim(),
      })
      closeAuthModal()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xác thực OTP qua email thất bại')
    } finally {
      setIsLoading(false)
    }
  }

  // Resend OTP in Step 2
  const handleResendRegisterOtp = async () => {
    setError(null)
    setIsLoading(true)
    try {
      if (regMethod === 'phone') {
        const cleaned = phone.replace(/\D/g, '')
        await sendOtp(cleaned, 'register')
        setPhoneOtp('')
        setSuccessMsg(`Mã OTP mới đã được gửi qua SMS tới ${cleaned}!`)
        setPhoneOtpCountdown(60)
      } else {
        await sendEmailOtp(email.trim(), 'register')
        setEmailOtp('')
        setSuccessMsg(`Mã OTP mới đã được gửi tới hòm thư ${email.trim()}!`)
        setEmailOtpCountdown(60)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể gửi lại mã OTP')
    } finally {
      setIsLoading(false)
    }
  }

  // --- FORGOT PIN HANDLERS ---
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
      setForgotOtp('')
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
        setLoginIdentifier(forgotTarget.trim())
        setLoginPassword(forgotNewPin.trim())
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đặt lại mã PIN không thành công')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="mb-4">
            {isForgotPinMode ? (
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPinMode(false)
                    setError(null)
                    setSuccessMsg(null)
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white mb-2 transition cursor-pointer"
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
                  Nhận mã OTP qua Email hoặc Số điện thoại để đặt lại mã PIN 6 số.
                </p>
              </div>
            ) : !isLogin && regStep === 2 ? (
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setRegStep(1)
                    setError(null)
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white mb-2 transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại chỉnh sửa</span>
                </button>
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-5 h-5 text-teal-600" />
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    Xác Nhận Mã OTP Đăng Ký
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Mã OTP 6 số đã được gửi tới: <b>{regMethod === 'phone' ? phone : email}</b>
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
                    ? 'Nhập email hoặc số điện thoại của bạn để đăng nhập.'
                    : 'Điền thông tin và tạo mã PIN 6 số để đăng ký tài khoản.'}
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

          {/* ================= VIEW 1: FORGOT PIN MODE ================= */}
          {isForgotPinMode ? (
            <div>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setForgotMethod('email')
                    setError(null)
                  }}
                  className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
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
                  className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    forgotMethod === 'phone'
                      ? 'bg-white text-teal-800 shadow-xs dark:bg-slate-700 dark:text-teal-300'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Qua Số Điện Thoại</span>
                </button>
              </div>

              <form noValidate onSubmit={handleForgotPinResetSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {forgotMethod === 'email' ? 'Địa Chỉ Email Đăng Ký' : 'Số Điện Thoại Đăng Ký'}
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      {forgotMethod === 'email' ? (
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      ) : (
                        <Smartphone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      )}
                      <input
                        type="text"
                        placeholder={forgotMethod === 'email' ? 'VD: ban@gmail.com' : 'VD: 0965 985 468'}
                        value={forgotTarget}
                        onChange={(e) => setForgotTarget(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleForgotPinSendOtp}
                      disabled={isLoading || forgotOtpCountdown > 0}
                      className="rounded-xl bg-teal-600 px-3 py-2 text-xs font-bold text-white hover:bg-teal-700 disabled:opacity-50 transition shrink-0 cursor-pointer"
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
                    sublabel="Nhập 6 số OTP từ hòm thư / tin nhắn"
                  />
                )}

                <PinBoxInput
                  label="Mã PIN 6 Số Mới"
                  value={forgotNewPin}
                  onChange={setForgotNewPin}
                  idPrefix="modal-forgot-new-pin"
                  sublabel="Thiết lập 6 số PIN mới"
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
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-600 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-teal-700 transition disabled:opacity-50 mt-2 cursor-pointer"
                >
                  <span>Xác Nhận & Đổi Mã PIN</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : !isLogin && regStep === 2 ? (
            /* ================= VIEW 2: REGISTRATION STEP 2 (VERIFY OTP) ================= */
            <form
              noValidate
              onSubmit={regMethod === 'phone' ? handlePhoneRegisterStep2 : handleEmailRegisterStep2}
              className="space-y-5"
            >
              <PinBoxInput
                label="Nhập 6 Số Mã OTP"
                value={regMethod === 'phone' ? phoneOtp : emailOtp}
                onChange={regMethod === 'phone' ? setPhoneOtp : setEmailOtp}
                isOtp={true}
                autoFocus={true}
                idPrefix="modal-reg-step2-otp"
                sublabel="Kiểm tra tin nhắn SMS hoặc hộp thư đến/spam"
              />

              <div className="text-center text-xs text-slate-500 dark:text-slate-400">
                {(regMethod === 'phone' ? phoneOtpCountdown : emailOtpCountdown) > 0 ? (
                  <p>
                    Gửi lại mã OTP sau{' '}
                    <span className="font-bold text-teal-600 dark:text-teal-400">
                      {regMethod === 'phone' ? phoneOtpCountdown : emailOtpCountdown}s
                    </span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendRegisterOtp}
                    disabled={isLoading}
                    className="font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400 hover:underline transition cursor-pointer"
                  >
                    Gửi lại mã OTP ngay
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-600 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-teal-700 transition disabled:opacity-50 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Xác Nhận & Hoàn Tất Đăng Ký</span>
              </button>
            </form>
          ) : (
            /* ================= VIEW 3: LOGIN OR REGISTRATION STEP 1 ================= */
            <div>
              {/* Primary Switcher: [Đăng Nhập] vs [Đăng Ký Mới] */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-4">
                <button
                  type="button"
                  onClick={() => handleTabSwitch('login')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                    isLogin
                      ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  Đăng Nhập
                </button>
                <button
                  type="button"
                  onClick={() => handleTabSwitch('register')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                    !isLogin
                      ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  Đăng Ký Mới
                </button>
              </div>

              {/* Google 1-Tap Login */}
              <GoogleLoginButton
                text={isLogin ? 'continue_with' : 'signup_with'}
                onSuccess={closeAuthModal}
                onError={(err) => setError(err.message)}
                className="mb-4"
              />

              <div className="relative flex items-center justify-center py-1 mb-3">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                <span className="absolute bg-white dark:bg-slate-900 px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Hoặc
                </span>
              </div>

              {/* 3A. UNIFIED FOOLPROOF LOGIN FORM (NO confusing sub-tabs) */}
              {isLogin ? (
                <form noValidate onSubmit={handleUnifiedLoginSubmit} className="space-y-4 pt-1">
                  {/* Field 1: Identifier (admin, email, or phone) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Tài Khoản / Email / Số Điện Thoại
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Nhập email hoặc số điện thoại của bạn..."
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono"
                        autoComplete="username"
                      />
                    </div>
                  </div>

                  {/* Field 2: Password or PIN */}
                  {!useSmsOtpLogin ? (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Mật Khẩu hoặc Mã PIN 6 Số
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setIsForgotPinMode(true)
                            setError(null)
                            setSuccessMsg(null)
                            setForgotTarget(loginIdentifier)
                          }}
                          className="text-[11px] font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400 cursor-pointer"
                        >
                          Quên mật khẩu / PIN?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type={showLoginPassword ? 'text' : 'password'}
                          placeholder="Nhập mã PIN 6 số hoặc mật khẩu..."
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-10 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono"
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                        >
                          {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Optional SMS OTP Login */
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Mã OTP SMS Đăng Nhập
                        </label>
                        <button
                          type="button"
                          onClick={handleSendLoginOtp}
                          disabled={isLoading || loginOtpCountdown > 0}
                          className="text-[11px] font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400 cursor-pointer disabled:opacity-50"
                        >
                          {loginOtpCountdown > 0 ? `Gửi lại sau ${loginOtpCountdown}s` : loginOtpSent ? 'Gửi lại OTP' : 'Gửi mã OTP qua SMS'}
                        </button>
                      </div>
                      <PinBoxInput
                        label=""
                        value={loginOtp}
                        onChange={setLoginOtp}
                        isOtp={true}
                        idPrefix="modal-login-sms-otp"
                        sublabel="Nhập 6 số từ tin nhắn SMS"
                      />
                    </div>
                  )}

                  {/* Mode Toggle: Password/PIN vs SMS OTP */}
                  <div className="flex items-center justify-between text-[11px] pt-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setUseSmsOtpLogin(!useSmsOtpLogin)
                        setError(null)
                      }}
                      className="text-teal-600 hover:text-teal-700 dark:text-teal-400 font-semibold cursor-pointer"
                    >
                      {useSmsOtpLogin ? '🔑 Đăng nhập bằng Mật khẩu / Mã PIN' : '⚡ Hoặc đăng nhập nhanh bằng SMS OTP'}
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    formNoValidate
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md active:scale-95 transition cursor-pointer disabled:opacity-50"
                  >
                    <span>ĐĂNG NHẬP</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                /* 3B. REGISTRATION STEP 1 (Phone or Email) */
                <div>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-3.5">
                    <button
                      type="button"
                      onClick={() => {
                        setRegMethod('phone')
                        setError(null)
                      }}
                      className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        regMethod === 'phone'
                          ? 'bg-white text-teal-800 shadow-xs dark:bg-slate-700 dark:text-teal-300'
                          : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Qua Số Điện Thoại</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRegMethod('email')
                        setError(null)
                      }}
                      className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        regMethod === 'email'
                          ? 'bg-white text-teal-800 shadow-xs dark:bg-slate-700 dark:text-teal-300'
                          : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Qua Hòm Thư Email</span>
                    </button>
                  </div>

                  {regMethod === 'phone' ? (
                    /* PHONE REGISTRATION FORM */
                    <form noValidate onSubmit={handlePhoneRegisterStep1} className="space-y-3.5 pt-0.5">
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
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Số Điện Thoại (+84)
                        </label>
                        <div className="relative">
                          <Smartphone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder="VD: 0965 985 468"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono"
                          />
                        </div>
                      </div>

                      <PinBoxInput
                        label="Tạo Mã PIN Bảo Mật (6 Số)"
                        value={phonePin}
                        onChange={setPhonePin}
                        idPrefix="modal-phone-reg-pin"
                        sublabel="Thiết lập 6 số PIN để đăng nhập"
                      />

                      <PinBoxInput
                        label="Nhập Lại Mã PIN (6 Số)"
                        value={phoneConfirmPin}
                        onChange={setPhoneConfirmPin}
                        idPrefix="modal-phone-reg-confirm-pin"
                        sublabel="Xác nhận đúng 6 số PIN ở trên"
                      />

                      <button
                        type="submit"
                        formNoValidate
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md active:scale-95 transition disabled:opacity-50 mt-2 cursor-pointer"
                      >
                        <span>Tạo Tài Khoản & Gửi OTP</span>
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  ) : (
                    /* EMAIL REGISTRATION FORM */
                    <form noValidate onSubmit={handleEmailRegisterStep1} className="space-y-3.5 pt-0.5">
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
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Địa Chỉ Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder="VD: ban@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono"
                          />
                        </div>
                      </div>

                      <PinBoxInput
                        label="Tạo Mã PIN Bảo Mật (6 Số)"
                        value={emailPin}
                        onChange={setEmailPin}
                        idPrefix="modal-email-reg-pin"
                        sublabel="Thiết lập 6 số PIN để đăng nhập"
                      />

                      <PinBoxInput
                        label="Nhập Lại Mã PIN (6 Số)"
                        value={emailConfirmPin}
                        onChange={setEmailConfirmPin}
                        idPrefix="modal-email-reg-confirm-pin"
                        sublabel="Xác nhận đúng 6 số PIN ở trên"
                      />

                      <button
                        type="submit"
                        formNoValidate
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md active:scale-95 transition disabled:opacity-50 mt-2 cursor-pointer"
                      >
                        <span>Tạo Tài Khoản & Gửi OTP</span>
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Terms & Privacy */}
              <p className="text-[10px] text-center text-slate-400 leading-relaxed pt-3">
                Bằng việc tiếp tục, bạn đồng ý với <b>Quy chế hoạt động sàn</b> và <b>Chính sách bảo mật</b> của NHAXUONG.VN.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
