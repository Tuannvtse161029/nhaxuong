import { useState, type FormEvent } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import {
  Mail,
  Smartphone,
  User as UserIcon,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Sparkles,
  KeyRound,
  ArrowLeft,
  ShieldCheck,
  Send,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton'
import { PinBoxInput } from '@/components/auth/PinBoxInput'

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
  const [regStep, setRegStep] = useState<1 | 2>(1)
  const [isForgotPinMode, setIsForgotPinMode] = useState(false)
  const [method, setMethod] = useState<'phone' | 'email'>('phone')

  // Phone states
  const [phone, setPhone] = useState('')
  const [phoneName, setPhoneName] = useState('')
  const [phonePin, setPhonePin] = useState('')
  const [phoneConfirmPin, setPhoneConfirmPin] = useState('')
  const [phoneUseOtpLogin, setPhoneUseOtpLogin] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpCountdown, setOtpCountdown] = useState(0)

  // Email / PIN states
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

  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'

  // Reset step when switching mode or method
  const handleSwitchToLogin = () => {
    setIsRegisterMode(false)
    setRegStep(1)
    setError(null)
    setSuccessMsg(null)
  }

  const handleSwitchToRegister = () => {
    setIsRegisterMode(true)
    setRegStep(1)
    setError(null)
    setSuccessMsg(null)
  }

  const handleSwitchMethod = (newMethod: 'phone' | 'email') => {
    setMethod(newMethod)
    setRegStep(1)
    setError(null)
    setSuccessMsg(null)
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

  // --- PHONE REGISTRATION & LOGIN HANDLERS ---
  const handlePhoneLoginSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const cleaned = phone.replace(/\D/g, '')
    if (!cleaned || (cleaned.length !== 10 && cleaned.length !== 11)) {
      setError('Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 hoặc 11 chữ số.')
      return
    }

    if (phoneUseOtpLogin) {
      if (!otpSent) {
        setError('Vui lòng bấm nút "Gửi Mã OTP" để nhận mã đăng nhập qua tin nhắn SMS.')
        return
      }
      if (otp.length !== 6) {
        setError('Vui lòng nhập đầy đủ mã OTP 6 số từ tin nhắn SMS.')
        return
      }
    } else {
      if (phonePin.length !== 6) {
        setError('Vui lòng nhập đúng mã PIN bảo mật 6 số của bạn.')
        return
      }
    }

    setError(null)
    setIsSubmitting(true)
    try {
      if (phoneUseOtpLogin) {
        await loginWithPhone(phone.trim(), otp.trim())
      } else {
        await loginWithPhone(phone.trim(), undefined, undefined, phonePin.trim())
      }
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập số điện thoại thất bại')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSendPhoneLoginOtp = async () => {
    const cleaned = phone.replace(/\D/g, '')
    if (!cleaned || (cleaned.length !== 10 && cleaned.length !== 11)) {
      setError('Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 hoặc 11 chữ số.')
      return
    }
    setError(null)
    setIsSubmitting(true)
    try {
      const generatedOtp = await sendOtp(phone.trim(), 'login')
      setOtpSent(true)
      if (generatedOtp) {
        setOtp(generatedOtp)
        setSuccessMsg(`Mã OTP đã được gửi qua tin nhắn SMS tới số ${phone.trim()} (Mã của bạn: ${generatedOtp}). Vui lòng kiểm tra điện thoại!`)
      } else {
        setOtp('')
        setSuccessMsg(`Mã OTP đã được gửi qua tin nhắn SMS tới số ${phone.trim()}. Vui lòng kiểm tra điện thoại!`)
      }
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

  // PHONE REGISTER STEP 1: Validate info + PIN, then send OTP and go to Step 2
  const handlePhoneRegisterStep1 = async (e: FormEvent) => {
    e.preventDefault()
    const cleaned = phone.replace(/\D/g, '')
    if (!cleaned || (cleaned.length !== 10 && cleaned.length !== 11)) {
      setError('Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 hoặc 11 chữ số.')
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
    setIsSubmitting(true)
    try {
      const generatedOtp = await sendOtp(phone.trim(), 'register')
      setOtpSent(true)
      if (generatedOtp) {
        setOtp(generatedOtp)
        setSuccessMsg(`Mã OTP 6 số đã được gửi qua tin nhắn SMS tới ${phone.trim()} (Mã của bạn: ${generatedOtp}). Vui lòng nhập mã để hoàn tất tạo tài khoản!`)
      } else {
        setOtp('')
        setSuccessMsg(`Mã OTP 6 số đã được gửi qua tin nhắn SMS tới ${phone.trim()}. Vui lòng nhập mã để hoàn tất tạo tài khoản!`)
      }
      setOtpCountdown(60)
      setRegStep(2)
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
      setError(err instanceof Error ? err.message : 'Không thể gửi mã OTP xác thực')
    } finally {
      setIsSubmitting(false)
    }
  }

  // PHONE REGISTER STEP 2: Verify OTP and finish account creation
  const handlePhoneRegisterStep2 = async (e: FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) {
      setError('Vui lòng nhập đầy đủ mã xác thực OTP 6 số từ tin nhắn SMS.')
      return
    }

    setError(null)
    setIsSubmitting(true)
    try {
      await registerWithPhone(
        phone.trim(),
        phoneName.trim() || `Khách Hàng (${phone.slice(-4)})`,
        otp.trim(),
        phonePin.trim()
      )
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xác thực OTP thất bại')
    } finally {
      setIsSubmitting(false)
    }
  }

  // --- EMAIL REGISTRATION & LOGIN HANDLERS ---
  const handleEmailLoginSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !email.includes('@')) {
      setError('Vui lòng nhập địa chỉ email hợp lệ')
      return
    }
    if (pin.length !== 6) {
      setError('Vui lòng nhập đúng mã PIN bảo mật 6 số')
      return
    }

    setError(null)
    setIsSubmitting(true)
    try {
      await login({
        email: email.trim(),
        password: pin.trim(),
        pin: pin.trim(),
        otp: emailOtp.trim(),
      })
      navigate(from, { replace: true })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Đăng nhập không thành công')
    } finally {
      setIsSubmitting(false)
    }
  }

  // EMAIL REGISTER STEP 1: Validate info + PIN, then send OTP and go to Step 2
  const handleEmailRegisterStep1 = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Vui lòng nhập Họ và Tên của bạn.')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Vui lòng nhập địa chỉ email hợp lệ.')
      return
    }
    if (pin.length !== 6) {
      setError('Mã PIN bảo mật bắt buộc phải có đúng 6 chữ số.')
      return
    }
    if (pin !== confirmPin) {
      setError('Mã PIN xác nhận không trùng khớp!')
      return
    }

    setError(null)
    setIsSubmitting(true)
    try {
      const generatedOtp = await sendEmailOtp(email.trim(), 'register')
      setEmailOtpSent(true)
      if (generatedOtp) {
        setEmailOtp(generatedOtp)
        setSuccessMsg(`Mã xác thực OTP đã gửi về hòm thư ${email.trim()} (Mã của bạn: ${generatedOtp}).`)
      } else {
        setEmailOtp('')
        setSuccessMsg(`Mã xác thực OTP đã được gửi về hòm thư ${email.trim()}. Vui lòng kiểm tra hộp thư đến (hoặc spam)!`)
      }
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
      setError(err instanceof Error ? err.message : 'Không thể gửi mã OTP qua email')
    } finally {
      setIsSubmitting(false)
    }
  }

  // EMAIL REGISTER STEP 2: Verify OTP and finish account creation
  const handleEmailRegisterStep2 = async (e: FormEvent) => {
    e.preventDefault()
    if (emailOtp.length !== 6) {
      setError('Vui lòng nhập đầy đủ mã xác thực OTP 6 số từ email của bạn.')
      return
    }

    setError(null)
    setIsSubmitting(true)
    try {
      await register({
        email: email.trim(),
        password: pin.trim(),
        pin: pin.trim(),
        name: name.trim() || email.split('@')[0],
        otp: emailOtp.trim(),
      })
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xác thực OTP thất bại')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Resend OTP in Step 2
  const handleResendRegisterOtp = async () => {
    setError(null)
    setIsSubmitting(true)
    try {
      if (method === 'phone') {
        const generatedOtp = await sendOtp(phone.trim(), 'register')
        if (generatedOtp) {
          setOtp(generatedOtp)
          setSuccessMsg(`Mã OTP mới đã được gửi qua SMS tới ${phone.trim()} (Mã của bạn: ${generatedOtp})!`)
        } else {
          setSuccessMsg(`Mã OTP mới đã được gửi qua SMS tới ${phone.trim()}!`)
        }
        setOtpCountdown(60)
      } else {
        const generatedOtp = await sendEmailOtp(email.trim(), 'register')
        if (generatedOtp) setEmailOtp(generatedOtp)
        setSuccessMsg(`Mã OTP mới đã được gửi về hòm thư ${email.trim()}!`)
        setEmailOtpCountdown(60)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể gửi lại mã OTP')
    } finally {
      setIsSubmitting(false)
    }
  }

  // FORGOT PIN HANDLERS
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

  const handleForgotPinResetSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!forgotTarget.trim()) {
      setError('Vui lòng nhập thông tin tài khoản')
      return
    }
    if (forgotOtp.length !== 6) {
      setError('Vui lòng nhập đủ mã xác thực OTP 6 số')
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
      setIsSubmitting(false)
    }
  }

  // --- VIEW: FORGOT PIN FLOW ---
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
            <PinBoxInput
              label="Mã Xác Thực OTP"
              value={forgotOtp}
              onChange={setForgotOtp}
              isOtp={true}
              idPrefix="forgot-otp"
              sublabel="Nhập 6 số OTP đã gửi tới hòm thư / điện thoại"
            />
          )}

          <PinBoxInput
            label="Mã PIN 6 Số Mới"
            value={forgotNewPin}
            onChange={setForgotNewPin}
            idPrefix="forgot-new-pin"
            sublabel="Nhập 6 số PIN mới bạn muốn đặt"
          />

          <PinBoxInput
            label="Xác Nhận Mã PIN 6 Số Mới"
            value={forgotConfirmPin}
            onChange={setForgotConfirmPin}
            idPrefix="forgot-confirm-pin"
            sublabel="Nhập lại đúng 6 số PIN ở trên"
          />

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

  // --- VIEW: REGISTRATION STEP 2 (XÁC NHẬN MÃ OTP) ---
  if (isRegisterMode && regStep === 2) {
    const targetDisplay = method === 'phone' ? phone : email
    const countdown = method === 'phone' ? otpCountdown : emailOtpCountdown

    return (
      <div>
        <button
          type="button"
          onClick={() => {
            setRegStep(1)
            setError(null)
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white mb-4 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại chỉnh sửa thông tin</span>
        </button>

        <div className="w-12 h-12 bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
          {method === 'phone' ? <Smartphone className="w-6 h-6" /> : <Mail className="w-6 h-6" />}
        </div>

        <h3 className="text-xl font-black text-center text-slate-900 dark:text-white mb-1">
          Xác Nhận Mã OTP Đăng Ký
        </h3>
        <p className="text-xs text-center text-slate-500 dark:text-slate-400 mb-5">
          Mã xác thực 6 số đã được gửi tới <br />
          <span className="font-bold text-slate-800 dark:text-slate-200">{targetDisplay}</span>
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

        <form onSubmit={method === 'phone' ? handlePhoneRegisterStep2 : handleEmailRegisterStep2} className="space-y-5">
          <PinBoxInput
            label="Nhập 6 Số Mã OTP"
            value={method === 'phone' ? otp : emailOtp}
            onChange={method === 'phone' ? setOtp : setEmailOtp}
            isOtp={true}
            autoFocus={true}
            idPrefix="reg-step2-otp"
            sublabel="Vui lòng kiểm tra hộp thư đến hoặc tin nhắn SMS"
          />

          {/* Resend Countdown */}
          <div className="text-center text-xs text-slate-500 dark:text-slate-400">
            {countdown > 0 ? (
              <p>
                Gửi lại mã OTP sau <span className="font-bold text-teal-600 dark:text-teal-400">{countdown}s</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendRegisterOtp}
                disabled={isSubmitting}
                className="font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400 hover:underline transition"
              >
                Gửi lại mã OTP ngay
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-600 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-teal-700 transition disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Xác Nhận & Hoàn Tất Đăng Ký</span>
          </button>
        </form>
      </div>
    )
  }

  // --- VIEW: NORMAL LOGIN & REGISTER (STEP 1) ---
  return (
    <div>
      {/* Tab Switcher: Đăng Nhập vs Đăng Ký */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-5">
        <button
          type="button"
          onClick={handleSwitchToLogin}
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
          onClick={handleSwitchToRegister}
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
          ? 'Điền thông tin và tạo Mã PIN 6 số bảo mật để nhận báo giá kho xưởng.'
          : 'Đăng nhập nhanh bằng Mã PIN 6 số bảo mật chuẩn ngân hàng.'}
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
          onClick={() => handleSwitchMethod('phone')}
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
          onClick={() => handleSwitchMethod('email')}
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
        <>
          {isRegisterMode ? (
            /* PHONE REGISTER STEP 1 */
            <form onSubmit={handlePhoneRegisterStep1} className="space-y-4">
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

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Số Điện Thoại (+84)
                </label>
                <div className="relative">
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
              </div>

              <PinBoxInput
                label="Tạo Mã PIN Bảo Mật (6 Số)"
                value={phonePin}
                onChange={setPhonePin}
                idPrefix="phone-reg-pin"
                sublabel="Thiết lập 6 số PIN để đăng nhập"
              />

              <PinBoxInput
                label="Nhập Lại Mã PIN (6 Số)"
                value={phoneConfirmPin}
                onChange={setPhoneConfirmPin}
                idPrefix="phone-reg-confirm-pin"
                sublabel="Xác nhận đúng 6 số PIN ở trên"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-600 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-teal-700 transition disabled:opacity-50 mt-2"
              >
                <span>Tạo Tài Khoản & Gửi OTP</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* PHONE LOGIN FORM */
            <form onSubmit={handlePhoneLoginSubmit} className="space-y-4">
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
                  {phoneUseOtpLogin && (
                    <button
                      type="button"
                      onClick={handleSendPhoneLoginOtp}
                      disabled={isSubmitting || otpCountdown > 0}
                      className="rounded-xl bg-teal-600 px-3 py-2 text-xs font-bold text-white hover:bg-teal-700 disabled:opacity-50 transition shrink-0"
                    >
                      {otpCountdown > 0 ? `${otpCountdown}s` : otpSent ? 'Gửi Lại OTP' : 'Gửi Mã OTP'}
                    </button>
                  )}
                </div>
              </div>

              {!phoneUseOtpLogin ? (
                <>
                  <PinBoxInput
                    label="Mã PIN Bảo Mật (6 Số)"
                    value={phonePin}
                    onChange={setPhonePin}
                    idPrefix="phone-login-pin"
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
                      idPrefix="phone-login-otp"
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-700 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-teal-800 transition disabled:opacity-50 mt-2"
              >
                <span>Đăng Nhập Số Điện Thoại</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </>
      )}

      {/* 3. EMAIL FORM */}
      {method === 'email' && (
        <>
          {isRegisterMode ? (
            /* EMAIL REGISTER STEP 1 */
            <form onSubmit={handleEmailRegisterStep1} className="space-y-4">
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

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Địa Chỉ Email
                </label>
                <div className="relative">
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
              </div>

              <PinBoxInput
                label="Tạo Mã PIN Bảo Mật (6 Số)"
                value={pin}
                onChange={setPin}
                idPrefix="email-reg-pin"
                sublabel="Thiết lập 6 số PIN để đăng nhập"
              />

              <PinBoxInput
                label="Nhập Lại Mã PIN (6 Số)"
                value={confirmPin}
                onChange={setConfirmPin}
                idPrefix="email-reg-confirm-pin"
                sublabel="Xác nhận đúng 6 số PIN ở trên"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-600 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-teal-700 transition disabled:opacity-50 mt-2"
              >
                <span>Tạo Tài Khoản & Gửi OTP</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* EMAIL LOGIN FORM */
            <form onSubmit={handleEmailLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Địa Chỉ Email
                </label>
                <div className="relative">
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
              </div>

              <PinBoxInput
                label="Mã PIN Bảo Mật (6 Số)"
                value={pin}
                onChange={setPin}
                idPrefix="email-login-pin"
                onForgotPin={() => {
                  setIsForgotPinMode(true)
                  setError(null)
                  setSuccessMsg(null)
                  setForgotTarget(email)
                  setForgotMethod('email')
                }}
                sublabel="Nhập 6 số PIN để đăng nhập"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-slate-800 dark:bg-teal-700 dark:hover:bg-teal-600 transition disabled:opacity-50 mt-2"
              >
                <span>Đăng Nhập Với Mã PIN</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 p-2.5 text-[11px] text-amber-900 dark:text-amber-300">
                <span className="font-bold">Tài khoản Admin mẫu:</span> admin@nhaxuong.vn | Mã PIN: 123456
              </div>
            </form>
          )}
        </>
      )}

      <div className="mt-5 text-center">
        <Link to="/" className="text-xs text-slate-500 hover:text-teal-600 dark:hover:text-teal-400">
          ← Quay về trang chủ Nhà Xưởng
        </Link>
      </div>
    </div>
  )
}
