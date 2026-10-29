import { useState } from 'react'
import {
  X,
  Heart,
  MapPin,
  Film,
  Image,
  Zap,
  ShieldCheck,
  Maximize2,
  Box,
  Phone,
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
  const [activeMediaTab, setActiveMediaTab] = useState<'video' | 'photo'>('video')

  if (!isOpen || !property) return null

  const saved = isSaved(property.id)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-4xl max-h-[92vh] rounded-3xl bg-white shadow-2xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4 bg-slate-50/70 dark:bg-slate-950/60">
          <div className="flex items-center gap-2.5 min-w-0 pr-4">
            <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-teal-800 dark:bg-teal-950 dark:text-teal-300">
              {property.typeDisplay}
            </span>
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
          {/* Media Switcher: Video Flycam vs Photo */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
                <button
                  type="button"
                  onClick={() => setActiveMediaTab('video')}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition',
                    activeMediaTab === 'video'
                      ? 'bg-slate-900 text-white shadow-sm dark:bg-teal-600'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  )}
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>Video Drone (1080p HD)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMediaTab('photo')}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition',
                    activeMediaTab === 'photo'
                      ? 'bg-slate-900 text-white shadow-sm dark:bg-teal-600'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                  )}
                >
                  <Image className="w-3.5 h-3.5" />
                  <span>Hình Ảnh Thực Tế</span>
                </button>
              </div>
            </div>

            {/* Video / Image Display */}
            <div className="relative aspect-video w-full rounded-2xl bg-black overflow-hidden shadow-inner">
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
                <img
                  src={property.image}
                  alt={property.title}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
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
                <span className="text-[11px] text-slate-500 font-medium block">
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
                <span>{property.brokerPhone || '090 123 4567'}</span>
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
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 dark:bg-slate-700 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-slate-900 transition cursor-pointer"
            >
              <Box className="w-4 h-4 text-amber-400" />
              <span>Xem demo mô hình 3D</span>
            </button>

            {/* Hotline Call CTA */}
            <a
              href={`tel:${(property.brokerPhone || '0901234567').replace(/\s+/g, '')}`}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-teal-800 transition"
            >
              <Phone className="w-4 h-4" />
              <span>Gọi {property.brokerPhone || '090 123 4567'}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
