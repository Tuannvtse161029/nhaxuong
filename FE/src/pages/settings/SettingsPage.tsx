import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { useTheme } from '@/hooks/useTheme'
import { Sun, Moon, Globe, Bell, ShieldCheck } from 'lucide-react'

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Cài Đặt Hệ Thống
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Cấu hình tham số giao diện và tham số vận hành.
        </p>
      </div>

      <div className="space-y-4">
        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              {theme === 'dark' ? <Moon className="w-5 h-5 text-blue-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
              Chế độ hiển thị
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">Giao diện màu nền</p>
              <p className="text-xs text-slate-500">Chuyển đổi linh hoạt giữa giao diện Sáng và Tối (Dark mode)</p>
            </div>
            <Button variant="outline" size="sm" onClick={toggleTheme}>
              {theme === 'dark' ? 'Đang bật Tối' : 'Đang bật Sáng'}
            </Button>
          </CardContent>
        </Card>

        {/* Language & Localization */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-500" />
              Ngôn ngữ & Vùng
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">Ngôn ngữ mặc định</p>
              <p className="text-xs text-slate-500">Tiếng Việt (Việt Nam) - Mặc định theo chuẩn ISO-vi</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800">
              Tiếng Việt
            </span>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="w-5 h-5 text-purple-500" />
              Thông báo & Cảnh báo thiết bị
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Thông báo khi thiết bị gặp sự cố</p>
                <p className="text-xs text-slate-500">Gửi âm thanh cảnh báo và popup tức thì trên màn hình</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500" />
            </div>
            <div className="flex items-center justify-between py-1 border-t border-slate-100 dark:border-slate-800">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Nhắc lịch bảo trì định kỳ</p>
                <p className="text-xs text-slate-500">Thông báo trước 24 giờ cho kỹ thuật viên</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500" />
            </div>
          </CardContent>
        </Card>

        {/* Security Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-500" />
              Bảo mật phiên làm việc
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">Tự động hết hạn phiên (Token Expire)</p>
              <p className="text-xs text-slate-500">Phiên làm việc tự động khóa sau 8 giờ không hoạt động</p>
            </div>
            <span className="text-xs text-slate-400">8 giờ</span>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
