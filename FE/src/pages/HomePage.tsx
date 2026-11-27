import { useState, useEffect, useRef } from 'react'
import {
  Warehouse,
  Layers,
  Grid,
  FileText,
  LayoutGrid,
  ShieldAlert,
  Truck,
  Box,
  Flame,
  MapPin,
  Search,
  Filter,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  PhoneCall,
  Check,
  ChevronUp,
  X,
} from 'lucide-react'
import { useProperties } from '@/context/PropertyContext'
import { PropertyCard } from '@/components/property/PropertyCard'
import { PropertyDetailModal } from '@/components/property/PropertyDetailModal'
import { Warehouse3DModal } from '@/components/three/Warehouse3DModal'
import { SavedPropertiesModal } from '@/components/saved/SavedPropertiesModal'
import { NoticeModal } from '@/components/notice/NoticeModal'
import { SubscribeNewsletterModal } from '@/components/subscribe/SubscribeNewsletterModal'
import { DISTRICTS_LIST } from '@/data/mockData'
import { cn } from '@/utils/cn'

export function HomePage() {
  const {
    filteredProperties,
    properties,
    filterState,
    setFilterState,
    resetFilters,
    activeModal,
    selectedProperty,
    closeModal,
    categories,
    showToast,
  } = useProperties()

  // Local draft state for Advanced Filter (Only applies when clicking "Tìm Hàng")
  const [draft, setDraft] = useState({
    keyword: filterState.keyword || '',
    type: filterState.type || 'ALL',
    district: filterState.district || 'ALL',
    stockStatus: filterState.stockStatus || 'ALL',
    storageLocation: filterState.storageLocation || 'ALL',
    structureType: filterState.structureType || 'ALL',
    hasCrane: filterState.hasCrane,
    widthMin: filterState.widthMin,
    lengthMin: filterState.lengthMin,
  })

  const [isAdvancedOpen, setIsAdvancedOpen] = useState(true)
  const feedRef = useRef<HTMLDivElement | null>(null)

  // Keep draft in sync if external filterState changes (e.g. from Header or Reset)
  useEffect(() => {
    setDraft({
      keyword: filterState.keyword || '',
      type: filterState.type || 'ALL',
      district: filterState.district || 'ALL',
      stockStatus: filterState.stockStatus || 'ALL',
      storageLocation: filterState.storageLocation || 'ALL',
      structureType: filterState.structureType || 'ALL',
      hasCrane: filterState.hasCrane,
      widthMin: filterState.widthMin,
      lengthMin: filterState.lengthMin,
    })
  }, [filterState])

  // Handle Apply Search (Triggered ONLY by user button click or Enter key)
  const handleApplySearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setFilterState({
      keyword: draft.keyword.trim(),
      type: draft.type as any,
      district: draft.district,
      stockStatus: draft.stockStatus as any,
      storageLocation: draft.storageLocation as any,
      structureType: draft.structureType,
      hasCrane: draft.hasCrane,
      widthMin: draft.widthMin,
      lengthMin: draft.lengthMin,
    })
    showToast('Đã áp dụng bộ lọc! Đang hiển thị các mặt hàng phù hợp.')
    // Smooth scroll to feed list
    setTimeout(() => {
      feedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  // Handle Reset Search
  const handleResetSearch = () => {
    const emptyDraft = {
      keyword: '',
      type: 'ALL' as const,
      district: 'ALL',
      stockStatus: 'ALL' as const,
      storageLocation: 'ALL' as const,
      structureType: 'ALL',
      hasCrane: null,
      widthMin: undefined,
      lengthMin: undefined,
    }
    setDraft(emptyDraft)
    resetFilters()
    showToast('Đã đặt lại toàn bộ điều kiện lọc')
  }

  // Map category codes to icons
  const getCategoryIcon = (code: string) => {
    switch (code) {
      case 'BAN_KHUNG_XUONG':
        return <Warehouse className="w-4 h-4" />
      case 'COT_KEO':
        return <Layers className="w-4 h-4" />
      case 'THEP_HINH_I':
        return <Grid className="w-4 h-4" />
      case 'TON_LOP_VACH':
        return <FileText className="w-4 h-4" />
      case 'TON_SAN_DECK':
        return <LayoutGrid className="w-4 h-4" />
      case 'ONG_PCCC':
        return <ShieldAlert className="w-4 h-4" />
      case 'THANH_LY_XUONG':
        return <Truck className="w-4 h-4" />
      case 'THIET_KE_3D':
        return <Box className="w-4 h-4 text-cyan-400" />
      default:
        return <Warehouse className="w-4 h-4" />
    }
  }

  // Check if any filter is active
  const hasActiveFilters =
    filterState.type !== 'ALL' ||
    Boolean(filterState.keyword.trim()) ||
    (filterState.district && filterState.district !== 'ALL' && filterState.district !== 'Tất cả khu vực') ||
    filterState.stockStatus !== 'ALL' ||
    Boolean(filterState.widthMin) ||
    Boolean(filterState.lengthMin) ||
    (filterState.structureType && filterState.structureType !== 'ALL') ||
    filterState.hasCrane !== null

  return (
    <div className="space-y-4 pb-12">
      {/* 1. TOP HERO HEADER & QUICK HOTLINE BANNER */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 p-3.5 sm:p-5 text-white shadow-lg border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Sàn Giao Dịch Khung Xưởng & Sắt Thép</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-teal-500/20 border border-teal-400/30 px-2 py-0.5 text-[10px] font-bold text-teal-300">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
                Hàng Mới Về
              </span>
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Khung Zamil, Thép hình I, Tôn lợp, Tôn sàn, Ống PCCC & Thiết kế 3D tại Bình Dương, Lâm Đồng, Đồng Nai
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="tel:0965985468"
              className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-3.5 py-2 text-xs font-bold text-white shadow hover:bg-teal-500 transition active:scale-95"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Hotline: 0965 985 468</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. HORIZONTAL CATEGORY TABS (Quick Tap Filter) */}
      <div className="relative">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar select-none">
          {/* 'All' / 'Tin Mới Nhất' Pill */}
          <button
            type="button"
            onClick={() => {
              setDraft((prev) => ({ ...prev, type: 'ALL' }))
              setFilterState({ type: 'ALL', categoryId: undefined })
            }}
            className={cn(
              'flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-all shrink-0 shadow-xs border',
              filterState.type === 'ALL'
                ? 'bg-teal-600 text-white border-teal-500 shadow-teal-500/20'
                : 'bg-white text-slate-700 border-slate-200 hover:border-teal-400 hover:text-teal-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
            )}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Tất Cả (Tin Mới Nhất)</span>
          </button>

          {/* Categories List Pills */}
          {categories.map((cat) => {
            const isSelected = filterState.type === cat.code
            return (
              <button
                key={cat.code}
                type="button"
                onClick={() => {
                  setDraft((prev) => ({ ...prev, type: cat.code }))
                  setFilterState({ type: cat.code })
                }}
                className={cn(
                  'flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-all shrink-0 shadow-xs border',
                  isSelected
                    ? cat.code === 'THIET_KE_3D'
                      ? 'bg-cyan-600 text-white border-cyan-400 shadow-cyan-500/20'
                      : 'bg-teal-600 text-white border-teal-500 shadow-teal-500/20'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-teal-400 hover:text-teal-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
                )}
              >
                {getCategoryIcon(cat.code)}
                <span>{cat.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. ADVANCED SEARCH & SPECIFICATIONS FILTER (TÌM KIẾM NÂNG CAO) */}
      <form
        onSubmit={handleApplySearch}
        className="rounded-2xl border-2 border-teal-600/30 bg-white p-3.5 sm:p-5 shadow-md dark:border-slate-800 dark:bg-slate-900 space-y-4"
      >
        {/* Header of Advanced Filter */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 text-white shadow-xs">
              <SlidersHorizontal className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Bộ Lọc Tìm Kiếm Nâng Cao</span>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
                  Chọn xong nhấn Tìm Hàng
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Lọc nhanh theo từ khóa, kích thước dài x rộng, vị trí bãi kho và loại kết cấu
              </p>
            </div>
          </div>

          {/* Mũi tên thu phóng bộ lọc viền cam nổi bật cho khách hàng dễ nhìn */}
          <button
            type="button"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-orange-500 bg-orange-50/90 text-orange-700 hover:bg-orange-100 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-500 font-extrabold text-xs shadow-sm hover:shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
            title={isAdvancedOpen ? 'Bấm để thu gọn bộ lọc' : 'Bấm để mở rộng bộ lọc'}
          >
            <span className="text-[11px] font-bold">{isAdvancedOpen ? 'Thu gọn' : 'Mở rộng'}</span>
            {isAdvancedOpen ? (
              <ChevronUp className="w-4 h-4 stroke-[3] text-orange-600 dark:text-orange-400" />
            ) : (
              <ChevronDown className="w-4 h-4 stroke-[3] text-orange-600 dark:text-orange-400" />
            )}
          </button>
        </div>

        {/* Filter Inputs Grid (Collapsible on mobile) */}
        {isAdvancedOpen && (
          <div className="space-y-3.5">
            {/* ROW 1: Keyword, Category, Location */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
              {/* Keyword Search */}
              <div className="sm:col-span-5 relative">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Từ Khóa Tìm Kiếm
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="VD: Khung Zamil 24x84, thép I300, tôn sàn..."
                    value={draft.keyword}
                    onChange={(e) => setDraft((prev) => ({ ...prev, keyword: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Category Dropdown */}
              <div className="sm:col-span-4 relative">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Danh Mục Sản Phẩm
                </label>
                <div className="relative">
                  <select
                    value={draft.type}
                    onChange={(e) => setDraft((prev) => ({ ...prev, type: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="ALL">📦 Tất Cả Danh Mục</option>
                    {categories.map((cat) => (
                      <option key={cat.code} value={cat.code}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Location Dropdown */}
              <div className="sm:col-span-3 relative">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Vị Trí / Bãi Kho
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-teal-600" />
                  <select
                    value={draft.district}
                    onChange={(e) => setDraft((prev) => ({ ...prev, district: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-8 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    {DISTRICTS_LIST.map((dist) => (
                      <option key={dist} value={dist === 'Tất cả khu vực' ? 'ALL' : dist}>
                        📍 {dist}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* ROW 2: Dimension Inputs (Length & Width) + Structure Type + Crane + Stock Status */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 pt-1">
              {/* Dimensions (Width & Length) */}
              <div className="sm:col-span-4 grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Chiều Rộng (m)
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      placeholder="VD: 24"
                      value={draft.widthMin || ''}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          widthMin: e.target.value ? Number(e.target.value) : undefined,
                        }))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    <span className="absolute right-3 text-xs font-bold text-slate-400 pointer-events-none">m</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Chiều Dài (m)
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      placeholder="VD: 84"
                      value={draft.lengthMin || ''}
                      onChange={(e) =>
                        setDraft((prev) => ({
                          ...prev,
                          lengthMin: e.target.value ? Number(e.target.value) : undefined,
                        }))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                    <span className="absolute right-3 text-xs font-bold text-slate-400 pointer-events-none">m</span>
                  </div>
                </div>
              </div>

              {/* Structure Type */}
              <div className="sm:col-span-3">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Kết Cấu Khung Xưởng
                </label>
                <select
                  value={draft.structureType}
                  onChange={(e) => setDraft((prev) => ({ ...prev, structureType: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
                >
                  <option value="ALL">Tất Cả Kết Cấu</option>
                  <option value="Zamil">Khung Zamil Tiền Chế</option>
                  <option value="Thép I">Thép Hình I Đúc</option>
                  <option value="Kèo Tiệp">Kèo Tiệp Chữ A</option>
                </select>
              </div>

              {/* Crane Support */}
              <div className="sm:col-span-3">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Cầu Trục Nhà Xưởng
                </label>
                <select
                  value={draft.hasCrane === null ? 'ALL' : draft.hasCrane ? 'true' : 'false'}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      hasCrane: e.target.value === 'ALL' ? null : e.target.value === 'true',
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
                >
                  <option value="ALL">Tất Cả (Có hoặc Không)</option>
                  <option value="true">✅ Bắt Buộc Có Cẩu Trục</option>
                  <option value="false">❌ Không Có Cẩu Trục</option>
                </select>
              </div>

              {/* Stock Status */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Trạng Thái Hàng
                </label>
                <select
                  value={draft.stockStatus}
                  onChange={(e) => setDraft((prev) => ({ ...prev, stockStatus: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 px-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
                >
                  <option value="ALL">Tất cả hàng</option>
                  <option value="IN_STOCK">🟩 Còn Hàng</option>
                  <option value="OUT_OF_STOCK">🟥 Hết Hàng</option>
                </select>
              </div>
            </div>

            {/* ACTION BUTTONS ROW: [TÌM HÀNG] & [ĐẶT LẠI] */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                * Nhấn nút <b>"Tìm Hàng"</b> để hệ thống lọc ra danh sách chính xác nhất.
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleResetSearch}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl border-2 border-red-500 bg-red-50/90 hover:bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-300 dark:border-red-500 px-4 py-2.5 text-xs font-extrabold transition active:scale-95 shadow-xs cursor-pointer"
                  title="Xóa toàn bộ tiêu chí lọc"
                >
                  <RotateCcw className="w-3.5 h-3.5 stroke-[2.5] text-red-600 dark:text-red-400" />
                  <span>Xóa hết / Đặt lại</span>
                </button>

                <button
                  type="submit"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 hover:bg-teal-700 px-6 py-2.5 text-xs sm:text-sm font-black text-white shadow-lg shadow-teal-600/30 active:scale-95 transition-all cursor-pointer"
                >
                  <Search className="w-4 h-4 stroke-[2.5]" />
                  <span>TÌM HÀNG NGAY</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* ACTIVE FILTER BADGES ROW (Shows what is currently applied) */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-100 dark:bg-slate-800/60 rounded-xl text-xs">
          <span className="font-bold text-slate-600 dark:text-slate-300 text-[11px] mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-teal-600" />
            Đang lọc:
          </span>

          {filterState.type !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 font-semibold text-[11px]">
              Danh mục: {categories.find((c) => c.code === filterState.type)?.name || filterState.type}
              <button
                type="button"
                onClick={() => setFilterState({ type: 'ALL' })}
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filterState.keyword.trim() && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 font-semibold text-[11px]">
              Từ khóa: "{filterState.keyword}"
              <button
                type="button"
                onClick={() => setFilterState({ keyword: '' })}
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filterState.district && filterState.district !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 font-semibold text-[11px]">
              Vị trí: {filterState.district}
              <button
                type="button"
                onClick={() => setFilterState({ district: 'ALL' })}
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filterState.widthMin && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 font-semibold text-[11px]">
              Rộng: ≥{filterState.widthMin}m
              <button
                type="button"
                onClick={() => setFilterState({ widthMin: undefined })}
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filterState.lengthMin && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 font-semibold text-[11px]">
              Dài: ≥{filterState.lengthMin}m
              <button
                type="button"
                onClick={() => setFilterState({ lengthMin: undefined })}
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filterState.structureType && filterState.structureType !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 font-semibold text-[11px]">
              Kết cấu: {filterState.structureType}
              <button
                type="button"
                onClick={() => setFilterState({ structureType: 'ALL' })}
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filterState.hasCrane !== null && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 font-semibold text-[11px]">
              {filterState.hasCrane ? 'Có Cẩu Trục' : 'Không Cẩu'}
              <button
                type="button"
                onClick={() => setFilterState({ hasCrane: null })}
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filterState.stockStatus !== 'ALL' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 font-semibold text-[11px]">
              {filterState.stockStatus === 'IN_STOCK' ? 'Còn hàng' : 'Hết hàng'}
              <button
                type="button"
                onClick={() => setFilterState({ stockStatus: 'ALL' })}
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Nút Xóa Hết viền đỏ nổi bật */}
          <button
            type="button"
            onClick={handleResetSearch}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-red-500 bg-red-50/90 hover:bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-300 dark:border-red-500 font-extrabold text-xs shadow-xs active:scale-95 transition-all ml-auto cursor-pointer"
            title="Bấm để xóa toàn bộ các bộ lọc đang chọn"
          >
            <RotateCcw className="w-3.5 h-3.5 stroke-[2.5] text-red-600 dark:text-red-400" />
            <span>Xóa hết</span>
          </button>
        </div>
      )}

      {/* 4. FEED HEADER: COUNT & SORTING */}
      <div ref={feedRef} className="flex items-center justify-between border-b border-slate-200/80 pb-2.5 dark:border-slate-800 scroll-mt-20">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
            Danh Sách Bài Đăng
          </span>
          <span className="rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 px-2.5 py-0.5 text-xs font-black">
            {filteredProperties.length} mặt hàng
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Sort Selector */}
          <select
            value={filterState.sortBy}
            onChange={(e) => setFilterState({ sortBy: e.target.value as any })}
            className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="newest">Tin mới nhất trước</option>
            <option value="price-asc">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
          </select>
        </div>
      </div>

      {/* 5. MAIN POSTS FEED (Fast responsive grid) */}
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900 space-y-3">
          <Warehouse className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Không tìm thấy bài đăng nào phù hợp
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Vui lòng thử nới rộng phạm vi tìm kiếm kích thước, chọn khu vực khác hoặc nhấn nút xóa bộ lọc bên dưới để xem toàn bộ danh mục sản phẩm.
          </p>
          <button
            type="button"
            onClick={handleResetSearch}
            className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 transition shadow"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Xóa Tất Cả Bộ Lọc & Xem Hàng Mới Nhất</span>
          </button>
        </div>
      )}

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
