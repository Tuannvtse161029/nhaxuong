import { useState, useEffect } from 'react'
import { X, Mail } from 'lucide-react'
import type { Property, PropertyType } from '@/types/property.types'
import { useProperties } from '@/context/PropertyContext'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { PROVINCES_LIST } from '@/data/mockData'
import { formatCurrency } from '@/utils/formatters'

interface AdminPropertyModalProps {
  isOpen: boolean
  onClose: () => void
  property: Property | null
}

export function AdminPropertyModal({ isOpen, onClose, property }: AdminPropertyModalProps) {
  const { addProperty, updateProperty, categories } = useProperties()

  const [title, setTitle] = useState('')
  const [type, setType] = useState<PropertyType>('SALE')
  const [province, setProvince] = useState('Bình Dương')
  const [kcn, setKcn] = useState('KCN VSIP 1')
  const [price, setPrice] = useState(48000000000)
  const [area, setArea] = useState('12.000 m2')
  const [power, setPower] = useState('1.500 kVA')
  const [pccc, setPccc] = useState('Tự Động (Sprinkler)')
  const [videoUrl, setVideoUrl] = useState(
    'https://assets.mixkit.co/videos/preview/mixkit-drone-view-of-a-large-factory-or-warehouse-42861-large.mp4'
  )
  const [audioUrl, setAudioUrl] = useState('https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3')
  const [image, setImage] = useState(
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80'
  )
  const [desc, setDesc] = useState('')
  const [triggerEmail, setTriggerEmail] = useState(true)

  useEffect(() => {
    if (property) {
      setTitle(property.title)
      setType(property.type)
      setProvince(property.province)
      setKcn(property.kcn)
      setPrice(property.price)
      setArea(property.area)
      setPower(property.power)
      setPccc(property.pccc)
      setVideoUrl(property.videoUrl || '')
      setAudioUrl(property.audioUrl || '')
      setImage(property.image)
      setDesc(property.desc)
    } else {
      setTitle('')
      setType('SALE')
      setProvince('Bình Dương')
      setKcn('KCN VSIP 1')
      setPrice(25000000000)
      setArea('8.000 m2')
      setPower('1.000 kVA')
      setPccc('Tự Động (Sprinkler)')
      setVideoUrl(
        'https://assets.mixkit.co/videos/preview/mixkit-drone-view-of-a-large-factory-or-warehouse-42861-large.mp4'
      )
      setAudioUrl('https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3')
      setImage('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80')
      setDesc('')
    }
  }, [property, isOpen])

  if (!isOpen) return null

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const catObj = categories.find((c) => c.code === type)
    const typeDisplay = catObj
      ? catObj.name
      : type === 'SALE'
      ? 'Bán Nhà Xưởng'
      : type === 'RENT'
      ? 'Cho Thuê Kho Bãi'
      : 'Dự Án Đất KCN'

    const priceDisplay = formatCurrency(price)

    if (property) {
      updateProperty(
        property.id,
        {
          title,
          type,
          typeDisplay,
          province,
          kcn,
          price,
          priceDisplay,
          area,
          power,
          pccc,
          videoUrl,
          audioUrl,
          image,
          desc,
        },
        triggerEmail
      )
    } else {
      addProperty(
        {
          title,
          type,
          typeDisplay,
          province,
          kcn,
          price,
          priceDisplay,
          area,
          power,
          pccc,
          videoUrl,
          audioUrl,
          image,
          desc,
        },
        triggerEmail
      )
    }

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-2xl max-h-[90vh] rounded-3xl bg-white shadow-2xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4 bg-slate-50/70 dark:bg-slate-950/50">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              {property ? 'Chỉnh Sửa Thông Tin Mặt Hàng' : 'Thêm Mới & Xuất Bản Nhà Xưởng'}
            </h3>
            <p className="text-[11px] text-slate-400">
              Điền thông tin bất động sản và liên kết video drone
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
          <Input
            label="Tiêu đề bài đăng"
            placeholder="VD: Bán 10.000m2 Nhà xưởng KCN VSIP 1..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Loại hình danh mục
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as PropertyType)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                {categories.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Tỉnh / Thành Phố
              </label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                {PROVINCES_LIST.filter((p) => p !== 'Toàn Quốc').map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Giá niêm yết (VNĐ)"
              type="number"
              step={10000000}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              helperText={`Định dạng: ${formatCurrency(price)}`}
              required
            />
            <Input
              label="Khuôn viên (m2)"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="VD: 10.000 m2"
            />
          </div>

          <Input
            label="URL Video Drone MP4 (Hover Autoplay)"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://.../drone-video.mp4"
          />

          <Input
            label="URL Hình Ảnh Thumbnail"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Mô tả chi tiết quy hoạch & hạ tầng
            </label>
            <textarea
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Nhập chi tiết về trần cao, sàn tải trọng, đường container..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          {/* Real-time Automation Triggers */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4 dark:border-blue-900/60 dark:bg-blue-950/40 space-y-2.5">
            <p className="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wide">
              ⚡ Tự động hóa Real-time khi Xuất bản:
            </p>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={triggerEmail}
                onChange={(e) => setTriggerEmail(e.target.checked)}
                className="h-4 w-4 rounded text-teal-600 focus:ring-teal-500"
              />
              <span className="flex items-center gap-1.5 font-medium">
                <Mail className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                Gửi Email Bản Tin Real-time kèm thông số nhà xưởng & báo giá
              </span>
            </label>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <Button variant="ghost" type="button" onClick={onClose}>
              Hủy bỏ
            </Button>
            <Button type="submit">
              {property ? 'Lưu thay đổi' : 'Xuất bản bài viết'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
