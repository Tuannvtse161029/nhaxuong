import { Sliders, RotateCcw } from 'lucide-react'
import { formatCurrency } from '@/utils/formatters'

interface DualPriceRangeSliderProps {
  minPrice: number
  maxPrice: number
  minLimit?: number
  maxLimit?: number
  step?: number
  onChange: (min: number, max: number) => void
  onReset: () => void
}

export function DualPriceRangeSlider({
  minPrice,
  maxPrice,
  minLimit = 0,
  maxLimit = 150000000000, // 150 Tỷ
  step = 500000000, // 500 Triệu step
  onChange,
  onReset,
}: DualPriceRangeSliderProps) {
  const minPercent = Math.min(
    100,
    Math.max(0, ((minPrice - minLimit) / (maxLimit - minLimit)) * 100)
  )
  const maxPercent = Math.min(
    100,
    Math.max(0, ((maxPrice - minLimit) / (maxLimit - minLimit)) * 100)
  )

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value), maxPrice - step)
    onChange(val, maxPrice)
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value), minPrice + step)
    onChange(minPrice, val)
  }

  const setPreset = (targetMax: number) => {
    onChange(0, targetMax)
  }

  return (
    <div className="space-y-3">
      {/* Label and Range Value display */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
            Khoảng ngân sách (Min - Max):
          </span>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
          <span className="text-teal-700 dark:text-teal-400 font-bold">
            {formatCurrency(minPrice)}
          </span>
          <span className="text-slate-400">→</span>
          <span className="text-teal-700 dark:text-teal-400 font-bold">
            {formatCurrency(maxPrice)}
          </span>
        </div>
      </div>

      {/* Dual Slider Track Container */}
      <div className="relative pt-3 pb-2">
        {/* Base Track */}
        <div className="relative h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
          {/* Active Highlight Track */}
          <div
            style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
            className="absolute h-2 rounded-full bg-teal-600 dark:bg-teal-500"
          />
        </div>

        {/* Min Thumb Input */}
        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          step={step}
          value={minPrice}
          onChange={handleMinChange}
          className="pointer-events-none absolute inset-x-0 -top-0.5 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-700 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing"
        />

        {/* Max Thumb Input */}
        <input
          type="range"
          min={minLimit}
          max={maxLimit}
          step={step}
          value={maxPrice}
          onChange={handleMaxChange}
          className="pointer-events-none absolute inset-x-0 -top-0.5 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-700 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing"
        />
      </div>

      {/* Min - Max Limit Legends */}
      <div className="flex justify-between text-[11px] font-medium text-slate-400">
        <span>{formatCurrency(minLimit)}</span>
        <span>{formatCurrency(maxLimit)}</span>
      </div>

      {/* Quick Price Preset Buttons & Reset */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] text-slate-400 font-medium">Chọn nhanh:</span>
          <button
            type="button"
            onClick={() => setPreset(5000000000)}
            className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition"
          >
            ≤ 5 Tỷ
          </button>
          <button
            type="button"
            onClick={() => setPreset(20000000000)}
            className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition"
          >
            ≤ 20 Tỷ
          </button>
          <button
            type="button"
            onClick={() => setPreset(50000000000)}
            className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition"
          >
            ≤ 50 Tỷ
          </button>
          <button
            type="button"
            onClick={() => setPreset(maxLimit)}
            className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition"
          >
            Tất Cả ({formatCurrency(maxLimit)})
          </button>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700 hover:underline dark:text-teal-400"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Đặt lại</span>
        </button>
      </div>
    </div>
  )
}
