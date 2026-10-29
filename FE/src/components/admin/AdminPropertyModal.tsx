import { useState, useEffect } from 'react'
import { X, Mail, Layers } from 'lucide-react'
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
  const [type, setType] = useState<PropertyType>('RECYCLED_STEEL')
  const [province, setProvince] = useState('Bình Dương')
  const [kcn, setKcn] = useState('Kho Bãi ICD Tân Cảng')
  const [price, setPrice] = useState(980000000)
  const [unitPrice, setUnitPrice] = useState('306.000 đ/m²')
  const [area, setArea] = useState('3.200 m2')
  const [power, setPower] = useState('Kết cấu thép Zamil SS400')
  const [pccc, setPccc] = useState('Sơn chống rỉ, chịu tải 95%')
  const [brokerName, setBrokerName] = useState('Đỗ Hoàng Nam (Chuyên Viên Sắt Thép)')
  const [brokerPhone, setBrokerPhone] = useState('0912 888 999')
  const [videoUrl, setVideoUrl] = useState(
    'https://assets.mixkit.co/videos/preview/mixkit-drone-view-of-a-large-factory-or-warehouse-42861-large.mp4'
  )
  const [audioUrl, setAudioUrl] = useState('https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3')
  const [image, setImage] = useState(
    'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&q=80'
  )
  const [desc, setDesc] = useState('')
  const [triggerEmail, setTriggerEmail] = useState(true)

  useEffect(() => {
    if (property) {
      setTitle(property.title)
      setType(property.type)
      setProvince(property.province)
      setKcn(property.kcn || '')
      setPrice(property.price)
      setUnitPrice(property.unitPrice || '')
      setArea(property.area)
      setPower(property.power || '')
      setPccc(property.pccc || '')
      setBrokerName(property.brokerName || 'Ban Quản Lý Kho Xưởng')
      setBrokerPhone(property.brokerPhone || '090 123 4567')
      setVideoUrl(property.videoUrl || '')
      setAudioUrl(property.audioUrl || '')
      setImage(property.image)
      setDesc(property.desc)
    } else {
      setTitle('')
      setType('RECYCLED_STEEL')
      setProvince('Bình Dương')
      setKcn('Kho Bãi ICD Tân Cảng')
      setPrice(980000000)
      setUnitPrice('306.000 đ/m²')
      setArea('3.200 m2')
      setPower('Kết cấu thép Zamil SS400')
      setPccc('Sơn chống rỉ, chịu tải 95%')
      setBrokerName('Đỗ Hoàng Nam (Chuyên Viên Sắt Thép)')
      setBrokerPhone('0912 888 999')
      setVideoUrl(
        'https://assets.mixkit.co/videos/preview/mixkit-drone-view-of-a-large-factory-or-warehouse-42861-large.mp4'
      )
      setAudioUrl('https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3')
      setImage('https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&q=80')
      setDesc('')
    }
  }, [property, isOpen])

  if (!isOpen) return null

  const isRecycledSteel = type === 'RECYCLED_STEEL'

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
      : type === 'RECYCLED_STEEL'
      ? 'Sắt Thép Tái Sử Dụng'
      : 'Khác'

    const priceDisplay = formatCurrency(price)

    const propertyPayload = {
      title,
      type,
      typeDisplay,
      province,
      kcn: kcn.trim() || (isRecycledSteel ? 'Kho Bãi Tập Kết Thép' : 'KCN Chuẩn'),
      price,
      priceDisplay,
      unitPrice: unitPrice.trim(),
      area,
      power,
      pccc,
      brokerName,
      brokerPhone,
      videoUrl,
      audioUrl,
      image,
      desc,
    }

    if (property) {
      updateProperty(property.id, propertyPayload, triggerEmail)
    } else {
      addProperty(propertyPayload, triggerEmail)
    }

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-2xl max-h-[90vh] rounded-3xl bg-white shadow-2xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4 bg-slate-50/70 dark:bg-slate-950/50">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              {isRecycledSteel && <Layers className="w-5 h-5 text-teal-600" />}
              {property
                ? 'Chỉnh Sửa Thông Tin Mặt Hàng'
                : isRecycledSteel
                ? 'Thêm Mới Sắt Thép Tái Sử Dụng & Xuất Bản'
                : 'Thêm Mới & Xuất Bản Nhà Xưởng'}
            </h3>
            <p className="text-[11px] text-slate-400">
              {isRecycledSteel
                ? 'Điền đầy đủ thông số khối lượng, mác thép, vị trí bãi kho và liên kết video'
                : 'Điền thông tin nhà xưởng, trạm điện, PCCC và liên kết video drone'}
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
            placeholder={
              isRecycledSteel
                ? 'VD: Thanh lý khung thép tiền chế Zamil 3.200m2, Lô dầm H300 tháo dỡ 85 Tấn...'
                : 'VD: Bán 10.000m2 Nhà xưởng KCN VSIP 1, Cho thuê kho CFS 5.000m2...'
            }
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
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 font-semibold"
              >
                {/* Fallback to ensure Sắt Thép Tái Sử Dụng is always selectable even on older caches */}
                {!categories.some((c) => c.code === 'RECYCLED_STEEL') && (
                  <option value="RECYCLED_STEEL">Sắt Thép Tái Sử Dụng</option>
                )}
                {categories.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Tỉnh / Thành Phố (Vị trí hàng)
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
              label={isRecycledSteel ? 'Vị trí Bãi Kho / Tập Kết' : 'Khu Công Nghiệp / Vị Trí'}
              value={kcn}
              onChange={(e) => setKcn(e.target.value)}
              placeholder={isRecycledSteel ? 'VD: Kho Bãi ICD Tân Cảng, KCN VSIP 1' : 'VD: KCN VSIP 1, KCN Amata'}
              required
            />
            <Input
              label={isRecycledSteel ? 'Diện tích / Khối lượng (m2 hoặc Tấn)' : 'Khuôn viên (m2)'}
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder={isRecycledSteel ? 'VD: 3.200 m2 hoặc 85 Tấn' : 'VD: 10.000 m2'}
              required
            />
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
              label={isRecycledSteel ? 'Đơn giá tham chiếu (m2 hoặc kg)' : 'Đơn giá tham chiếu (m2 / tháng)'}
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              placeholder={isRecycledSteel ? 'VD: 306.000 đ/m² hoặc 14.700 đ/kg' : 'VD: 4.5 Triệu/m2 hoặc 70.000 đ/m2'}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={isRecycledSteel ? 'Mác thép / Chủng loại kết cấu' : 'Công suất trạm điện (kVA)'}
              value={power}
              onChange={(e) => setPower(e.target.value)}
              placeholder={isRecycledSteel ? 'VD: Thép SS400, Khung Zamil, Dầm H350' : 'VD: 1.500 kVA, 2x1000 kVA'}
            />
            <Input
              label={isRecycledSteel ? 'Chất lượng kiểm định & Bề mặt' : 'Hệ thống PCCC'}
              value={pccc}
              onChange={(e) => setPccc(e.target.value)}
              placeholder={isRecycledSteel ? 'VD: Đạt 95%, Sơn chống rỉ, Đầy đủ bulong' : 'VD: Tự Động (Sprinkler), Thẩm duyệt'}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Người phụ trách / Liên hệ bãi"
              value={brokerName}
              onChange={(e) => setBrokerName(e.target.value)}
              placeholder="VD: Đỗ Hoàng Nam (Chuyên Viên Sắt Thép)"
            />
            <Input
              label="Hotline liên hệ"
              value={brokerPhone}
              onChange={(e) => setBrokerPhone(e.target.value)}
              placeholder="VD: 0912 888 999"
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
              {isRecycledSteel ? 'Mô tả chi tiết lô thép / tháo dỡ / vận chuyển' : 'Mô tả chi tiết quy hoạch & hạ tầng'}
            </label>
            <textarea
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder={
                isRecycledSteel
                  ? 'VD: Khung dầm H400, bản mã dày, giằng xà gồ C200 đầy đủ, có cẩu trục 25 tấn hỗ trợ bốc xếp...'
                  : 'Nhập chi tiết về trần cao, sàn tải trọng, đường container...'
              }
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
                Gửi Email Bản Tin Real-time kèm thông số mặt hàng & báo giá
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
