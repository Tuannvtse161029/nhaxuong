import { Activity, Cpu, AlertTriangle, Users, ArrowUpRight, TrendingUp, CheckCircle2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { useAuth } from '@/hooks/useAuth'

export function DashboardPage() {
  const { user } = useAuth()

  const stats = [
    {
      title: 'Thiết bị đang hoạt động',
      value: '48 / 52',
      change: '+4%',
      status: 'success',
      icon: Cpu,
      color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40',
    },
    {
      title: 'Hiệu suất vận hành',
      value: '94.2%',
      change: '+1.8%',
      status: 'success',
      icon: Activity,
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40',
    },
    {
      title: 'Nhân sự ca trực',
      value: '36 kỹ sư',
      change: '100% ca',
      status: 'info',
      icon: Users,
      color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40',
    },
    {
      title: 'Cảnh báo kỹ thuật',
      value: '2 lưu ý',
      change: '-3 so với hôm qua',
      status: 'warning',
      icon: AlertTriangle,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40',
    },
  ]

  const recentEvents = [
    { id: 1, time: '15:42', machine: 'Dây chuyền cắt Laser CNC #02', status: 'normal', message: 'Hoàn thành mẻ cắt phôi thép 15mm' },
    { id: 2, time: '14:20', machine: 'Máy tiện CNC 5 trục Haas', status: 'warning', message: 'Nhiệt độ dầu làm mát chạm ngưỡng 78°C' },
    { id: 3, time: '12:05', machine: 'Robot xếp dỡ KUKA A4', status: 'normal', message: 'Bảo trì định kỳ chu kỳ 500 giờ hoàn tất' },
    { id: 4, time: '09:30', machine: 'Lò nhiệt luyện cao tần L01', status: 'resolved', message: 'Đã hiệu chuẩn cảm biến nhiệt độ buồng' },
  ]

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 text-white shadow-lg shadow-blue-500/20">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Xin chào, {user?.name || 'Kỹ sư'}! 👋</h1>
          <p className="mt-1 text-sm text-blue-100 max-w-xl">
            Sườn dự án React chuẩn hóa sẵn sàng tiếp nhận thông tin dự án. Bạn có thể mở rộng các trang, kết nối API backend một cách dễ dàng.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/20 backdrop-blur-md px-3 py-1.5 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            Hệ thống sẵn sàng
          </span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card key={i} className="hover:border-blue-300 dark:hover:border-slate-700 transition-colors">
              <CardContent className="p-5 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{stat.title}</p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Grid: Activity & System Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Nhật ký vận hành thời gian thực</CardTitle>
              <p className="text-xs text-slate-500 mt-1">Dữ liệu mẫu phản ánh trạng thái nhà xưởng</p>
            </div>
            <button className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
              Xem tất cả <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentEvents.map((evt) => (
              <div
                key={evt.id}
                className="flex items-start gap-4 rounded-xl border border-slate-100 p-3.5 hover:bg-slate-50/80 transition-colors dark:border-slate-800 dark:hover:bg-slate-800/40"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300">
                  {evt.time}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {evt.machine}
                    </h4>
                    {evt.status === 'normal' && <Badge variant="success">Bình thường</Badge>}
                    {evt.status === 'warning' && <Badge variant="warning">Lưu ý</Badge>}
                    {evt.status === 'resolved' && <Badge variant="info">Đã xử lý</Badge>}
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{evt.message}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Project Architecture Info */}
        <Card>
          <CardHeader>
            <CardTitle>Cấu trúc Frontend</CardTitle>
            <p className="text-xs text-slate-500 mt-1">Được tổ chức chuẩn Module Scalable</p>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
              <p className="font-semibold text-slate-900 dark:text-white">🚀 React 19 + Vite 6</p>
              <p className="mt-0.5 text-slate-500 dark:text-slate-400">Khởi động siêu tốc, HMR tức thì</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
              <p className="font-semibold text-slate-900 dark:text-white">🎨 Tailwind CSS v4</p>
              <p className="mt-0.5 text-slate-500 dark:text-slate-400">Giao diện hiện đại, chế độ Tối/Sáng</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
              <p className="font-semibold text-slate-900 dark:text-white">🛡️ Routing & Auth Guard</p>
              <p className="mt-0.5 text-slate-500 dark:text-slate-400">Phân quyền Protected / Public Route</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
              <p className="font-semibold text-slate-900 dark:text-white">📡 Axios Client + Mock Mode</p>
              <p className="mt-0.5 text-slate-500 dark:text-slate-400">Tự động gắn Bearer Token & Interceptor</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
