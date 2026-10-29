import { useRef, useState } from 'react'
import {
  Heart,
  Box,
  MapPin,
  ArrowRight,
  Zap,
  ShieldCheck,
  Headphones,
  FileCheck,
  Maximize2,
  PhoneCall,
  Sparkles,
  Layers,
} from 'lucide-react'
import type { Property } from '@/types/property.types'
import { useProperties } from '@/context/PropertyContext'
import { cn } from '@/utils/cn'

interface PropertyCardProps {
  property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { isSaved, toggleSaveProperty, openDetailModal, open3DModal } = useProperties()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const saved = isSaved(property.id)

  const handleMouseEnter = () => {
    if (videoRef.current && property.videoUrl) {
      videoRef.current.currentTime = 0
      videoRef.current
        .play()
        .then(() => setIsVideoPlaying(true))
        .catch(() => {})
    }
  }

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      setIsVideoPlaying(false)
    }
  }

  const isSale = property.type === 'SALE'
  const isRent = property.type === 'RENT'

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
      {/* 1. Media Container with Video Flycam Hover */}
      <div
        className="relative aspect-[16/10] bg-slate-950 overflow-hidden cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => openDetailModal(property)}
      >
        {/* Main Image */}
        <img
          src={property.image}
          alt={property.title}
          className={cn(
            'h-full w-full object-cover transition-all duration-700 group-hover:scale-105',
            isVideoPlaying ? 'opacity-0' : 'opacity-100'
          )}
        />

        {/* Video Flycam (Plays on hover) */}
        {property.videoUrl && (
          <video
            ref={videoRef}
            src={property.videoUrl}
            muted
            loop
            playsInline
            preload="metadata"
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-opacity duration-300',
              isVideoPlaying ? 'opacity-100' : 'opacity-0'
            )}
          />
        )}

        {/* Live video indicator */}
        <div
          className={cn(
            'pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 rounded-full border border-slate-700/80 bg-slate-950/85 px-2.5 py-0.5 text-[10px] font-medium text-slate-200 backdrop-blur-md transition-opacity duration-300 z-10 flex items-center gap-1.5 shadow-sm',
            isVideoPlaying ? 'opacity-100' : 'opacity-0'
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
          <span>Flycam Toàn Cảnh 1080p</span>
        </div>

        {/* Badges Bar (Top Left) */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
          {/* Category Tag */}
          <span
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-md backdrop-blur-md',
              isSale
                ? 'bg-teal-700/95 border border-teal-500/40'
                : isRent
                ? 'bg-blue-700/95 border border-blue-500/40'
                : 'bg-amber-600/95 border border-amber-400/40'
            )}
          >
            <span>{property.typeDisplay}</span>
          </span>

          {/* Verified Legal Tag */}
          <span className="flex items-center gap-1 rounded-md bg-emerald-950/85 border border-emerald-500/30 px-2 py-0.5 text-[9.5px] font-bold text-emerald-300 backdrop-blur-md shadow-xs">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Pháp Lý Đã Xác Thực</span>
          </span>
        </div>

        {/* Wishlist Heart Button (Top Right) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            toggleSaveProperty(property.id)
          }}
          className={cn(
            'absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 backdrop-blur-md transition shadow',
            saved
              ? 'bg-white text-red-500 dark:bg-slate-900'
              : 'bg-slate-950/60 text-white/80 hover:text-red-400 hover:bg-slate-950/90'
          )}
          title="Lưu tin Nhà Xưởng vào danh sách quan tâm"
        >
          <Heart className={cn('w-4 h-4', saved ? 'fill-red-500 text-red-500' : '')} />
        </button>

        {/* Bottom Badges */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between">
          {/* Location Badge */}
          <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-slate-950/80 px-2.5 py-1 text-[11px] font-semibold text-white/95 backdrop-blur-md shadow-xs">
            <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span className="truncate max-w-[140px] sm:max-w-[180px]">{property.kcn}</span>
          </div>

          {/* 3D Tour Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              open3DModal(property)
            }}
            className="flex items-center gap-1.5 rounded-lg border border-amber-400/30 bg-amber-500/90 px-2.5 py-1 text-[11px] font-bold text-slate-950 backdrop-blur-md shadow-lg hover:bg-amber-400 transition"
            title="Khám phá mô hình xưởng 3D xoay 360 độ"
          >
            <Box className="w-3.5 h-3.5 text-slate-950" />
            <span>3D Tour</span>
          </button>
        </div>
      </div>

      {/* 2. Card Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3.5">
        <div>
          {/* Province & Audio status line */}
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 mb-1.5">
            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 truncate">
              <MapPin className="w-3 h-3 text-red-500 shrink-0" />
              <b>{property.province}</b> • {property.district ? `${property.district}, ` : ''}{property.kcn}
            </span>

            {property.audioUrl && (
              <span className="flex items-center gap-1 text-teal-700 dark:text-teal-400 text-[10px] font-bold bg-teal-50 dark:bg-teal-950/50 px-2 py-0.5 rounded-md shrink-0 border border-teal-200/50 dark:border-teal-800/40">
                <Headphones className="w-3 h-3 text-teal-600" />
                <span>Audio {property.audioDuration || '.mp3'}</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            onClick={() => openDetailModal(property)}
            className="font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug line-clamp-2 hover:text-teal-600 dark:hover:text-teal-400 transition cursor-pointer"
          >
            {property.title}
          </h3>

          {/* Price Header (Nhà Xưởng Style: Prominent Big Price & Unit Price) */}
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-black text-red-600 dark:text-red-400 tracking-tight">
              {property.priceDisplay}
            </span>
            {property.unitPrice && (
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                ({property.unitPrice})
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {property.desc}
          </p>
        </div>

        {/* 3. Specifications Grid */}
        <div className="grid grid-cols-3 gap-1.5 py-2.5 px-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-100 dark:border-slate-800 text-center text-[11px]">
          <div>
            <span className="text-slate-400 dark:text-slate-500 block text-[9.5px] uppercase font-bold tracking-wider">
              {property.type === 'RECYCLED_STEEL' ? 'Khối Lượng' : 'Diện Tích'}
            </span>
            <b className="text-slate-900 dark:text-white font-bold truncate block mt-0.5">
              {property.area}
            </b>
          </div>
          <div className="border-x border-slate-200/70 dark:border-slate-700 px-1">
            <span className="text-slate-400 dark:text-slate-500 block text-[9.5px] uppercase font-bold tracking-wider">
              Vị Trí
            </span>
            <b className="text-slate-900 dark:text-white font-bold truncate block mt-0.5" title={property.kcn}>
              {property.kcn}
            </b>
          </div>
          <div>
            <span className="text-slate-400 dark:text-slate-500 block text-[9.5px] uppercase font-bold tracking-wider">
              Đơn Giá
            </span>
            <b className="text-teal-700 dark:text-teal-400 font-bold truncate block mt-0.5">
              {property.unitPrice || 'Thương lượng'}
            </b>
          </div>
        </div>

        {/* Extra Specs Tags */}
        <div className="flex flex-wrap items-center gap-1.5 text-[10.5px]">
          {property.ceilingHeight && (
            <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              Trần cao: <b>{property.ceilingHeight}</b>
            </span>
          )}
          {property.floorLoad && (
            <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              Sàn: <b>{property.floorLoad}</b>
            </span>
          )}
          {property.legalStatus && (
            <span className="truncate max-w-[200px] rounded-md bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              {property.legalStatus}
            </span>
          )}
        </div>

        {/* 4. Broker / Contact Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          {property.brokerName ? (
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-800 font-bold text-xs dark:bg-teal-900 dark:text-teal-200">
                {property.brokerName.charAt(0)}
              </div>
              <div className="truncate">
                <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                  {property.brokerName}
                </p>
                <p className="text-[10px] text-slate-400">Chuyên viên Nhà Xưởng</p>
              </div>
            </div>
          ) : (
            <span className="text-[11px] text-slate-400 font-medium">Nhà Xưởng Chính Chủ</span>
          )}

          <div className="flex items-center gap-1.5 shrink-0">
            {property.brokerPhone && (
              <a
                href={`tel:${property.brokerPhone.replace(/\s+/g, '')}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 rounded-xl border border-teal-500/30 bg-teal-50 px-2.5 py-1.5 text-xs font-bold text-teal-700 hover:bg-teal-100 dark:bg-teal-950/50 dark:text-teal-300 transition"
                title="Gọi trực tiếp cho chuyên viên phụ trách"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Gọi Ngay</span>
              </a>
            )}

            <button
              type="button"
              onClick={() => openDetailModal(property)}
              className="flex items-center gap-1 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-teal-700 active:scale-95 transition dark:bg-teal-600 dark:hover:bg-teal-700"
            >
              <span>Xem Chi Tiết</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
