import { useState, useEffect } from 'react'
import { X, Mail, Layers, Warehouse, Box, Upload } from 'lucide-react'
import type { Property, PropertyType } from '@/types/property.types'
import { useProperties } from '@/context/PropertyContext'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { PROVINCES_LIST } from '@/data/mockData'
import { formatCurrency } from '@/utils/formatters'
import { propertyApi } from '@/api/propertyApi'

interface AdminPropertyModalProps {
  isOpen: boolean
  onClose: () => void
  property: Property | null
}

export function AdminPropertyModal({ isOpen, onClose, property }: AdminPropertyModalProps) {
  const { addProperty, updateProperty, categories } = useProperties()

  const [title, setTitle] = useState('')
  const [type, setType] = useState<PropertyType>('SALE')
  const [status, setStatus] = useState('Còn hàng')
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [province, setProvince] = useState('Bình Dương')
  const [kcn, setKcn] = useState('')
  const [price, setPrice] = useState(0)
  const [unitPrice, setUnitPrice] = useState('')
  const [area, setArea] = useState('')
  const [brokerPhone, setBrokerPhone] = useState('090 123 4567')
  const [videoUrl, setVideoUrl] = useState('')
  const [audioUrl, setAudioUrl] = useState('')
  const [model3dUrl, setModel3dUrl] = useState('')
  const [image, setImage] = useState('')
  const [desc, setDesc] = useState('')
  const [triggerEmail, setTriggerEmail] = useState(true)
  const [isUploading3D, setIsUploading3D] = useState(false)

  useEffect(() => {
    if (property) {
      setTitle(property.title)
      setType(property.type)
      setStatus(property.status || 'Còn hàng')
      setCategoryId(property.categoryId ?? null)
      setProvince(property.province)
      setKcn(property.kcn || '')
      setPrice(property.price || 0)
      setUnitPrice(property.unitPrice || '')
      setArea(property.area || '')
      setBrokerPhone(property.brokerPhone || '090 123 4567')
      setVideoUrl(property.videoUrl || '')
      setAudioUrl(property.audioUrl || '')
      setModel3dUrl(property.model3dUrl || '')
      setImage(property.image || '')
      setDesc(property.desc || '')
    } else {
      setTitle('')
      setType('SALE')
      setStatus('Còn hàng')
      const defaultCat = categories.find((c) => c.code === 'SALE')
      setCategoryId(defaultCat?.id ?? null)
      setProvince('Bình Dương')
      setKcn('')
      setPrice(0)
      setUnitPrice('')
      setArea('')
      setBrokerPhone('090 123 4567')
      setVideoUrl('')
      setAudioUrl('')
      setModel3dUrl('')
      setImage('')
      setDesc('')
    }
  }, [property, isOpen, categories])

  if (!isOpen) return null

  const isRecycledSteel = type === 'RECYCLED_STEEL'

  const handleModel3DUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const lowerName = file.name.toLowerCase()
    if (!lowerName.endsWith('.html') && !lowerName.endsWith('.htm')) {
      alert('Mô hình 3D bắt buộc phải là file HTML (.html hoặc .htm)!')
      return
    }
    setIsUploading3D(true)
    try {
      const res = await propertyApi.uploadModel3D(file)
      setModel3dUrl(res.url)
    } catch (err: any) {
      alert('Lỗi tải file 3D: ' + (err.message || 'Không thể tải file'))
    } finally {
      setIsUploading3D(false)
    }
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const catObj = categories.find((c) => c.code === type || (categoryId && c.id === categoryId))
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

    const defaultImage = isRecycledSteel
      ? 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&q=80'
      : 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80'

    const propertyPayload = {
      title: title.trim(),
      type,
      typeDisplay,
      status: status.trim() || 'Còn hàng',
      categoryId: categoryId ?? catObj?.id ?? null,
      province,
      kcn: kcn.trim() || 'Vị trí bãi kho',
      price,
      priceDisplay,
      unitPrice: unitPrice.trim(),
      area: area.trim(),
      brokerPhone: brokerPhone.trim() || '090 123 4567',
      videoUrl: videoUrl.trim(),
      audioUrl: audioUrl.trim(),
      model3dUrl: model3dUrl.trim() || null,
      image: image.trim() || defaultImage,
      desc: desc.trim(),
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
              {isRecycledSteel ? (
                <Layers className="w-5 h-5 text-teal-600" />
              ) : (
                <Warehouse className="w-5 h-5 text-teal-600" />
              )}
              {property
                ? 'Chỉnh Sửa Thông Tin Mặt Hàng'
                : isRecycledSteel
                ? 'Thêm Mới Sắt Thép Tái Sử Dụng'
                : 'Thêm Mới & Xuất Bản Nhà Xưởng'}
            </h3>
            <p className="text-[11px] text-slate-400">
              {isRecycledSteel
                ? 'Điền thông tin vị trí bãi kho, khối lượng thép, trạng thái, giá bán và mô hình 3D HTML'
                : 'Điền thông tin vị trí kho xưởng, diện tích, trạng thái, giá bán/thuê và mô hình 3D HTML'}
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Loại hình danh mục
              </label>
              <select
                value={type}
                onChange={(e) => {
                  const newType = e.target.value as PropertyType
                  setType(newType)
                  const matchCat = categories.find((c) => c.code === newType)
                  if (matchCat?.id) setCategoryId(matchCat.id)
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 font-semibold"
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
                Trạng thái bài đăng
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 font-semibold"
              >
                <option value="Còn hàng">🟢 Còn hàng (Đang mở)</option>
                <option value="Đã bán">🔴 Đã bán</option>
                <option value="Hết hàng">⚪ Hết hàng / Tạm ngưng</option>
                <option value="Đang giao dịch">🟡 Đang giao dịch / Đặt cọc</option>
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
              label="Vị trí kho bãi / KCN"
              value={kcn}
              onChange={(e) => setKcn(e.target.value)}
              placeholder={isRecycledSteel ? 'VD: Kho Bãi ICD Tân Cảng, Đường ĐT 743...' : 'VD: KCN VSIP 1, KCN Sóng Thần 2...'}
              required
            />
            <Input
              label={isRecycledSteel ? 'Khối lượng / Diện tích (Tấn hoặc m2)' : 'Diện tích / Khuôn viên (m2)'}
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder={isRecycledSteel ? 'VD: 85 Tấn hoặc 3.200 m2' : 'VD: 10.000 m2 hoặc 5.000 m2'}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Giá niêm yết (VNĐ)"
              type="number"
              step={10000000}
              value={price || ''}
              onChange={(e) => setPrice(Number(e.target.value))}
              helperText={price > 0 ? `Định dạng: ${formatCurrency(price)}` : 'Nhập giá bán hoặc thuê'}
              required
            />
            <Input
              label={isRecycledSteel ? 'Đơn giá tham chiếu (đ/kg hoặc đ/m2)' : 'Đơn giá tham chiếu (m2 / tháng)'}
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              placeholder={isRecycledSteel ? 'VD: 14.700 đ/kg hoặc 306.000 đ/m²' : 'VD: 4.0 Triệu/m2 hoặc 70.000 đ/m2/tháng'}
            />
          </div>

          <Input
            label="Hotline liên hệ tư vấn"
            value={brokerPhone}
            onChange={(e) => setBrokerPhone(e.target.value)}
            placeholder="VD: 090 123 4567"
          />

          {/* Mô Hình 3D HTML Section */}
          <div className="p-4 rounded-2xl border border-teal-500/25 bg-teal-50/60 dark:bg-teal-950/20 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-teal-900 dark:text-teal-300 flex items-center gap-1.5">
                <Box className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                Mô hình 3D tương tác (File HTML xoay 360°)
              </label>

              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 transition shadow-xs">
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploading3D ? 'Đang tải lên...' : 'Tải File .html 3D'}</span>
                <input
                  type="file"
                  accept=".html,.htm"
                  className="hidden"
                  disabled={isUploading3D}
                  onChange={handleModel3DUpload}
                />
              </label>
            </div>
            <Input
              value={model3dUrl}
              onChange={(e) => setModel3dUrl(e.target.value)}
              placeholder="Nhập link file HTML mô hình 3D hoặc bấm nút 'Tải File .html 3D' ở trên"
              helperText="File HTML 3D sẽ được nhúng trực tiếp vào modal để khách hàng xoay tương tác 360 độ"
            />
          </div>

          <Input
            label="URL Video Drone MP4 (Hover Autoplay)"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://.../video.mp4"
          />

          <Input
            label="URL Hình Ảnh Thumbnail"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://images.unsplash.com/..."
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
                  ? 'VD: Khung dầm H400, bản mã dày, giằng xà gồ C200 đầy đủ, có cẩu trục hỗ trợ bốc xếp...'
                  : 'Nhập chi tiết về trần cao, sàn tải trọng, đường container, bàn giao...'
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
