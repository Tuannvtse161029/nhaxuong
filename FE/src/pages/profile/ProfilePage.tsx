import { useState } from 'react'
import { User, Mail, Phone, Shield, Save, Check } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'

export function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    updateUser({ name, phone })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Thông Tin Tài Khoản
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Quản lý thông tin cá nhân và thông tin liên hệ của bạn.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Avatar & Summary Card */}
        <Card className="text-center p-6 flex flex-col items-center">
          <div className="relative mb-4">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-24 w-24 rounded-full object-cover ring-4 ring-blue-500/20"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-3xl">
                {user?.name.charAt(0) || 'U'}
              </div>
            )}
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-lg">{user?.name}</h3>
          <p className="text-xs text-slate-400 capitalize mt-0.5">{user?.role} - Quản lý kỹ thuật</p>
          <div className="mt-4 w-full border-t border-slate-100 dark:border-slate-800 pt-4 text-xs text-slate-500 space-y-2">
            <div className="flex justify-between">
              <span>Trạng thái:</span>
              <span className="font-semibold text-emerald-600">Đang hoạt động</span>
            </div>
            <div className="flex justify-between">
              <span>Mã ID:</span>
              <span className="font-mono">{user?.id || 'usr_01'}</span>
            </div>
          </div>
        </Card>

        {/* Edit Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Chi tiết liên hệ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Họ và tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
            />

            <Input
              label="Địa chỉ Email"
              value={user?.email || ''}
              disabled
              helperText="Email quản trị do hệ thống chỉ định"
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0901234567"
              leftIcon={<Phone className="w-4 h-4" />}
            />

            <div className="pt-2">
              <Button
                onClick={handleSave}
                leftIcon={saved ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
              >
                {saved ? 'Đã lưu thành công' : 'Lưu thay đổi'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
