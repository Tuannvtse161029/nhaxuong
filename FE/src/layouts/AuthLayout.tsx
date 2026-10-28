import { Outlet, Link } from 'react-router-dom'
import { Factory } from 'lucide-react'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full flex-col justify-center bg-slate-50 py-12 sm:px-6 lg:px-8 dark:bg-slate-950">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/25">
            <Factory className="h-7 w-7" />
          </div>
        </Link>
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Hệ Thống Nhà Xưởng
        </h2>
        <p className="mt-1 text-center text-sm text-slate-500 dark:text-slate-400">
          Cổng thông tin quản trị và vận hành
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-6 py-8 shadow-sm rounded-2xl sm:px-10 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
