import { NoticeTickerBar } from '@/components/notice/NoticeTickerBar'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AuthModal } from '@/components/auth/AuthModal'
import { useProperties } from '@/context/PropertyContext'
import { HomePage } from '@/pages/HomePage'
import { AdminPortalPage } from '@/pages/admin/AdminPortalPage'
import { CheckCircle2, Mail, Info, X } from 'lucide-react'

export function MainLayout() {
  const { role, toasts, removeToast } = useProperties()

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 antialiased">
      {/* 1. Top Notice Ticker Bar */}
      <NoticeTickerBar />

      {/* 2. Header & Main Navigation */}
      <Header />

      {/* 3. Main View Switcher (User Portal vs Admin Portal) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {role === 'user' ? <HomePage /> : <AdminPortalPage />}
      </main>

      {/* 4. Footer */}
      <Footer />

      {/* 5. Fixed Toast Notifications Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl text-xs font-semibold text-white transition-all transform animate-in slide-in-from-bottom-5 duration-300 ${
              t.type === 'email'
                ? 'bg-teal-600 shadow-teal-500/25 border border-teal-400/40'
                : t.type === 'info'
                ? 'bg-slate-900 shadow-slate-900/30 border border-slate-700'
                : 'bg-emerald-600 shadow-emerald-500/25 border border-emerald-400/40'
            }`}
          >
            {t.type === 'email' ? (
              <Mail className="w-5 h-5 shrink-0 text-white" />
            ) : t.type === 'info' ? (
              <Info className="w-5 h-5 shrink-0 text-teal-400" />
            ) : (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-white" />
            )}

            <div
              className="flex-1 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: t.message }}
            />

            <button
              onClick={() => removeToast(t.id)}
              className="p-1 text-white/70 hover:text-white transition shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* 6. Global Authentication Modal (Google & Phone Auth) */}
      <AuthModal />
    </div>
  )
}
