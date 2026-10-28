export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© {new Date().getFullYear()} Nhà Xưởng Management. Sườn kiến trúc Front-End React chuẩn doanh nghiệp.</p>
        <div className="flex items-center gap-4 text-xs">
          <span className="hover:text-blue-600 transition-colors cursor-pointer">Tài liệu API</span>
          <span className="hover:text-blue-600 transition-colors cursor-pointer">Hỗ trợ kỹ thuật</span>
        </div>
      </div>
    </footer>
  )
}
