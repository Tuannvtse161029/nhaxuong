import { useState, useEffect } from 'react'
import {
  X,
  Mail,
  Layers,
  Warehouse,
  Box,
  Upload,
  MapPin,
  SlidersHorizontal,
  Plus,
  Trash2,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react'
import type { Property, PropertyType, Category } from '@/types/property.types'
import { useProperties } from '@/context/PropertyContext'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { PROVINCES_LIST, DISTRICTS_LIST } from '@/data/mockData'
import { formatCurrency } from '@/utils/formatters'
import { propertyApi } from '@/api/propertyApi'
import { ENV } from '@/config/env.config'
import { cn } from '@/utils/cn'
import { compressImage } from '@/utils/imageCompressor'

interface AdminPropertyModalProps {
  isOpen: boolean
  onClose: () => void
  property: Property | null
}

export function AdminPropertyModal({ isOpen, onClose, property }: AdminPropertyModalProps) {
  const { addProperty, updateProperty, categories, addCategory } = useProperties()

  // Basic info
  const [title, setTitle] = useState('')
  const [type, setType] = useState<PropertyType>('BAN_KHUNG_XUONG')
  const [status, setStatus] = useState('Còn hàng')
  const [stockStatus, setStockStatus] = useState<'IN_STOCK' | 'OUT_OF_STOCK'>('IN_STOCK')
  const [storageLocation, setStorageLocation] = useState<'AT_YARD' | 'AT_SITE'>('AT_YARD')
  const [categoryId, setCategoryId] = useState<number | null>(null)

  // Location
  const [province, setProvince] = useState('Bình Dương')
  const [district, setDistrict] = useState('Dĩ An')
  const [kcn, setKcn] = useState('')

  // Pricing & Area
  const [price, setPrice] = useState(0)
  const [priceFormatted, setPriceFormatted] = useState('')
  const [unitPrice, setUnitPrice] = useState('')
  const [unitPriceVal, setUnitPriceVal] = useState('')
  const [unitPriceUnit, setUnitPriceUnit] = useState('đ/kg')
  const [area, setArea] = useState('')

  // 3D & Structural specifications
  const [length, setLength] = useState<number | ''>('')
  const [width, setWidth] = useState<number | ''>('')
  const [structureType, setStructureType] = useState('Zamil')
  const [hasCrane, setHasCrane] = useState(false)
  const [craneCapacity, setCraneCapacity] = useState('10 Tấn')

  // Contact & Media
  const [brokerPhone, setBrokerPhone] = useState('0965 985 468')
  const [videoUrl, setVideoUrl] = useState('')
  const [model3dUrl, setModel3dUrl] = useState('')
  const [drawing2DUrl, setDrawing2DUrl] = useState('')
  const [image, setImage] = useState('')
  const [imagesList, setImagesList] = useState<string[]>([])
  const [rawImageInput, setRawImageInput] = useState('')
  const [desc, setDesc] = useState('')
  const [triggerEmail, setTriggerEmail] = useState(true)
  const [isUploading3D, setIsUploading3D] = useState(false)
  const [isUploadingImages, setIsUploadingImages] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')

  // Inline Quick Add Category
  const [showAddCatInput, setShowAddCatInput] = useState(false)
  const [quickCatName, setQuickCatName] = useState('')

  useEffect(() => {
    if (property) {
      setTitle(property.title)
      setType(property.type)
      setStatus(property.status || 'Còn hàng')
      setStockStatus((property.stockStatus as any) || 'IN_STOCK')
      setStorageLocation((property.storageLocation as any) || 'AT_YARD')
      setCategoryId(property.categoryId ?? null)
      setProvince(property.province || 'Bình Dương')
      setDistrict(property.district || 'Dĩ An')
      setKcn(property.kcn || '')
      setPrice(property.price || 0)
      setPriceFormatted(property.price ? property.price.toLocaleString('vi-VN') : '')
      
      const up = property.unitPrice || ''
      setUnitPrice(up)
      const digits = up.replace(/\D/g, '')
      if (digits) {
        setUnitPriceVal(parseInt(digits, 10).toLocaleString('vi-VN'))
      } else {
        setUnitPriceVal('')
      }
      if (up.includes('đ/kg')) {
        setUnitPriceUnit('đ/kg')
      } else if (up.includes('đ/m²') || up.includes('đ/m2')) {
        setUnitPriceUnit('đ/m²')
      } else if (up.includes('Tr/m²') || up.includes('Tr/m2')) {
        setUnitPriceUnit('Tr/m²')
      } else if (up.includes('Tr/Tấn') || up.includes('Tr/tấn')) {
        setUnitPriceUnit('Tr/Tấn')
      } else if (up.includes('đ/cây')) {
        setUnitPriceUnit('đ/cây')
      }

      setArea(property.area || '')
      setLength(property.length ?? '')
      setWidth(property.width ?? '')
      setStructureType(property.structureType || 'Zamil')
      setHasCrane(Boolean(property.hasCrane))
      setCraneCapacity(property.craneCapacity || '10 Tấn')
      setBrokerPhone(property.brokerPhone || '0965 985 468')
      setVideoUrl(property.videoUrl || '')
      setModel3dUrl(property.model3dUrl || '')
      setDrawing2DUrl(property.drawing2DUrl || '')
      setImage(property.image || '')

      // Populate images list
      const list: string[] = []
      if (Array.isArray(property.images)) list.push(...property.images)
      if (Array.isArray(property.gallery)) list.push(...property.gallery)
      if (property.image) {
        const parts = property.image.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
        list.push(...parts)
      }
      setImagesList(Array.from(new Set(list)))
      setRawImageInput('')
      setDesc(property.desc || '')
    } else {
      setTitle('')
      setType('BAN_KHUNG_XUONG')
      setStatus('Còn hàng')
      setStockStatus('IN_STOCK')
      setStorageLocation('AT_YARD')
      const defaultCat = categories.find((c) => c.code === 'BAN_KHUNG_XUONG')
      setCategoryId(defaultCat?.id ?? null)
      setProvince('Bình Dương')
      setDistrict('Dĩ An')
      setKcn('Kho Bãi ICD Tân Cảng, TP. Dĩ An')
      setPrice(0)
      setPriceFormatted('')
      setUnitPrice('')
      setUnitPriceVal('')
      setUnitPriceUnit('đ/kg')
      setArea('')
      setLength('')
      setWidth('')
      setStructureType('Zamil')
      setHasCrane(false)
      setCraneCapacity('10 Tấn')
      setBrokerPhone('0965 985 468')
      setVideoUrl('')
      setModel3dUrl('')
      setDrawing2DUrl('')
      setImage('')
      setImagesList([])
      setRawImageInput('')
      setDesc('')
    }
  }, [property, isOpen, categories])

  if (!isOpen) return null

  const formatPriceInWords = (num: number) => {
    if (!num || num <= 0) return '0 VNĐ'
    if (num >= 1_000_000_000) {
      const ty = Math.floor(num / 1_000_000_000)
      const remainder = num % 1_000_000_000
      const trieu = Math.round(remainder / 1_000_000)
      return trieu > 0 ? `${ty} Tỷ ${trieu} Triệu VNĐ` : `${ty} Tỷ VNĐ`
    }
    if (num >= 1_000_000) {
      const trieu = (num / 1_000_000).toLocaleString('vi-VN', { maximumFractionDigits: 1 })
      return `${trieu} Triệu VNĐ`
    }
    if (num >= 1_000) {
      return `${(num / 1_000).toLocaleString('vi-VN')} Ngàn VNĐ`
    }
    return `${num.toLocaleString('vi-VN')} VNĐ`
  }

  const handlePriceFormattedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDigits = e.target.value.replace(/\D/g, '')
    if (!rawDigits) {
      setPrice(0)
      setPriceFormatted('')
      return
    }
    const numVal = parseInt(rawDigits, 10)
    setPrice(numVal)
    setPriceFormatted(numVal.toLocaleString('vi-VN'))
  }

  const handleUnitSelect = (unit: string) => {
    setUnitPriceUnit(unit)
    if (unitPriceVal.trim()) {
      setUnitPrice(`${unitPriceVal.trim()} ${unit}`)
    }
  }

  const handleUnitPriceValChange = (val: string) => {
    // Tự động định dạng số đơn giá có dấu chấm hàng nghìn (VD: 380000 -> 380.000)
    const rawDigits = val.replace(/\D/g, '')
    if (!rawDigits) {
      setUnitPriceVal('')
      setUnitPrice('')
      return
    }
    const num = parseInt(rawDigits, 10)
    const formatted = num.toLocaleString('vi-VN')
    setUnitPriceVal(formatted)
    setUnitPrice(`${formatted} ${unitPriceUnit}`)
  }

  const addPricePreset = (amount: number) => {
    const newPrice = (price || 0) + amount
    setPrice(newPrice)
    setPriceFormatted(newPrice > 0 ? newPrice.toLocaleString('vi-VN') : '')
  }

  const setExactPrice = (amount: number) => {
    setPrice(amount)
    setPriceFormatted(amount > 0 ? amount.toLocaleString('vi-VN') : '')
  }

  const handleAddImagesFromInput = () => {
    if (!rawImageInput.trim()) return
    const splitted = rawImageInput
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 5)
    if (splitted.length > 0) {
      setImagesList((prev) => Array.from(new Set([...prev, ...splitted])))
      setRawImageInput('')
    }
  }

  const handleRemoveImage = (index: number) => {
    setImagesList((prev) => prev.filter((_, idx) => idx !== index))
  }

  // Tải nhiều ảnh trực tiếp từ máy / điện thoại: Nén canvas và lưu thẳng DataURL vào Database
  const handleMultipleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploadingImages(true)
    const filesArr = Array.from(files)
    setUploadProgress(`Đang nén & tối ưu 0/${filesArr.length} ảnh...`)

    const newUploadedUrls: string[] = []

    for (let i = 0; i < filesArr.length; i++) {
      const file = filesArr[i]
      setUploadProgress(`Đang nén & lưu ảnh ${i + 1}/${filesArr.length} (${file.name})...`)

      try {
        // 1. Tự động nén ảnh qua HTML5 Canvas: Giảm từ 5-15MB xuống ~40-60KB (max 1000px, JPEG 0.72)
        const { dataUrl, file: compressedFile } = await compressImage(file, 1000, 0.72)

        if (dataUrl) {
          // Lưu trực tiếp DataURL đã nén siêu nhẹ vào danh sách ảnh
          // Ảnh này hiển thị tức thì, 100% là ảnh thật vừa chọn, không bao giờ bị 404 hay đè ảnh Unsplash!
          newUploadedUrls.push(dataUrl)

          // Background upload lên backend để lưu trữ thêm (nếu backend đang online)
          propertyApi.uploadImage(compressedFile).catch(() => {})
        }
      } catch (compressErr) {
        console.error('Lỗi nén ảnh:', compressErr)
      }
    }

    if (newUploadedUrls.length > 0) {
      setImagesList((prev) => Array.from(new Set([...prev, ...newUploadedUrls])))
    }

    setIsUploadingImages(false)
    setUploadProgress('')
    e.target.value = ''
  }

  const handleModel3DUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const lowerName = file.name.toLowerCase()
    if (!lowerName.endsWith('.html') && !lowerName.endsWith('.htm') && !lowerName.endsWith('.glb')) {
      alert('Mô hình 3D yêu cầu file HTML (.html) hoặc GLB (.glb)!')
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

  const handleQuickAddCategory = () => {
    if (!quickCatName.trim()) return
    const code = 'CAT_' + Date.now().toString(36).toUpperCase()
    const newCat: Category = {
      name: quickCatName.trim(),
      code,
      icon: 'Warehouse',
      desc: 'Danh mục tùy chỉnh',
      active: true,
    }
    addCategory(newCat)
    setType(code)
    setQuickCatName('')
    setShowAddCatInput(false)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      alert('Vui lòng nhập tiêu đề bài đăng!')
      return
    }

    if (!price || price <= 0) {
      alert('Vui lòng nhập tổng giá tiền niêm yết (VD: 500.000.000 đ)!')
      return
    }

    try {
      const catObj = categories.find((c) => c.code === type || (categoryId && c.id === categoryId))
      const typeDisplay = catObj ? catObj.name : 'Nhà Xưởng & Sắt Thép'
      const priceDisplay = formatCurrency(price)

      const validImages = imagesList.filter((s) => s.trim().length > 5)
      const defaultImage =
        validImages[0] ||
        image.trim() ||
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80'

      // Area auto-compute if length and width provided and area empty
      const computedArea =
        area.trim() ||
        (length && width ? `${Number(length) * Number(width)} m²` : 'Quy cách chuẩn')

      const propertyPayload = {
        title: title.trim(),
        type,
        typeDisplay,
        status: stockStatus === 'OUT_OF_STOCK' ? 'Hết hàng' : 'Còn hàng',
        stockStatus,
        storageLocation,
        categoryId: categoryId ?? catObj?.id ?? null,
        province,
        city: province,
        district,
        kcn: kcn.trim() || 'Vị trí bãi kho',
        price,
        priceDisplay,
        unitPrice: unitPrice.trim(),
        area: computedArea,
        length: length !== '' ? Number(length) : undefined,
        width: width !== '' ? Number(width) : undefined,
        structureType,
        hasCrane,
        craneCapacity: hasCrane ? craneCapacity : undefined,
        brokerPhone: brokerPhone.trim() || '0965 985 468',
        videoUrl: videoUrl.trim(),
        model3dUrl: model3dUrl.trim() || null,
        drawing2DUrl: drawing2DUrl.trim() || null,
        image: defaultImage,
        images: validImages.length > 0 ? validImages : [defaultImage],
        gallery: validImages.length > 0 ? validImages : [defaultImage],
        desc: desc.trim(),
      }

      if (property) {
        updateProperty(property.id, propertyPayload, triggerEmail)
      } else {
        addProperty(propertyPayload, triggerEmail)
      }

      onClose()
    } catch (saveErr: any) {
      console.error('Lỗi lưu bài đăng:', saveErr)
      alert('Có lỗi khi lưu bài đăng: ' + (saveErr?.message || 'Vui lòng thử lại!'))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white p-5 sm:p-7 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Warehouse className="w-5 h-5 text-teal-600" />
              <span>{property ? 'Chỉnh Sửa Bài Đăng' : 'Đăng Bài Bán Khung Xưởng & Bản Vẽ 3D'}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Chọn danh mục, vị trí bãi/công trình, thông số kết cấu Dài x Rộng, cẩu trục và trạng thái 2 ô vuông
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form noValidate onSubmit={handleSave} className="space-y-4 pt-4 text-xs sm:text-sm">
          {/* 1. Title */}
          <Input
            label="Tiêu đề bài đăng *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="VD: Khung Nhà Xưởng 24m x 84m Kèo Zamil Có Cẩu Trục 10T..."
            required
          />

          {/* 2. Category & Quick Add Category */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Thể loại danh mục (Category) *
              </label>
              <button
                type="button"
                onClick={() => setShowAddCatInput(!showAddCatInput)}
                className="text-xs font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400 inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm danh mục mới</span>
              </button>
            </div>

            {/* Inline Add Category Bar */}
            {showAddCatInput && (
              <div className="flex items-center gap-2 p-2 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800">
                <input
                  type="text"
                  placeholder="Nhập tên danh mục mới (VD: Thép Chữ H, Tôn PU...)"
                  value={quickCatName}
                  onChange={(e) => setQuickCatName(e.target.value)}
                  className="flex-1 rounded-lg border border-teal-300 p-1.5 text-xs text-slate-900 dark:bg-slate-800 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleQuickAddCategory}
                  className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-teal-700"
                >
                  Tạo & Chọn
                </button>
              </div>
            )}

            <select
              value={type}
              onChange={(e) => {
                const selectedCode = e.target.value
                setType(selectedCode)
                const cat = categories.find((c) => c.code === selectedCode)
                if (cat) setCategoryId(cat.id ?? null)
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {categories.map((cat) => (
                <option key={cat.code} value={cat.code}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* 3. DUAL SQUARE STATUS & STORAGE LOCATION (Critical Feature) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-800/40">
            {/* Stock Status -> controls 2 green / 2 red squares */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Trạng thái hàng (Hiển thị 2 ô vuông góc phải)</span>
                <span className="flex items-center gap-1 font-mono text-[10px]">
                  {stockStatus === 'IN_STOCK' ? '🟩 🟩 Còn hàng' : '🟥 🟥 Hết hàng'}
                </span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStockStatus('IN_STOCK')}
                  className={cn(
                    'flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition border',
                    stockStatus === 'IN_STOCK'
                      ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300'
                  )}
                >
                  <span className="flex items-center gap-0.5">
                    <span className="h-2 w-2 rounded-[2px] bg-emerald-400" />
                    <span className="h-2 w-2 rounded-[2px] bg-emerald-400" />
                  </span>
                  <span>Còn hàng (2 Xanh)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStockStatus('OUT_OF_STOCK')}
                  className={cn(
                    'flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition border',
                    stockStatus === 'OUT_OF_STOCK'
                      ? 'bg-rose-600 text-white border-rose-400 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300'
                  )}
                >
                  <span className="flex items-center gap-0.5">
                    <span className="h-2 w-2 rounded-[2px] bg-rose-400" />
                    <span className="h-2 w-2 rounded-[2px] bg-rose-400" />
                  </span>
                  <span>Hết hàng (2 Đỏ)</span>
                </button>
              </div>
            </div>

            {/* Storage Location: Ở bãi vs Ở công trình */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Nơi để hàng
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStorageLocation('AT_YARD')}
                  className={cn(
                    'flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition border',
                    storageLocation === 'AT_YARD'
                      ? 'bg-teal-600 text-white border-teal-500 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300'
                  )}
                >
                  <span>Ở Bãi (Tập kết sẵn)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStorageLocation('AT_SITE')}
                  className={cn(
                    'flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition border',
                    storageLocation === 'AT_SITE'
                      ? 'bg-amber-600 text-white border-amber-500 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300'
                  )}
                >
                  <span>Ở Công Trình (Đang đứng)</span>
                </button>
              </div>
            </div>
          </div>

          {/* 4. GEOGRAPHICAL LOCATION (Lâm Đồng, Bình Dương, Dĩ An, Bảo Lộc...) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Tỉnh / Thành phố *
              </label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                {PROVINCES_LIST.filter((p) => p !== 'Toàn Quốc').map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Quận / Huyện / TP Thuộc Tỉnh *
              </label>
              <input
                type="text"
                placeholder="VD: Dĩ An, Thuận An, Bảo Lộc, Đà Lạt..."
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Kho bãi / KCN cụ thể *
              </label>
              <input
                type="text"
                placeholder="VD: Kho Bãi ICD Tân Cảng, TP. Dĩ An"
                value={kcn}
                onChange={(e) => setKcn(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              />
            </div>
          </div>

          {/* 5. 3D STRUCTURAL SPECIFICATIONS (Dài, Rộng, Kết cấu, Cẩu trục) */}
          <div className="p-4 rounded-2xl border border-cyan-500/30 bg-cyan-950/10 dark:bg-cyan-950/20 space-y-3">
            <h4 className="text-xs font-bold text-cyan-900 dark:text-cyan-300 flex items-center gap-1.5 uppercase tracking-wide">
              <Box className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Thông Số Kích Thước Kết Cấu 3D (Dài, Rộng, Kết Cấu, Cẩu Trục)</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Chiều Rộng (m)
                </label>
                <input
                  type="number"
                  placeholder="VD: 24"
                  value={width}
                  onChange={(e) => setWidth(e.target.value ? Number(e.target.value) : '')}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Chiều Dài (m)
                </label>
                <input
                  type="number"
                  placeholder="VD: 84"
                  value={length}
                  onChange={(e) => setLength(e.target.value ? Number(e.target.value) : '')}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Loại Kết Cấu
                </label>
                <select
                  value={structureType}
                  onChange={(e) => setStructureType(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="Zamil">Khung Zamil</option>
                  <option value="Thép I">Thép Hình I</option>
                  <option value="Kèo Tiệp">Kèo Tiệp (Chữ A)</option>
                  <option value="Khác">Kết Cấu Khác</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Cẩu Trục
                </label>
                <div className="flex items-center gap-1.5 mt-1">
                  <label className="flex items-center gap-1 cursor-pointer font-bold text-xs text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={hasCrane}
                      onChange={(e) => setHasCrane(e.target.checked)}
                      className="rounded text-teal-600 focus:ring-teal-500 h-4 w-4"
                    />
                    <span>Có cẩu trục</span>
                  </label>
                  {hasCrane && (
                    <input
                      type="text"
                      placeholder="VD: 10 Tấn"
                      value={craneCapacity}
                      onChange={(e) => setCraneCapacity(e.target.value)}
                      className="w-20 rounded-lg border border-slate-200 p-1 text-xs text-slate-900 dark:bg-slate-800 dark:text-white"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* 3D Model URL & Upload */}
            <div className="pt-2 border-t border-cyan-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-cyan-900 dark:text-cyan-300 flex items-center gap-1.5">
                  <Box className="w-3.5 h-3.5 text-cyan-600" />
                  Mô hình 3D tương tác (File HTML / GLB xoay 360°)
                </label>

                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-cyan-600 text-white hover:bg-cyan-500 transition shadow-xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading3D ? 'Đang tải...' : 'Tải File 3D (.html/.glb)'}</span>
                  <input
                    type="file"
                    accept=".html,.htm,.glb"
                    className="hidden"
                    disabled={isUploading3D}
                    onChange={handleModel3DUpload}
                  />
                </label>
              </div>
              <Input
                value={model3dUrl}
                onChange={(e) => setModel3dUrl(e.target.value)}
                placeholder="/models3d/nha_xuong_24x84.html hoặc link file 3D"
              />
            </div>

            {/* 2D Drawing URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Link Bản Vẽ 2D AutoCAD (.dxf / .step / .pdf)
              </label>
              <Input
                value={drawing2DUrl}
                onChange={(e) => setDrawing2DUrl(e.target.value)}
                placeholder="/models3d/mat_bang_24x84.dxf hoặc link Google Drive"
              />
            </div>
          </div>

          {/* 6. PRICING & AREA & UNIT PRICE SELECTOR */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                Định Giá & Đơn Vị Tính (kg / m²)
              </h4>
              {unitPrice && (
                <span className="text-teal-600 dark:text-teal-400 font-mono text-[11px] font-bold bg-teal-50 dark:bg-teal-950/60 border border-teal-300 dark:border-teal-700 px-2 py-0.5 rounded-lg">
                  Hiển thị: {unitPrice}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Tổng giá trị niêm yết (VNĐ) *</span>
                  <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold">
                    Có dấu chấm hàng nghìn
                  </span>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={priceFormatted}
                  onChange={handlePriceFormattedChange}
                  placeholder="VD: 500.000.000"
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 font-mono font-bold dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                />
                {/* Nút bấm chọn nhanh giá tiền */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  <button
                    type="button"
                    onClick={() => addPricePreset(50_000_000)}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    + 50 Tr
                  </button>
                  <button
                    type="button"
                    onClick={() => addPricePreset(100_000_000)}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    + 100 Tr
                  </button>
                  <button
                    type="button"
                    onClick={() => setExactPrice(500_000_000)}
                    className="px-2 py-0.5 rounded-md bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900 border border-teal-300 dark:border-teal-700 text-[10px] font-bold text-teal-700 dark:text-teal-300 cursor-pointer"
                  >
                    500 Triệu
                  </button>
                  <button
                    type="button"
                    onClick={() => setExactPrice(1_000_000_000)}
                    className="px-2 py-0.5 rounded-md bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900 border border-teal-300 dark:border-teal-700 text-[10px] font-bold text-teal-700 dark:text-teal-300 cursor-pointer"
                  >
                    1 Tỷ
                  </button>
                  <button
                    type="button"
                    onClick={() => setExactPrice(0)}
                    className="px-2 py-0.5 rounded-md bg-red-50 hover:bg-red-100 dark:bg-red-950/60 text-[10px] font-bold text-red-600 dark:text-red-400 cursor-pointer"
                  >
                    Xóa
                  </button>
                </div>
                {price > 0 && (
                  <div className="mt-1.5 p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-[11px] text-teal-800 dark:text-teal-300 font-bold flex items-center gap-1 flex-wrap">
                    <span>💰 Đọc giá:</span>
                    <span className="underline">{formatPriceInWords(price)}</span>
                    <span className="text-slate-500 dark:text-slate-400 font-normal">
                      ({price.toLocaleString('vi-VN')} đ)
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Quy cách / Diện tích / Khối lượng *
                </label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="VD: 2.016 m² hoặc 95 Tấn hoặc 45 Cây"
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Đơn vị tính đơn giá (chọn nhanh)
                </label>
                <div className="flex flex-wrap gap-1">
                  {(['đ/kg', 'đ/m²', 'Tr/m²', 'Tr/Tấn', 'đ/cây'] as const).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => handleUnitSelect(u)}
                      className={cn(
                        'px-2.5 py-1 rounded-lg text-xs font-bold transition border cursor-pointer',
                        unitPriceUnit === u
                          ? 'bg-teal-600 text-white border-teal-500 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                      )}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Input Đơn giá số & Đơn vị ghép */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nhập số đơn giá (VD: 15.000 hoặc 719.000)
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={unitPriceVal}
                    onChange={(e) => handleUnitPriceValChange(e.target.value)}
                    placeholder="VD: 380.000"
                    className="flex-1 rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <span className="px-3 py-2 rounded-xl bg-teal-100 dark:bg-teal-950/60 font-bold text-xs text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-700">
                    {unitPriceUnit}
                  </span>
                </div>
                {/* Gợi ý đơn giá nhanh */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {(['15.000', '25.000', '380.000', '719.000'] as const).map((pVal) => (
                    <button
                      key={pVal}
                      type="button"
                      onClick={() => handleUnitPriceValChange(pVal)}
                      className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      {pVal}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Chuỗi đơn giá hiển thị trên web
                </label>
                <input
                  type="text"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  placeholder="VD: 15.000 đ/kg hoặc 719.000 đ/m²"
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-medium text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* 7. CONTACT & MULTI-IMAGE GALLERY (Quản lý nhiều hình ảnh thực tế) */}
          <div className="space-y-3">
            <div>
              <Input
                label="Số điện thoại liên hệ *"
                value={brokerPhone}
                onChange={(e) => setBrokerPhone(e.target.value)}
                placeholder="VD: 0965 985 468"
              />
            </div>

            {/* Quản lý danh sách hình ảnh thực tế */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wide">
                  <ImageIcon className="w-4 h-4 text-teal-600" />
                  <span>Bộ Sưu Tập Hình Ảnh Thực Tế ({imagesList.length} ảnh)</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  * Ảnh đầu tiên làm ảnh đại diện
                </span>
              </div>

              {/* DIRECT MULTI-FILE UPLOAD BUTTON (TẢI NHIỀU ẢNH TRỰC TIẾP TỪ MÁY HOẶC ĐIỆN THOẠI) */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="admin-multi-image-upload"
                  className={cn(
                    'flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold text-white transition shadow-md cursor-pointer border',
                    isUploadingImages
                      ? 'bg-slate-500 cursor-not-allowed border-transparent'
                      : 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 active:scale-95 border-teal-400/50'
                  )}
                >
                  {isUploadingImages ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Upload className="w-5 h-5" />
                  )}
                  <span>
                    {isUploadingImages
                      ? uploadProgress || 'Đang tải nhiều ảnh lên...'
                      : '📁 Tải Lên Nhiều Ảnh Trực Tiếp Từ Máy / Điện Thoại (Chọn 1 hoặc nhiều ảnh)'}
                  </span>
                  <input
                    type="file"
                    id="admin-multi-image-upload"
                    multiple
                    accept="image/*"
                    className="hidden"
                    disabled={isUploadingImages}
                    onChange={handleMultipleImagesUpload}
                  />
                </label>

                {/* Hoặc dán link ảnh bổ sung */}
                <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700/80">
                  <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                    Hoặc dán thêm link ảnh bên ngoài (cách nhau bởi dấu phẩy):
                  </span>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={rawImageInput}
                      onChange={(e) => setRawImageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddImagesFromInput()
                        }
                      }}
                      placeholder="Dán link ảnh (https://...) rồi nhấn Thêm Link..."
                      className="flex-1 rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddImagesFromInput}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition shrink-0 cursor-pointer shadow-xs"
                    >
                      + Thêm Link
                    </button>
                  </div>
                </div>
              </div>

              {/* Dải ảnh Preview có nút xóa */}
              {imagesList.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 pt-1">
                  {imagesList.map((url, idx) => (
                    <div
                      key={idx}
                      className="group relative aspect-video rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-xs"
                    >
                      <img
                        src={url}
                        alt={`Ảnh ${idx + 1}`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      {idx === 0 && (
                        <span className="absolute bottom-1 left-1 rounded bg-teal-600/90 px-1 py-0.5 text-[8.5px] font-bold text-white shadow-xs">
                          Ảnh chính
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-600/90 text-white flex items-center justify-center opacity-80 sm:opacity-0 group-hover:opacity-100 transition shadow cursor-pointer hover:bg-red-700"
                        title="Xóa ảnh này"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11.5px] text-slate-500 italic">
                  Chưa có ảnh nào trong bộ sưu tập. Dán link ảnh và nhấn "+ Thêm Ảnh" để người mua xem chi tiết.
                </p>
              )}
            </div>
          </div>

          {/* 8. Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Mô tả chi tiết sản phẩm / tình trạng tháo dỡ / phụ kiện đi kèm
            </label>
            <textarea
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Nhập thông số bu lông, xà gồ Z mạ kẽm, dầm đỡ cẩu trục, tình trạng sơn phủ và hỗ trợ bốc xếp cẩu hàng..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          {/* 9. Email Broadcast Trigger */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-3 dark:border-blue-900/60 dark:bg-blue-950/40">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={triggerEmail}
                onChange={(e) => setTriggerEmail(e.target.checked)}
                className="h-4 w-4 rounded text-teal-600 focus:ring-teal-500"
              />
              <span className="flex items-center gap-1.5 font-medium">
                <Mail className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                Gửi Email Broadcast Real-time kèm thông số hàng & báo giá tới khách hàng quan tâm
              </span>
            </label>
          </div>

          {/* Action buttons */}
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
