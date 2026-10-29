import { useState } from 'react'
import { X, Mail, Phone, CheckCircle } from 'lucide-react'
import { useProperties } from '@/context/PropertyContext'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'

interface SubscribeNewsletterModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SubscribeNewsletterModal({ isOpen, onClose }: SubscribeNewsletterModalProps) {
  const { addSubscriber, subscribers } = useProperties()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [channel, setChannel] = useState<'email' | 'hotline'>('email')
  const [isDone, setIsDone] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    addSubscriber({
      name,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      channel,
      status: channel === 'hotline' ? 'Delivered (Hotline)' : 'Delivered (Inbox)',
    })

    setIsDone(true)
    setTimeout(() => {
      setIsDone(false)
      onClose()
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-md rounded-3xl bg-white shadow-2xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4 bg-slate-50/70 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Liên Hệ Tư Vấn Mua / Thuê Xưởng
              </h3>
              <p className="text-[11px] text-slate-400">
                Chuyên viên sẽ gửi báo giá & hồ sơ pháp lý chi tiết trong 15 phút
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        {isDone ? (
          <div className="py-12 px-6 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Đăng ký thành công!</h4>
            <p className="text-xs text-slate-500">
              Bạn sẽ nhận được thông báo ngay khi có nhà xưởng mới phù hợp với tiêu chí đầu tư.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Channel Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Kênh nhận thông báo ưu tiên:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setChannel('email')}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition ${
                    channel === 'email'
                      ? 'border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Mail className="w-4 h-4 text-teal-600" />
                  <span>Email (Hộp thư)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('hotline')}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition ${
                    channel === 'hotline'
                      ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span>Hotline / SMS</span>
                </button>
              </div>
            </div>

            <Input
              label="Tên doanh nghiệp / Nhà đầu tư"
              placeholder="VD: Nguyễn Minh Tuấn (Tập đoàn Nam Phát)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            {channel === 'hotline' ? (
              <Input
                label="Số điện thoại di động"
                placeholder="VD: 0901234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            ) : (
              <Input
                label="Địa chỉ Email nhận tin"
                type="email"
                placeholder="VD: investor@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            )}

            <Button type="submit" className="w-full mt-2" size="lg">
              Xác Nhận Gửi Yêu Cầu Tư Vấn Mua / Thuê
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
