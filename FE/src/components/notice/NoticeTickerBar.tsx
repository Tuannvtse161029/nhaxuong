import { useState, useEffect } from 'react'
import { Megaphone, Bell } from 'lucide-react'
import { useProperties } from '@/context/PropertyContext'

export function NoticeTickerBar() {
  const { activeNoticeText, openNoticeModal } = useProperties()
  const [clock, setClock] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setClock(now.toLocaleTimeString('vi-VN', { hour12: false }))
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="sticky top-0 z-50 w-full bg-slate-950 text-slate-300 px-3 sm:px-4 py-1.5 sm:py-2 border-b border-slate-800/80 text-xs shadow-xs overflow-x-hidden">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-2">
        {/* Running Notice Ticker */}
        <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9.5px] sm:text-[10px] font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20 shrink-0 uppercase tracking-wider">
            <Megaphone className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">Quy Hoạch KCN</span>
            <span className="sm:hidden">KCN</span>
          </span>
          <div
            onClick={openNoticeModal}
            className="truncate font-normal text-slate-300 hover:text-white cursor-pointer transition text-xs flex-1 min-w-0"
            title="Bấm để xem chi tiết thông báo"
          >
            {activeNoticeText}
          </div>
        </div>

        {/* Quick Controls: Clock & Bell Notification */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono text-slate-400 text-xs hidden md:inline-block">
            {clock}
          </span>

          <button
            type="button"
            onClick={openNoticeModal}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer shrink-0"
            title="Xem danh sách thông báo"
          >
            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            <span className="hidden sm:inline text-[11px]">Thông báo</span>
          </button>
        </div>
      </div>
    </div>
  )
}
