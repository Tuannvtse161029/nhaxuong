import { Search, MapPin, Factory, Building, Boxes, Warehouse, Filter, Sparkles, Check } from 'lucide-react'
import { useProperties } from '@/context/PropertyContext'
import { DualPriceRangeSlider } from './DualPriceRangeSlider'
import { PROVINCES_LIST, KCN_LIST } from '@/data/mockData'
import type { PropertyType } from '@/types/property.types'
import { cn } from '@/utils/cn'

export function PropertyFilterBar() {
  const { filterState, setFilterState, resetFilters } = useProperties()

  const tabs: { type: PropertyType; label: string; icon: typeof Warehouse; countBadge: string }[] = [
    { type: 'ALL', label: 'Tất Cả Kho Xưởng', icon: Boxes, countBadge: '2.500+' },
    { type: 'SALE', label: 'Bán Nhà Xưởng', icon: Warehouse, countBadge: '1.200+' },
    { type: 'RENT', label: 'Cho Thuê Kho Bãi', icon: Building, countBadge: '980+' },
  ]

  const quickFilterPills = [
    { label: 'PCCC Tự Động', keyword: 'PCCC' },
    { label: 'Trạm Điện ≥ 1.000 kVA', keyword: '1.000' },
    { label: 'Đường Xe Container 24/7', keyword: 'Container' },
    { label: 'Sổ Hồng SKC Hoàn Công', keyword: 'Sổ hồng' },
    { label: 'Trần Cao 11m (FDI)', keyword: '11m' },
    { label: 'Kho Logistics Có Dock Leveler', keyword: 'dock' },
  ]

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      {/* Tier 1: Category Segmented Tabs (Nhà Xưởng Tabs) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = filterState.type === tab.type
          return (
            <button
              key={tab.type}
              type="button"
              onClick={() => setFilterState({ type: tab.type })}
              className={cn(
                'flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold whitespace-nowrap transition-all',
                isActive
                  ? 'bg-teal-700 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span
                className={cn(
                  'rounded-md px-1.5 py-0.5 text-[10px] font-bold',
                  isActive
                    ? 'bg-teal-800 text-teal-200'
                    : 'bg-slate-200/80 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                )}
              >
                {tab.countBadge}
              </span>
            </button>
          )
        })}
      </div>

      {/* Tier 2: Search Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* 1. Keyword search */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Từ khóa tìm kiếm Nhà Xưởng
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="VD: Trạm 1500kVA, PCCC tự động, Dock..."
              value={filterState.keyword}
              onChange={(e) => setFilterState({ keyword: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs sm:text-sm text-slate-900 transition focus:border-teal-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-teal-500"
            />
          </div>
        </div>

        {/* 2. Province */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Tỉnh / Thành Phố Trọng Điểm
          </label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-red-500" />
            <select
              value={filterState.province}
              onChange={(e) => setFilterState({ province: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs sm:text-sm text-slate-900 transition focus:border-teal-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              {PROVINCES_LIST.map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 3. Bãi kho */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Bãi kho
          </label>
          <div className="relative">
            <Warehouse className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-teal-600" />
            <select
              value={filterState.kcn}
              onChange={(e) => setFilterState({ kcn: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs sm:text-sm text-slate-900 transition focus:border-teal-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              {KCN_LIST.map((kcn) => (
                <option key={kcn} value={kcn}>
                  {kcn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4. Sort By */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Sắp xếp bài đăng Nhà Xưởng
          </label>
          <div className="relative">
            <Filter className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-blue-500" />
            <select
              value={filterState.sortBy}
              onChange={(e) =>
                setFilterState({
                  sortBy: e.target.value as 'newest' | 'price-asc' | 'price-desc',
                })
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs sm:text-sm text-slate-900 transition focus:border-teal-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="newest">Mặt bằng mới nhất</option>
              <option value="price-asc">Giá thấp đến cao</option>
              <option value="price-desc">Giá cao đến thấp</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tier 3: Dual Price Range Slider Component */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
        <DualPriceRangeSlider
          minPrice={filterState.minPrice}
          maxPrice={filterState.maxPrice}
          onChange={(min, max) => setFilterState({ minPrice: min, maxPrice: max })}
          onReset={() => setFilterState({ minPrice: 0, maxPrice: 150000000000 })}
        />
      </div>

      {/* Tier 4: Quick Tag Pills (Nhà Xưởng Shortcuts) */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Tiêu chí nhanh:
        </span>
        {quickFilterPills.map((pill) => {
          const isSelected = filterState.keyword === pill.keyword
          return (
            <button
              key={pill.label}
              type="button"
              onClick={() => {
                if (isSelected) {
                  setFilterState({ keyword: '' })
                } else {
                  setFilterState({ keyword: pill.keyword })
                }
              }}
              className={cn(
                'rounded-lg px-2.5 py-1 text-[11px] font-semibold transition border',
                isSelected
                  ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
              )}
            >
              {isSelected ? '✓ ' : '+ '}
              {pill.label}
            </button>
          )
        })}

        <button
          type="button"
          onClick={resetFilters}
          className="ml-auto text-xs font-semibold text-slate-400 hover:text-red-500 transition cursor-pointer"
        >
          Đặt lại bộ lọc
        </button>
      </div>
    </div>
  )
}
