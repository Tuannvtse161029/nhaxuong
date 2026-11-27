import { useState, useEffect } from 'react'
import {
  X,
  Heart,
  MapPin,
  Film,
  Image,
  Maximize2,
  Box,
  Phone,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import type { Property } from '@/types/property.types'
import { useProperties } from '@/context/PropertyContext'
import { cn } from '@/utils/cn'

interface PropertyDetailModalProps {
  isOpen: boolean
  onClose: () => void
  property: Property | null
}

export function PropertyDetailModal({ isOpen, onClose, property }: PropertyDetailModalProps) {
  const { isSaved, toggleSaveProperty, open3DModal } = useProperties()
  const [activeMediaTab, setActiveMediaTab] = useState<'video' | 'photo'>('photo')
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0)

  // Normalize photos array from property.images, property.gallery, property.image
  const photos: string[] = (() => {
    if (!property) return []
    const list: string[] = []
    if (Array.isArray(property.images)) {
      list.push(...property.images)
    }
    if (Array.isArray(property.gallery)) {
      list.push(...property.gallery)
    }
    if (property.image) {
      const split = property.image.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)
      list.push(...split)
    }
    const unique = Array.from(new Set(list.filter((url) => typeof url === 'string' && url.trim().length > 0)))
    return unique.length > 0
      ? unique
      : ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80']
  })()

  useEffect(() => {
    setCurrentPhotoIdx(0)
    if (property) {
      setActiveMediaTab(property.videoUrl ? 'video' : 'photo')
    }
  }, [property?.id, property?.videoUrl])

  if (!isOpen || !property) return null

  const saved = isSaved(property.id)
  const safePhotoIdx = Math.min(Math.max(0, currentPhotoIdx), Math.max(0, photos.length - 1))

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentPhotoIdx((prev) => (prev <= 0 ? photos.length - 1 : prev - 1))
  }

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentPhotoIdx((prev) => (prev >= photos.length - 1 ? 0 : prev + 1))
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Đã bán':
        return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200'
      case 'Hết hàng':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200'
      case 'Đang giao dịch':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200'
      case 'Còn hàng':
      default:
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      {/* Floating Close Button for Mobile */}
      <button
        type="button"
        onClick={onClose}
        className="sm:hidden fixed top-2.5 right-2.5 z-[9999] flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-900/90 text-white font-bold text-xs shadow-xl border border-white/30 backdrop-blur-md cursor-pointer active:scale-95"
      >
        <X className="w-4 h-4" />
        <span>Đóng ✕</span>
      </button>

      <div className="relative flex flex-col w-full h-[100dvh] sm:h-auto sm:max-h-[92vh] max-w-4xl rounded-none sm:rounded-3xl bg-white shadow-2xl border-0 sm:border border-slate-200 dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-4 sm:px-6 py-3 sm:py-4 bg-slate-50/70 dark:bg-slate-950/60 pr-20 sm:pr-6">
          <div className="flex items-center gap-2.5 min-w-0 pr-4 flex-wrap">
            <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-teal-800 dark:bg-teal-950 dark:text-teal-300">
              {property.typeDisplay}
            </span>

            {/* Trạng thái bài đăng (Status) */}
            <span
              className={cn(
                'rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase border',
                getStatusColor(property.status)
              )}
            >
              {property.status || 'Còn hàng'}
            </span>

            {property.categoryName && (
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {property.categoryName}
              </span>
            )}

            {(property.model3dUrl || property.model3DUrl) && (
              <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                3D HTML
              </span>
            )}

            <span className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
              {property.title}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => toggleSaveProperty(property.id)}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 transition',
                saved ? 'text-red-500 bg-red-50 dark:bg-red-950/40' : 'text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              )}
              title="Lưu tin yêu thích"
            >
              <Heart className={cn('w-4 h-4', saved ? 'fill-red-500' : '')} />
            </button>

            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 transition"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Media Switcher: Video Flycam vs Photo Gallery */}
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
                {property.videoUrl && (
                  <button
                    type="button"
                    onClick={() => setActiveMediaTab('video')}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer',
                      activeMediaTab === 'video'
                        ? 'bg-slate-900 text-white shadow-sm dark:bg-teal-600'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                    )}
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Video Drone (1080p HD)</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActiveMediaTab('photo')}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer',
                    activeMediaTab === 'photo'
                      ? 'bg-slate-900 text-white shadow-sm dark:bg-teal-600'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  )}
                >
                  <Image className="w-3.5 h-3.5" />
                  <span>Hình Ảnh Thực Tế ({photos.length})</span>
                </button>
              </div>

              {photos.length > 1 && activeMediaTab === 'photo' && (
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Vuốt hoặc bấm mũi tên để xem {photos.length} ảnh
                </span>
              )}
            </div>

            {/* Video / Image Display */}
            <div className="relative aspect-video w-full rounded-2xl bg-black overflow-hidden shadow-inner group/viewer">
              {activeMediaTab === 'video' ? (
                <video
                  src={
                    property.videoUrl ||
                    'https://assets.mixkit.co/videos/preview/mixkit-drone-view-of-a-large-factory-or-warehouse-42861-large.mp4'
                  }
                  controls
                  playsInline
                  autoPlay
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="relative h-full w-full select-none flex items-center justify-center bg-slate-950">
                  <img
                    src={photos[safePhotoIdx]}
                    alt={`${property.title} - Ảnh ${safePhotoIdx + 1}`}
                    className="h-full w-full object-cover transition-all duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80'
                    }}
                  />

                  {/* Photo Counter Badge */}
                  <div className="absolute top-3 right-3 rounded-full bg-slate-950/85 border border-slate-700/80 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md shadow-md z-10">
                    Ảnh {safePhotoIdx + 1} / {photos.length}
                  </div>

                  {/* Prev Button */}
                  {photos.length > 1 && (
                    <button
                      type="button"
                      onClick={handlePrevPhoto}
                      className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-slate-950/75 hover:bg-slate-900 text-white flex items-center justify-center border border-white/20 backdrop-blur-md shadow-xl transition active:scale-90 z-20 cursor-pointer"
                      title="Ảnh trước"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  )}

                  {/* Next Button */}
                  {photos.length > 1 && (
                    <button
                      type="button"
                      onClick={handleNextPhoto}
                      className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-slate-950/75 hover:bg-slate-900 text-white flex items-center justify-center border border-white/20 backdrop-blur-md shadow-xl transition active:scale-90 z-20 cursor-pointer"
                      title="Ảnh tiếp theo"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Thumbnail Navigation Strip (Khi bài viết có nhiều ảnh thực tế) */}
            {activeMediaTab === 'photo' && photos.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto py-1 px-0.5 scrollbar-thin">
                {photos.map((pUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentPhotoIdx(idx)}
                    className={cn(
                      'relative h-14 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition active:scale-95 cursor-pointer',
                      safePhotoIdx === idx
                        ? 'border-teal-500 scale-105 shadow-md ring-2 ring-teal-400/50'
                        : 'border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-100'
                    )}
                  >
                    <img
                      src={pUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80'
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                {property.type === 'RECYCLED_STEEL' ? 'Khối Lượng / Diện Tích' : 'Diện Tích / Khuôn Viên'}
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1">
                <Maximize2 className="w-3.5 h-3.5 text-blue-500" />
                {property.area}
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Giá niêm yết
              </span>
              <p className="text-sm font-bold text-red-600 dark:text-red-400">
                {property.priceDisplay}
              </p>
              {property.unitPrice && (
                <span className="text-[11.5px] font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 border border-teal-200/50 dark:border-teal-800/50 px-2 py-0.5 rounded-md inline-block mt-1">
                  {property.unitPrice}
                </span>
              )}
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Vị Trí
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1 truncate" title={`${property.kcn}, ${property.province}`}>
                <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span className="truncate">{property.kcn}</span>
              </p>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Hotline Tư Vấn
              </span>
              <p className="text-sm font-bold text-teal-700 dark:text-teal-400 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>{property.brokerPhone || '0965 985 468'}</span>
              </p>
            </div>
          </div>

          {/* Extra Industrial Specs Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Chiều Cao Trần</span>
              <b className="text-slate-800 dark:text-slate-200 mt-0.5 block">{property.ceilingHeight || '11 mét'}</b>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Tải Trọng Sàn</span>
              <b className="text-slate-800 dark:text-slate-200 mt-0.5 block">{property.floorLoad || '5 tấn/m²'}</b>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Pháp Lý Nhà Xưởng</span>
              <b className="text-emerald-600 dark:text-emerald-400 mt-0.5 block truncate">{property.legalStatus || 'Sổ hồng SKC'}</b>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Đường Xe Cont</span>
              <b className="text-slate-800 dark:text-slate-200 mt-0.5 block truncate">{property.roadAccess || 'Container 40ft'}</b>
            </div>
          </div>

          {/* Location & Detailed Description */}
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <MapPin className="w-4 h-4 text-red-500" />
              <span>Vị trí: <b>{property.kcn}</b>, {property.province}</span>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Thông tin chi tiết quy hoạch & hạ tầng
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {property.desc}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer / Contact CTAs */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* 3D Demo CTA */}
            <button
              type="button"
              onClick={() => {
                onClose()
                open3DModal(property)
              }}
              className={cn(
                'flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-md transition cursor-pointer',
                (property.model3dUrl || property.model3DUrl)
                  ? 'bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700'
                  : 'bg-slate-800 dark:bg-slate-700 hover:bg-slate-900'
              )}
            >
              <Box className="w-4 h-4 text-amber-400" />
              <span>{(property.model3dUrl || property.model3DUrl) ? 'Xem mô hình 3D HTML' : 'Xem demo mô hình 3D'}</span>
            </button>

            {/* Hotline Call CTA */}
            <a
              href={`tel:${(property.brokerPhone || '0965985468').replace(/\s+/g, '')}`}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-teal-800 transition"
            >
              <Phone className="w-4 h-4" />
              <span>Gọi {property.brokerPhone || '0965 985 468'}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
