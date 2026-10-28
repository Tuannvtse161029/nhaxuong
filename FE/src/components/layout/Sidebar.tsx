import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Boxes,
  Users,
  Settings,
  BarChart3,
  Factory,
  X,
} from 'lucide-react'
import { NAVIGATION_ITEMS, type NavItemConfig } from '@/config/navigation.config'
import { cn } from '@/utils/cn'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const getIcon = (iconName: NavItemConfig['iconName']) => {
    switch (iconName) {
      case 'LayoutDashboard':
        return <LayoutDashboard className="w-5 h-5" />
      case 'Boxes':
        return <Boxes className="w-5 h-5" />
      case 'BarChart3':
        return <BarChart3 className="w-5 h-5" />
      case 'Users':
        return <Users className="w-5 h-5" />
      case 'Settings':
        return <Settings className="w-5 h-5" />
      default:
        return <Boxes className="w-5 h-5" />
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out dark:border-slate-800 dark:bg-slate-900 md:static md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Factory className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white leading-tight">Nhà Xưởng</h2>
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium tracking-wider uppercase">
                Enterprise FE
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 md:hidden dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto p-4">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Menu Chính
          </div>
          {NAVIGATION_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 768) onClose()
              }}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                )
              }
            >
              <div className="flex items-center gap-3">
                {getIcon(item.iconName)}
                <span>{item.title}</span>
              </div>
              {item.badge && (
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer info */}
        <div className="border-t border-slate-200 p-4 text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
          <p className="font-medium text-slate-600 dark:text-slate-300">Phiên bản v1.0.0</p>
          <p className="mt-0.5">Sẵn sàng kết nối BE API</p>
        </div>
      </aside>
    </>
  )
}
