import { useRef, useState } from 'react'
import {
  Heart,
  Box,
  MapPin,
  ArrowRight,
  PhoneCall,
  Sparkles,
  Layers,
  MessageCircle,
  Maximize2,
  CheckCircle2,
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

  // Stock & Location status logic
  const isOutOfStock =
    property.stockStatus === 'OUT_OF_STOCK' ||
    property.status?.toLowerCase().includes('hết hàng') ||
    property.status?.toLowerCase().includes('đã bán')

  const isAtSite =
    property.storageLocation === 'AT_SITE' ||
    property.status?.toLowerCase().includes('công trình')

  const rawPhone = (property.brokerPhone || '0965985468').replace(/\D/g, '')

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
            'pointer-events-none absolute top-2.5 left-1/2 -translate-x-1/2 rounded-full border border-slate-700/80 bg-slate-950/85 px-2.5 py-0.5 text-[9.5px] font-medium text-slate-200 backdrop-blur-md transition-opacity duration-300 z-10 flex items-center gap-1.5 shadow-sm',
            isVideoPlaying ? 'opacity-100' : 'opacity-0'
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
          <span>Flycam 1080p</span>
        </div>

        {/* Top-Left: DUAL SQUARE STATUS BADGE (🟩 🟩 Còn hàng vs 🟥 🟥 Hết hàng) & 3D Badge */}
        <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1.5 items-start">
          {isOutOfStock ? (
            /* 🟥 🟥 2 Ô VUÔNG ĐỎ: HẾT HÀNG / ĐÃ BÁN */
            <div
              className="flex items-center gap-1.5 rounded-lg bg-rose-950/90 border border-rose-500/50 px-2.5 py-1 text-[10px] font-black text-rose-300 shadow-lg backdrop-blur-md"
              title="Mặt hàng này đã hết hàng hoặc đã bán"
            >
              <div className="flex items-center gap-1 shrink-0">
                <span className="h-2.5 w-2.5 rounded-[2px] bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.8)]" />
                <span className="h-2.5 w-2.5 rounded-[2px] bg-rose-500" />
              </div>
              <span className="tracking-wide">HẾT HÀNG</span>
            </div>
          ) : (
            /* 🟩 🟩 2 Ô VUÔNG XANH: CÒN HÀNG + NƠI ĐỂ (Ở BÃI / Ở CÔNG TRÌNH) */
            <div
              className="flex items-center gap-1.5 rounded-lg bg-emerald-950/90 border border-emerald-500/50 px-2.5 py-1 text-[10px] font-black text-emerald-300 shadow-lg backdrop-blur-md"
              title={isAtSite ? 'Còn hàng tại công trình (chờ tháo dỡ)' : 'Còn hàng tập kết tại kho bãi sẵn sàng cẩu bốc'}
            >
              <div className="flex items-center gap-1 shrink-0">
                <span className="h-2.5 w-2.5 rounded-[2px] bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] animate-pulse" />
                <span className="h-2.5 w-2.5 rounded-[2px] bg-emerald-400" />
              </div>
              <span className="tracking-wide">
                CÒN HÀNG • {isAtSite ? 'Ở CÔNG TRÌNH' : 'Ở BÃI'}
              </span>
            </div>
          )}

          {(property.model3dUrl || property.model3DUrl) && (
            <span className="flex items-center gap-1 rounded-md bg-cyan-950/90 border border-cyan-400/40 px-2 py-0.5 text-[9px] font-black text-cyan-300 shadow-md">
              <Box className="w-3 h-3 text-cyan-400" />
              <span>3D 360°</span>
            </span>
          )}
        </div>

        {/* Top-Right: Wishlist Heart Only (Tránh hoàn toàn việc đè lấn badge) */}
        <div className="absolute top-2.5 right-2.5 z-10 flex items-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              toggleSaveProperty(property.id)
            }}
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-full border border-white/20 backdrop-blur-md transition shadow',
              saved
                ? 'bg-white text-red-500 dark:bg-slate-900'
                : 'bg-slate-950/60 text-white/80 hover:text-red-400 hover:bg-slate-950/90'
            )}
            title="Lưu tin vào danh sách quan tâm"
          >
            <Heart className={cn('h-3.5 w-3.5', saved && 'fill-current')} />
          </button>
        </div>

        {/* Bottom Media Bar */}
        <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex items-center justify-between z-10 text-[11px] text-white">
          {/* Location Badge */}
          <div className="flex items-center gap-1 font-semibold truncate max-w-[70%] text-slate-200">
            <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span className="truncate">
              {property.district ? `${property.district}, ` : ''}{property.city || property.province}
            </span>
          </div>

          {/* 3D Interactive trigger button */}
          {(property.model3dUrl || property.model3DUrl) && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                open3DModal(property)
              }}
              className="inline-flex items-center gap-1 rounded-lg bg-teal-500/90 px-2 py-0.5 text-[10px] font-bold text-white hover:bg-teal-400 transition shadow-sm shrink-0"
            >
              <Box className="w-3 h-3" />
              <span>Xoay 3D</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Card Content */}
      <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4 space-y-3">
        <div>
          {/* Category Tag & Time Posted (Đưa danh mục xuống body card, không bị đè trên ảnh) */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 rounded-md bg-teal-50 dark:bg-teal-950/70 border border-teal-200/80 dark:border-teal-800/80 px-2 py-0.5 text-[10.5px] font-black text-teal-800 dark:text-teal-300 uppercase tracking-wide truncate max-w-[70%]">
              {property.typeDisplay || 'Nhà Xưởng'}
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium shrink-0">
              {property.created || 'Vừa đăng'}
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => openDetailModal(property)}
            className="font-bold text-sm sm:text-base text-slate-900 line-clamp-2 leading-snug group-hover:text-teal-600 transition cursor-pointer dark:text-white"
            title={property.title}
          >
            {property.title}
          </h3>

          {/* Price & Unit Price Row */}
          <div className="mt-2 flex flex-wrap items-baseline gap-2">
            <span className="text-base sm:text-lg font-black text-red-600 dark:text-red-400">
              {property.priceDisplay}
            </span>
            {property.unitPrice && (
              <span className="text-[11.5px] font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 border border-teal-200/60 dark:border-teal-800/50 px-2 py-0.5 rounded-md">
                {property.unitPrice}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
            {property.desc}
          </p>
        </div>

        {/* 3. Specifications Grid (Kích thước, Kết cấu, Vị trí bãi) */}
        <div className="grid grid-cols-3 gap-1 py-2 px-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 text-center text-[10.5px]">
          <div>
            <span className="text-slate-400 dark:text-slate-500 block text-[9px] uppercase font-bold tracking-wider">
              {property.length && property.width ? 'Kích Thước' : 'Quy Cách'}
            </span>
            <b className="text-slate-900 dark:text-white font-bold truncate block mt-0.5">
              {property.length && property.width
                ? `${property.width}m x ${property.length}m`
                : property.area}
            </b>
          </div>

          <div className="border-x border-slate-200/70 dark:border-slate-700 px-1">
            <span className="text-slate-400 dark:text-slate-500 block text-[9px] uppercase font-bold tracking-wider">
              Kết Cấu
            </span>
            <b className="text-slate-900 dark:text-white font-bold truncate block mt-0.5" title={property.structureType || 'Thép tiêu chuẩn'}>
              {property.structureType || (property.hasCrane ? 'Có Cẩu Trục' : 'Tiền Chế')}
            </b>
          </div>

          <div>
            <span className="text-slate-400 dark:text-slate-500 block text-[9px] uppercase font-bold tracking-wider">
              Cẩu Trục
            </span>
            <b className={cn('font-bold truncate block mt-0.5', property.hasCrane ? 'text-teal-600 dark:text-teal-400' : 'text-slate-500')}>
              {property.hasCrane ? (property.craneCapacity || 'Có Cẩu') : 'Không Cẩu'}
            </b>
          </div>
        </div>

        {/* Location & Yard Details */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span className="truncate font-medium">{property.kcn}</span>
        </div>

        {/* 4. Action Buttons Footer (Call, Zalo, Detail) */}
        <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5">
            {/* Call Button */}
            <a
              href={`tel:${rawPhone}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 rounded-xl bg-teal-50 border border-teal-500/30 px-2.5 py-1.5 text-xs font-bold text-teal-700 hover:bg-teal-100 dark:bg-teal-950/40 dark:text-teal-300 transition shrink-0"
              title="Gọi điện trực tiếp"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Gọi</span>
            </a>

            {/* Zalo Button */}
            <a
              href={`https://zalo.me/${rawPhone}`}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 rounded-xl bg-blue-50 border border-blue-500/30 px-2.5 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300 transition shrink-0"
              title="Nhắn tin Zalo"
            >
              <MessageCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>Zalo</span>
            </a>
          </div>

          <button
            type="button"
            onClick={() => openDetailModal(property)}
            className="flex items-center gap-1 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-teal-700 active:scale-95 transition dark:bg-teal-600 dark:hover:bg-teal-700 shrink-0"
          >
            <span>Chi tiết</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
