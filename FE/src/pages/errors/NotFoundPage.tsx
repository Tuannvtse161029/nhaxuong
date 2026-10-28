import { Link } from 'react-router-dom'
import { Home, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/common/Button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center dark:bg-slate-950">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 mb-6">
        <AlertTriangle className="h-10 w-10" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">404</h1>
      <h2 className="mt-2 text-xl font-semibold text-slate-700 dark:text-slate-200">
        Trang không tìm thấy
      </h2>
      <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
        Đường dẫn bạn yêu cầu không tồn tại hoặc đã được di chuyển sang địa chỉ khác.
      </p>
      <div className="mt-6">
        <Link to="/dashboard">
          <Button leftIcon={<Home className="w-4 h-4" />}>Quay lại Bảng điều khiển</Button>
        </Link>
      </div>
    </div>
  )
}
