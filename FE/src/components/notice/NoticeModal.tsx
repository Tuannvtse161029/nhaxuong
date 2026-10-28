import { X, Megaphone, Calendar } from 'lucide-react'
import { useProperties } from '@/context/PropertyContext'

interface NoticeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NoticeModal({ isOpen, onClose }: NoticeModalProps) {
  const { notices } = useProperties()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4 bg-slate-50/70 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Thông Báo & Quy Hoạch KCN
              </h3>
              <p className="text-[11px] text-slate-400">Cập nhật tin tức quy hoạch và chính sách ưu đãi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notices List */}
        <div className="max-h-[60vh] overflow-y-auto p-6 space-y-4">
          {notices.map((n) => (
            <div
              key={n.id}
              className="p-4 rounded-2xl border border-slate-100 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-800/40 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-[10px] font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                  {n.badge}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                  <Calendar className="w-3 h-3" />
                  {n.createdAt}
                </span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">{n.title}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {n.content}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 dark:border-slate-800 px-6 py-3.5 bg-slate-50 dark:bg-slate-950/40 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-700 transition"
          >
            Đã hiểu & Đóng
          </button>
        </div>
      </div>
    </div>
  )
}
