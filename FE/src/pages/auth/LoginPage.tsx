import { useState, type FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, AlertCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [email, setEmail] = useState('admin@nhaxuong.vn')
  const [password, setPassword] = useState('123456')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await login({ email, password })
      navigate(from, { replace: true })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Đăng nhập không thành công')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Đăng Nhập</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
        Sử dụng tài khoản mẫu hoặc tài khoản nội bộ để truy cập hệ thống.
      </p>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-600 dark:bg-red-950/40 dark:text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Địa chỉ Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@nhaxuong.vn"
          leftIcon={<Mail className="w-4 h-4" />}
        />

        <Input
          label="Mật khẩu"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          leftIcon={<Lock className="w-4 h-4" />}
        />

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
            <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" defaultChecked />
            Ghi nhớ đăng nhập
          </label>
          <span className="text-blue-600 hover:underline dark:text-blue-400 cursor-pointer">
            Quên mật khẩu?
          </span>
        </div>

        <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
          Đăng nhập ngay
        </Button>
      </form>

      <div className="mt-6 rounded-lg bg-blue-50 p-3 text-xs text-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
        <p className="font-semibold mb-1">Tài khoản thử nghiệm sẵn có:</p>
        <p>Email: <code className="font-mono">admin@nhaxuong.vn</code></p>
        <p>Mật khẩu: <code className="font-mono">123456</code></p>
      </div>
    </div>
  )
}
