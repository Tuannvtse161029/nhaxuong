import { Search, MapPin, Factory, ArrowUpDown, Building, Boxes, Warehouse } from 'lucide-react'
import { useProperties } from '@/context/PropertyContext'
import { DualPriceRangeSlider } from './DualPriceRangeSlider'
import { PROVINCES_LIST, KCN_LIST } from '@/data/mockData'
import type { PropertyType, PropertyFilterState } from '@/types/property.types'
import { cn } from '@/utils/cn'

export function PropertyFilterBar() {
  const { filterState, setFilterState, resetFilters } = useProperties()

  const tabs: { type: PropertyType; label: string; icon: typeof Warehouse }[] = [
    { type: 'ALL', label: 'Tất Cả', icon: Boxes },
    { type: 'SALE', label: 'Bán Nhà Xưởng', icon: Warehouse },
    { type: 'RENT', label: 'Cho Thuê Kho Bãi', icon: Building },
    { type: 'KCN_PROJECT', label: 'Dự Án Đất KCN', icon: Factory },
  ]

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      {/* Tier 1: Category Segmented Tabs */}
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
                'flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all',
                isActive
                  ? 'bg-slate-900 text-white shadow-md dark:bg-teal-600'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Tier 2: Search Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* 1. Keyword search */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Từ khóa tìm kiếm
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="VD: Trạm điện, PCCC tự động..."
              value={filterState.keyword}
              onChange={(e) => setFilterState({ keyword: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 transition focus:border-slate-900 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-teal-500"
            />
          </div>
        </div>

        {/* 2. Province */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Tỉnh / Thành Phố
          </label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-red-500" />
            <select
              value={filterState.province}
              onChange={(e) => setFilterState({ province: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 transition focus:border-slate-900 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              {PROVINCES_LIST.map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 3. KCN */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Khu Công Nghiệp (KCN)
          </label>
          <div className="relative">
            <Factory className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-amber-500" />
            <select
              value={filterState.kcn}
              onChange={(e) => setFilterState({ kcn: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 transition focus:border-slate-900 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              {KCN_LIST.map((kcn) => (
                <option key={kcn} value={kcn}>
                  {kcn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4. Sort */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Sắp xếp theo
          </label>
          <div className="relative">
            <ArrowUpDown className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <select
              value={filterState.sortBy}
              onChange={(e) =>
                setFilterState({ sortBy: e.target.value as PropertyFilterState['sortBy'] })
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-900 transition focus:border-slate-900 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="newest">Mới nhất</option>
              <option value="price-asc">Giá: Thấp đến Cao</option>
              <option value="price-desc">Giá: Cao đến Thấp</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tier 3: Dual Price Range Slider */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
        <DualPriceRangeSlider
          minPrice={filterState.minPrice}
          maxPrice={filterState.maxPrice}
          onChange={(min, max) => setFilterState({ minPrice: min, maxPrice: max })}
          onReset={resetFilters}
        />
      </div>
    </div>
  )
}
