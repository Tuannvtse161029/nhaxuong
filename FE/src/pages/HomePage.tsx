import {
  Factory,
  Warehouse,
  Mail,
  Box,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Headphones,
} from 'lucide-react'
import { useProperties } from '@/context/PropertyContext'
import { PropertyFilterBar } from '@/components/search/PropertyFilterBar'
import { PropertyCard } from '@/components/property/PropertyCard'
import { PropertyDetailModal } from '@/components/property/PropertyDetailModal'
import { Warehouse3DModal } from '@/components/three/Warehouse3DModal'
import { SavedPropertiesModal } from '@/components/saved/SavedPropertiesModal'
import { NoticeModal } from '@/components/notice/NoticeModal'
import { SubscribeNewsletterModal } from '@/components/subscribe/SubscribeNewsletterModal'

export function HomePage() {
  const {
    filteredProperties,
    resetFilters,
    activeModal,
    selectedProperty,
    closeModal,
    openSubscribeModal,
    open3DModal,
    properties,
  } = useProperties()

  return (
    <div className="space-y-10">
      {/* HERO BANNER TỐI GIẢN SANG TRỌNG (ENTERPRISE INDUSTRIAL) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 sm:p-12 text-white shadow-xl border border-slate-800">
        {/* Subtle Architectural Background Icon */}
        <div className="pointer-events-none absolute -right-10 -bottom-10 opacity-5">
          <Factory className="h-96 w-96 text-white" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-300 backdrop-blur-md mb-4">
            <span className="h-2 w-2 rounded-full bg-teal-400" />
            <span>Sàn Giao Dịch Bất Động Sản Công Nghiệp Toàn Quốc</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Tìm Kiếm Kho Xưởng & Đất Khu Công Nghiệp
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Tra cứu quy hoạch KCN, lọc ngân sách linh hoạt bằng <b>thanh trượt con trỏ đôi Min-Max</b>,
            nghe <b>Audio thuyết minh (.mp3)</b>, xem <b>video flycam quay thực tế</b> và trải nghiệm{' '}
            <b>mô hình 3D xoay 360°</b> trực quan.
          </p>

          {/* Quick Actions Strip */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const firstProp = properties[0]
                if (firstProp) open3DModal(firstProp)
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md hover:bg-teal-700 transition"
            >
              <Box className="w-4 h-4 text-amber-300" />
              <span>Trải nghiệm 3D Tour 360°</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={openSubscribeModal}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-200 hover:bg-slate-800 backdrop-blur-md transition"
            >
              <Mail className="w-4 h-4 text-teal-400" />
              <span>Đăng ký nhận bản tin thị trường</span>
            </button>
          </div>
        </div>

        {/* 2-Tier Filter Component */}
        <div className="mt-8">
          <PropertyFilterBar />
        </div>
      </div>

      {/* DANH SÁCH BÀI VIẾT NHÀ XƯỞNG DÀNH CHO USER DUYỆT */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4 dark:border-slate-800">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Warehouse className="w-5 h-5 text-teal-600" />
              Danh Mục Kho Xưởng & BĐS Công Nghiệp
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Tìm thấy <b className="text-slate-900 dark:text-white">{filteredProperties.length}</b> bất động
              sản phù hợp tiêu chí
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 font-medium text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
              <Box className="w-3.5 h-3.5 text-amber-500" />
              <span>Mô Hình 3D HTML</span>
            </span>
            <span className="flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-2.5 py-1 font-medium text-teal-700 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-300">
              <Headphones className="w-3.5 h-3.5 text-teal-600" />
              <span>Audio .mp3 Thuyết Minh</span>
            </span>
            <span className="hidden sm:flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 font-medium text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>Video Drone Hover</span>
            </span>
          </div>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
              <Warehouse className="h-8 w-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              Không tìm thấy nhà xưởng nào trong tầm giá hoặc khu vực này!
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Hãy thử nới rộng khoảng giá trên thanh kéo slider hoặc chọn lại Khu Công Nghiệp khác.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xóa Bộ Lọc & Tìm Lại</span>
            </button>
          </div>
        )}
      </div>

      {/* Global Modals */}
      <PropertyDetailModal
        isOpen={activeModal === 'detail'}
        onClose={closeModal}
        property={selectedProperty}
      />

      <Warehouse3DModal
        isOpen={activeModal === '3d'}
        onClose={closeModal}
        property={selectedProperty}
      />

      <SavedPropertiesModal isOpen={activeModal === 'saved'} onClose={closeModal} />
      <NoticeModal isOpen={activeModal === 'notice'} onClose={closeModal} />
      <SubscribeNewsletterModal isOpen={activeModal === 'subscribe'} onClose={closeModal} />
    </div>
  )
}
