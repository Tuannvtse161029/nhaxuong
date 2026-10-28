import { useState, useEffect } from 'react'
import { Megaphone, Bell, User, ShieldCheck } from 'lucide-react'
import { useProperties } from '@/context/PropertyContext'
import { cn } from '@/utils/cn'

export function NoticeTickerBar() {
  const { activeNoticeText, role, setRole, openNoticeModal } = useProperties()
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
    <div className="sticky top-0 z-50 bg-slate-950 text-slate-300 px-4 py-2 border-b border-slate-800/80 text-xs shadow-xs">
      <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Running Notice Ticker */}
        <div className="flex items-center gap-2.5 overflow-hidden w-full sm:w-auto">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20 shrink-0 uppercase tracking-wider">
            <Megaphone className="w-3.5 h-3.5 text-amber-400" />
            <span>Quy Hoạch KCN</span>
          </span>
          <div
            onClick={openNoticeModal}
            className="truncate font-normal text-slate-300 hover:text-white cursor-pointer transition"
            title="Bấm để xem chi tiết thông báo"
          >
            {activeNoticeText}
          </div>
        </div>

        {/* Quick Controls: Clock & Discrete Role Switcher */}
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
          <span className="font-mono text-slate-400 text-xs hidden md:inline-block">
            {clock}
          </span>

          <span className="text-slate-700 hidden md:inline">•</span>

          {/* DISCRETE ROLE SWITCHER PILL */}
          <div className="bg-slate-900 p-0.5 rounded-lg border border-slate-800 flex items-center text-xs">
            <button
              type="button"
              onClick={() => setRole('user')}
              className={cn(
                'px-2.5 py-1 rounded-md font-medium text-xs transition flex items-center gap-1.5',
                role === 'user'
                  ? 'bg-slate-800 text-teal-300 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              <User className="w-3 h-3" />
              <span>Khách Hàng</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={cn(
                'px-2.5 py-1 rounded-md font-medium text-xs transition flex items-center gap-1.5',
                role === 'admin'
                  ? 'bg-slate-800 text-amber-300 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Quản Trị</span>
            </button>
          </div>

          <button
            type="button"
            onClick={openNoticeModal}
            className="text-xs text-slate-400 hover:text-white p-1 transition"
            title="Xem danh sách thông báo"
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
