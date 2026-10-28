import { X, Heart, Box, ArrowRight } from 'lucide-react'
import { useProperties } from '@/context/PropertyContext'

interface SavedPropertiesModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SavedPropertiesModal({ isOpen, onClose }: SavedPropertiesModalProps) {
  const { properties, savedPropertyIds, toggleSaveProperty, openDetailModal, open3DModal } =
    useProperties()

  if (!isOpen) return null

  const savedProps = properties.filter((p) => savedPropertyIds.includes(p.id))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-xl rounded-3xl bg-white shadow-2xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4 bg-slate-50/70 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Nhà Xưởng Đã Lưu ({savedProps.length})
              </h3>
              <p className="text-[11px] text-slate-400">Danh sách các mặt bằng bạn đang theo dõi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto p-6 space-y-3">
          {savedProps.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Heart className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">Bạn chưa lưu nhà xưởng nào vào danh sách.</p>
              <p className="text-xs text-slate-500 mt-1">Bấm biểu tượng trái tim ở các thẻ bài viết để lưu lại.</p>
            </div>
          ) : (
            savedProps.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-2xl dark:bg-slate-800/40 dark:border-slate-800 gap-3"
              >
                <div className="flex items-center gap-3 overflow-hidden min-w-0">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="truncate">
                    <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                      {p.title}
                    </p>
                    <p className="text-xs text-teal-600 dark:text-teal-400 font-bold mt-0.5">
                      {p.priceDisplay} • <span className="text-slate-400 font-normal">{p.kcn}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      onClose()
                      open3DModal(p)
                    }}
                    className="px-2.5 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 hover:bg-amber-400 transition"
                    title="Mô hình 3D"
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">3D</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose()
                      openDetailModal(p)
                    }}
                    className="px-3 py-1.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-teal-700 transition flex items-center gap-1 dark:bg-teal-600"
                  >
                    <span>Xem</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => toggleSaveProperty(p.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition"
                    title="Bỏ lưu"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
