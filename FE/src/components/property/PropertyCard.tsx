import { useRef, useState } from 'react'
import { Heart, Box, MapPin, ArrowRight, Zap, ShieldCheck, Headphones } from 'lucide-react'
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

  const tagColor =
    property.type === 'SALE'
      ? 'bg-teal-500'
      : property.type === 'RENT'
      ? 'bg-blue-500'
      : 'bg-amber-500'

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
      {/* Media container with video hover autoplay */}
      <div
        className="relative aspect-[16/10] bg-slate-950 overflow-hidden cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => openDetailModal(property)}
      >
        {/* Thumbnail Image */}
        <img
          src={property.image}
          alt={property.title}
          className={cn(
            'h-full w-full object-cover transition-all duration-700 group-hover:scale-105',
            isVideoPlaying ? 'opacity-0' : 'opacity-100'
          )}
        />

        {/* Video (Hover Autoplay) */}
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
          <span>Video Flycam thực tế</span>
        </div>

        {/* Category Pill */}
        <span className="pointer-events-none absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-950/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md shadow">
          <span className={cn('h-1.5 w-1.5 rounded-full', tagColor)} />
          <span>{property.typeDisplay}</span>
        </span>

        {/* Wishlist Heart Button */}
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
          title="Lưu tin yêu thích"
        >
          <Heart className={cn('w-4 h-4', saved ? 'fill-red-500 text-red-500' : '')} />
        </button>

        {/* Location Badge */}
        <div className="pointer-events-none absolute bottom-3 left-3 z-10 flex items-center gap-1 rounded-lg border border-white/10 bg-slate-950/75 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-md">
          <MapPin className="w-3 h-3 text-teal-400 shrink-0" />
          <span className="truncate max-w-[140px] sm:max-w-[170px]">{property.kcn}</span>
        </div>

        {/* 3D Tour Badge */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            open3DModal(property)
          }}
          className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-lg border border-white/20 bg-slate-950/85 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md shadow-lg hover:border-teal-400 hover:bg-teal-600 transition"
          title="Xem mô hình 3D xoay 360°"
        >
          <Box className="w-3.5 h-3.5 text-teal-400 group-hover:text-white" />
          <span>3D Tour</span>
        </button>
      </div>

      {/* Card Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3.5">
        <div>
          {/* Location line & Audio badge */}
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 mb-1">
            <span className="flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              {property.province} • {property.kcn}
            </span>
            {property.audioUrl && (
              <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400 text-[10px] font-semibold bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded-md shrink-0">
                <Headphones className="w-3 h-3" />
                <span>Audio {property.audioDuration || '.mp3'}</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            onClick={() => openDetailModal(property)}
            className="font-bold text-slate-900 dark:text-white text-sm sm:text-[15px] leading-snug line-clamp-2 hover:text-teal-600 dark:hover:text-teal-400 transition cursor-pointer"
          >
            {property.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
            {property.desc}
          </p>
        </div>

        {/* Technical Specs Row */}
        <div className="grid grid-cols-3 gap-1.5 py-2 px-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 text-center text-[11px]">
          <div>
            <span className="text-slate-400 dark:text-slate-500 block text-[9.5px] uppercase font-semibold">
              Khuôn viên
            </span>
            <b className="text-slate-800 dark:text-slate-200 font-semibold truncate block">
              {property.area}
            </b>
          </div>
          <div className="border-x border-slate-200/60 dark:border-slate-700 px-1">
            <span className="text-slate-400 dark:text-slate-500 block text-[9.5px] uppercase font-semibold flex items-center justify-center gap-0.5">
              <Zap className="w-2.5 h-2.5 text-amber-500" /> Điện
            </span>
            <b className="text-slate-800 dark:text-slate-200 font-semibold truncate block">
              {property.power}
            </b>
          </div>
          <div>
            <span className="text-slate-400 dark:text-slate-500 block text-[9.5px] uppercase font-semibold flex items-center justify-center gap-0.5">
              <ShieldCheck className="w-2.5 h-2.5 text-emerald-500" /> PCCC
            </span>
            <b className="text-teal-700 dark:text-teal-400 font-semibold truncate block">
              {property.pccc.split(' ')[0]}
            </b>
          </div>
        </div>

        {/* Bottom Price & CTA */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">Giá niêm yết</span>
            <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              {property.priceDisplay}
            </span>
          </div>

          <button
            type="button"
            onClick={() => openDetailModal(property)}
            className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-teal-700 active:scale-95 transition dark:bg-teal-600 dark:hover:bg-teal-700"
          >
            <span>Chi tiết</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
