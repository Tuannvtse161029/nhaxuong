import { useState } from 'react'
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
  } = useProperties()

  const [show3DFilter, setShow3DFilter] = useState(false)

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

  const is3DCategorySelected = filterState.type === 'THIET_KE_3D'

  return (
    <div className="space-y-4 pb-12">
      {/* 1. COMPACT TOP HEADER & QUICK SEARCH BAR (Optimized for Mobile) */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 p-3 sm:p-5 text-white shadow-lg border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h1 className="text-lg sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Sàn Giao Dịch Khung Xưởng & Sắt Thép</span>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-teal-500/20 border border-teal-400/30 px-2 py-0.5 text-[10px] font-bold text-teal-300">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
                Hàng Mới Về
              </span>
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Khung Zamil, Thép hình I, Tôn sàn, Ống PCCC & Mô hình 3D kết cấu tại Bình Dương, Lâm Đồng, Đồng Nai
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Hotline */}
            <a
              href="tel:0901234567"
              className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-3 py-1.5 text-xs font-bold text-white shadow hover:bg-teal-500 transition"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Hotline: 090 123 4567</span>
            </a>
          </div>
        </div>

        {/* Quick Search & Location Dropdown Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
          {/* Keyword Search */}
          <div className="sm:col-span-6 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm khung xưởng, thép I 200, I 300, I 500, tôn..."
              value={filterState.keyword}
              onChange={(e) => setFilterState({ keyword: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/90 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Location Dropdown */}
          <div className="sm:col-span-4 relative">
            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-teal-400" />
            <select
              value={filterState.district || 'ALL'}
              onChange={(e) => setFilterState({ district: e.target.value })}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/90 py-2 pl-9 pr-8 text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none cursor-pointer"
            >
              {DISTRICTS_LIST.map((dist) => (
                <option key={dist} value={dist === 'Tất cả khu vực' ? 'ALL' : dist} className="bg-slate-900 text-white">
                  📍 {dist}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-3 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Stock Toggle Button */}
          <div className="sm:col-span-2 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() =>
                setFilterState({
                  stockStatus: filterState.stockStatus === 'IN_STOCK' ? 'ALL' : 'IN_STOCK',
                })
              }
              className={cn(
                'w-full py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition border',
                filterState.stockStatus === 'IN_STOCK'
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow'
                  : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:bg-slate-750'
              )}
            >
              <span className="h-2 w-2 rounded-[2px] bg-emerald-400" />
              <span>Còn Hàng</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. HORIZONTAL CATEGORY PILLS (Smooth Touch-Scrollable on Mobile) */}
      <div className="relative">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none no-scrollbar select-none">
          {/* 'All' / 'Tin Mới Nhất' Pill */}
          <button
            type="button"
            onClick={() => setFilterState({ type: 'ALL', categoryId: undefined })}
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
                  setFilterState({ type: cat.code })
                  if (cat.code === 'THIET_KE_3D') {
                    setShow3DFilter(true)
                  }
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

      {/* 3. DEDICATED 3D BLUEPRINT & STRUCTURAL SEARCH BAR (Mobile-friendly Length & Width + Structure type + Crane) */}
      {(is3DCategorySelected || show3DFilter) && (
        <div className="rounded-2xl border-2 border-cyan-500/30 bg-cyan-950/20 p-3.5 sm:p-5 dark:bg-cyan-950/40 space-y-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500 text-slate-950 font-black text-xs">
                3D
              </span>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-cyan-950 dark:text-cyan-200">
                  Bộ Lọc Kích Thước & Kết Cấu Nhà Xưởng (Mô Hình 3D & Bản Vẽ)
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Nhập chiều rộng & chiều dài (mét) hoặc chọn kết cấu Zamil, Thép I, Kèo Tiệp
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setFilterState({
                  lengthMin: undefined,
                  lengthMax: undefined,
                  widthMin: undefined,
                  widthMax: undefined,
                  structureType: 'ALL',
                  hasCrane: null,
                })
              }}
              className="text-[11px] font-semibold text-slate-500 hover:text-cyan-600 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Xóa lọc 3D</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Length (Chiều Dài) & Width (Chiều Rộng) Inputs */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Chiều Rộng (m)
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    placeholder="VD: 24"
                    value={filterState.widthMin || ''}
                    onChange={(e) =>
                      setFilterState({
                        widthMin: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <span className="text-xs font-bold text-slate-400">m</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Chiều Dài (m)
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    placeholder="VD: 84"
                    value={filterState.lengthMin || ''}
                    onChange={(e) =>
                      setFilterState({
                        lengthMin: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 bg-white p-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <span className="text-xs font-bold text-slate-400">m</span>
                </div>
              </div>
            </div>

            {/* Structure Type Selection (Thép I, Zamil, Kèo Tiệp) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Loại Kết Cấu
              </label>
              <div className="flex flex-wrap gap-1">
                {['ALL', 'Thép I', 'Zamil', 'Kèo Tiệp'].map((st) => {
                  const active =
                    st === 'ALL'
                      ? !filterState.structureType || filterState.structureType === 'ALL'
                      : filterState.structureType === st
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setFilterState({ structureType: st })}
                      className={cn(
                        'rounded-lg px-2.5 py-1 text-[11px] font-bold transition border',
                        active
                          ? 'bg-cyan-600 text-white border-cyan-500 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                      )}
                    >
                      {st === 'ALL' ? 'Tất cả kết cấu' : st}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Crane Selection (Có Cẩu Trục / Không Có) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                Cẩu Trục Nhà Xưởng
              </label>
              <div className="flex items-center gap-1.5">
                {[
                  { label: 'Tất cả', val: null },
                  { label: 'Có Cẩu Trục', val: true },
                  { label: 'Không Cẩu', val: false },
                ].map((item) => {
                  const active = filterState.hasCrane === item.val
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setFilterState({ hasCrane: item.val })}
                      className={cn(
                        'flex-1 rounded-lg py-1 px-1.5 text-[11px] font-bold transition border text-center',
                        active
                          ? 'bg-cyan-600 text-white border-cyan-500 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                      )}
                    >
                      {item.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. FEED HEADER: COUNT & SORTING */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
            Danh Sách Bài Đăng Mới Nhất
          </span>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-black text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {filteredProperties.length} tin
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle 3D Filter Button if not in 3D category */}
          {!is3DCategorySelected && (
            <button
              type="button"
              onClick={() => setShow3DFilter(!show3DFilter)}
              className={cn(
                'inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-bold transition border',
                show3DFilter
                  ? 'bg-cyan-600 text-white border-cyan-500'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-cyan-400 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
              )}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-500" />
              <span className="hidden sm:inline">Lọc Kích Thước 3D</span>
            </button>
          )}

          {/* Sort Selector */}
          <select
            value={filterState.sortBy}
            onChange={(e) => setFilterState({ sortBy: e.target.value as any })}
            className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 focus:outline-none"
          >
            <option value="newest">Mới nhất trước</option>
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
            Vui lòng thử nới rộng phạm vi tìm kiếm kích thước, chọn khu vực khác hoặc xóa bộ lọc để xem toàn bộ danh mục sản phẩm.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700 transition shadow"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Xóa Tất Cả Bộ Lọc</span>
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
