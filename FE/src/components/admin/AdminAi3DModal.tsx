import { useState } from 'react'
import { Sparkles, Bot, Box, X, ExternalLink, Copy, Check, Warehouse, ArrowRight, Loader2, RefreshCw } from 'lucide-react'
import { propertyApi } from '@/api/propertyApi'
import { ENV } from '@/config/env.config'
import { cn } from '@/utils/cn'

interface AdminAi3DModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectModelUrl?: (url: string, title?: string) => void
}

export function AdminAi3DModal({ isOpen, onClose, onSelectModelUrl }: AdminAi3DModalProps) {
  const [prompt, setPrompt] = useState('')
  const [width, setWidth] = useState<number | ''>(24)
  const [length, setLength] = useState<number | ''>(84)
  const [height, setHeight] = useState<number | ''>(9)
  const [structureType, setStructureType] = useState('Kèo Zamil')
  const [hasCrane, setHasCrane] = useState(true)
  const [craneCapacity, setCraneCapacity] = useState('10 Tấn')

  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    fileName: string
    model3dUrl: string
    title: string
    specsSummary: string
  } | null>(null)

  const [copied, setCopied] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  if (!isOpen) return null

  const handleQuickPreset = (w: number, l: number, h: number, st: string, crane: boolean, cap: string, pText: string) => {
    setWidth(w)
    setLength(l)
    setHeight(h)
    setStructureType(st)
    setHasCrane(crane)
    setCraneCapacity(cap)
    setPrompt(pText)
  }

  const handleGenerate = async () => {
    setIsLoading(true)
    setErrorMsg('')
    try {
      const res = await propertyApi.generate3DModel({
        prompt: prompt.trim() || undefined,
        width: width ? Number(width) : 24,
        length: length ? Number(length) : 84,
        height: height ? Number(height) : 9,
        structureType,
        hasCrane,
        craneCapacity: hasCrane ? craneCapacity : undefined,
      })

      if (res && res.success) {
        setResult({
          fileName: res.fileName,
          model3dUrl: res.model3dUrl,
          title: res.title,
          specsSummary: res.specsSummary,
        })
      } else {
        setErrorMsg(res?.message || 'Không thể tạo mô hình 3D. Vui lòng thử lại.')
      }
    } catch (err: any) {
      console.error('Lỗi gen 3D:', err)
      setErrorMsg(err.message || 'Lỗi kết nối máy chủ Gemini AI.')
    } finally {
      setIsLoading(false)
    }
  }

  const getFullUrl = (relativeUrl: string) => {
    if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) return relativeUrl
    const base = ENV.API_BASE_URL.replace(/\/api\/?$/, '').replace(/\/+$/, '')
    return `${base}${relativeUrl}`
  }

  const handleCopyLink = () => {
    if (!result) return
    const full = getFullUrl(result.model3dUrl)
    navigator.clipboard.writeText(full)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleApply = () => {
    if (result && onSelectModelUrl) {
      onSelectModelUrl(result.model3dUrl, result.title)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white p-5 sm:p-7 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-md shadow-orange-500/20">
              <Bot className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Gemini AI Dựng Mô Hình 3D Nhà Xưởng</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
                  24/7 Trên Mobile
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tự động tính toán kết cấu Zamil, xuất file HTML 3D xoay 360° tương tác ngay trên điện thoại
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets */}
        <div>
          <span className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
            Chọn nhanh kích thước nhà xưởng mẫu:
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() =>
                handleQuickPreset(
                  24,
                  84,
                  9,
                  'Kèo Zamil',
                  true,
                  '10 Tấn',
                  'Xưởng Zamil 24m x 84m (2.016 m²) dầm cẩu trục 10T chạy suốt'
                )
              }
              className="text-xs px-2.5 py-1 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800/60 font-semibold hover:scale-102 transition"
            >
              🏭 Zamil 24x84m (Cẩu 10T)
            </button>

            <button
              type="button"
              onClick={() =>
                handleQuickPreset(
                  30,
                  60,
                  8.5,
                  'Thép I Tiêu Chuẩn',
                  true,
                  '5 Tấn',
                  'Khung nhà xưởng thép I 30m x 60m (1.800 m²) cẩu trục 5 tấn'
                )
              }
              className="text-xs px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 font-semibold hover:scale-102 transition"
            >
              🏗️ Thép I 30x60m (Cẩu 5T)
            </button>

            <button
              type="button"
              onClick={() =>
                handleQuickPreset(
                  40,
                  100,
                  10,
                  'Kèo Zamil',
                  true,
                  '15 Tấn',
                  'Tổng kho Logistics 40m x 100m (4.000 m²) vượt nhịp cẩu 15T'
                )
              }
              className="text-xs px-2.5 py-1 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60 font-semibold hover:scale-102 transition"
            >
              🏢 Logistics 40x100m (Cẩu 15T)
            </button>

            <button
              type="button"
              onClick={() =>
                handleQuickPreset(
                  18,
                  45,
                  7.5,
                  'Kèo Tiệp Tam Giác',
                  false,
                  '',
                  'Xưởng may 18m x 45m kèo tiệp thông thoáng không cẩu'
                )
              }
              className="text-xs px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold hover:scale-102 transition"
            >
              🏬 Xưởng May 18x45m
            </button>
          </div>
        </div>

        {/* Prompt Input */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Yêu cầu mô tả bằng ngôn ngữ tự nhiên (hoặc chỉnh sửa số bên dưới):
          </label>
          <div className="relative">
            <textarea
              rows={2}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="VD: Dựng nhà xưởng Zamil 30m x 60m có cẩu trục 5 tấn, 2 tầng giằng ống phi 114..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        {/* Parameters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
              Chiều Rộng (m)
            </label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value ? Number(e.target.value) : '')}
              className="w-full rounded-xl border border-slate-200 bg-white p-2 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white font-bold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
              Chiều Dài (m)
            </label>
            <input
              type="number"
              value={length}
              onChange={(e) => setLength(e.target.value ? Number(e.target.value) : '')}
              className="w-full rounded-xl border border-slate-200 bg-white p-2 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white font-bold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
              Cao Giọt Nước (m)
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value ? Number(e.target.value) : '')}
              className="w-full rounded-xl border border-slate-200 bg-white p-2 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white font-bold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
              Cẩu Trục
            </label>
            <select
              value={hasCrane ? craneCapacity : 'NO'}
              onChange={(e) => {
                if (e.target.value === 'NO') {
                  setHasCrane(false)
                } else {
                  setHasCrane(true)
                  setCraneCapacity(e.target.value)
                }
              }}
              className="w-full rounded-xl border border-slate-200 bg-white p-2 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white font-bold"
            >
              <option value="NO">❌ Không cẩu</option>
              <option value="5 Tấn">🏗️ Cẩu 5 Tấn</option>
              <option value="10 Tấn">🏗️ Cẩu 10 Tấn</option>
              <option value="15 Tấn">🏗️ Cẩu 15 Tấn</option>
              <option value="20 Tấn">🏗️ Cẩu 20 Tấn</option>
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold text-white transition shadow-lg cursor-pointer border',
              isLoading
                ? 'bg-slate-500 cursor-not-allowed border-transparent'
                : 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 shadow-orange-500/20 active:scale-98 border-orange-400/30'
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Gemini AI đang tính toán kết cấu & sinh mã 3D...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Khởi Chạy Gemini AI Dựng Mô Hình 3D Ngay</span>
              </>
            )}
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 text-xs border border-red-200 dark:border-red-800">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Result 3D Viewer */}
        {result && (
          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800/60">
              <div>
                <h4 className="text-xs sm:text-sm font-black text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                  <span>✅ {result.title}</span>
                </h4>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                  {result.specsSummary}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:scale-102 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Đã chép link!' : 'Chép link 3D'}</span>
                </button>

                <a
                  href={getFullUrl(result.model3dUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Mở toàn màn hình</span>
                </a>
              </div>
            </div>

            {/* Embedded Interactive 3D Iframe */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-orange-400/40 shadow-inner bg-slate-950">
              <iframe
                src={getFullUrl(result.model3dUrl)}
                title={result.title}
                className="w-full h-full border-0"
                allow="fullscreen; accelerometer; gyroscope"
              />
            </div>

            {/* Action buttons */}
            {onSelectModelUrl && (
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleApply}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-teal-600/20 active:scale-95 transition"
                >
                  <span>Gán mô hình 3D này vào bài đăng mới</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
