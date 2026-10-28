import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { BarChart3, TrendingUp, Download, Calendar } from 'lucide-react'
import { Button } from '@/components/common/Button'

export function ReportsPage() {
  const reports = [
    { name: 'Báo cáo hiệu suất năng lượng tháng 10/2026', size: '2.4 MB', date: '28/10/2026' },
    { name: 'Thống kê sự cố kỹ thuật Quý 3/2026', size: '1.1 MB', date: '01/10/2026' },
    { name: 'Chi phí bảo dưỡng & thay thế linh kiện năm 2026', size: '4.8 MB', date: '15/09/2026' },
    { name: 'Báo cáo kiểm toán an toàn nhà xưởng đợt 2', size: '3.2 MB', date: '20/08/2026' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Báo Cáo & Thống Kê
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Tổng hợp dữ liệu hiệu năng sản xuất, thời gian vận hành và chi phí.
          </p>
        </div>
        <Button leftIcon={<Calendar className="w-4 h-4" />} variant="outline">
          Chọn mốc thời gian
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Sản lượng ước tính theo tuần
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Visual Bar chart mock with Tailwind */}
            <div className="flex items-end justify-between h-48 pt-6 px-2 border-b border-slate-100 dark:border-slate-800">
              {[
                { day: 'T2', height: '65%', val: '650 sp' },
                { day: 'T3', height: '80%', val: '800 sp' },
                { day: 'T4', height: '95%', val: '950 sp' },
                { day: 'T5', height: '70%', val: '700 sp' },
                { day: 'T6', height: '88%', val: '880 sp' },
                { day: 'T7', height: '50%', val: '500 sp' },
                { day: 'CN', height: '20%', val: '200 sp' },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 group w-10">
                  <div className="relative w-full flex justify-center items-end h-36">
                    <div
                      style={{ height: item.height }}
                      className="w-7 bg-blue-500 hover:bg-blue-600 rounded-t-md transition-all group-hover:scale-105"
                      title={item.val}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-slate-400 mt-3">Đơn vị: Sản phẩm hoàn thành / ngày</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-500" />
              Tập tin báo cáo sẵn có
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {reports.map((r, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{r.name}</p>
                  <p className="text-xs text-slate-400">
                    {r.date} • {r.size}
                  </p>
                </div>
                <button
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors dark:hover:bg-blue-950/40"
                  title="Tải về"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
