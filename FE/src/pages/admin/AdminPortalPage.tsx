import { useState } from 'react'
import {
  Boxes,
  Tags,
  Send,
  Users,
  Megaphone,
  Plus,
  Search,
  Edit2,
  Trash2,
  Box,
  Coins,
  Warehouse,
  Film,
  Headphones,
  CheckCircle,
  Clock,
  Sparkles,
  Mail,
} from 'lucide-react'
import { useProperties } from '@/context/PropertyContext'
import { AdminPropertyModal } from '@/components/admin/AdminPropertyModal'
import { formatCurrency } from '@/utils/formatters'
import { cn } from '@/utils/cn'

type AdminSubTab = 'crud' | 'categories' | 'publish' | 'subscribers' | 'notices'

export function AdminPortalPage() {
  const {
    properties,
    categories,
    subscribers,
    notices,
    deleteProperty,
    addCategory,
    deleteCategory,
    addNotice,
    deleteNotice,
    activeNoticeText,
    setActiveNoticeText,
    openAdminEditModal,
    activeModal,
    selectedProperty,
    closeModal,
    open3DModal,
    setRole,
  } = useProperties()

  const [activeSubTab, setActiveSubTab] = useState<AdminSubTab>('crud')
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')

  // Category form state
  const [newCatName, setNewCatName] = useState('')

  // Notice form state
  const [newNoticeTitle, setNewNoticeTitle] = useState('')
  const [newNoticeContent, setNewNoticeContent] = useState('')
  const [newNoticeBadge, setNewNoticeBadge] = useState('Thông Báo')

  // Calculate statistics
  const totalListedValue = properties.reduce((acc, cur) => acc + (cur.price || 0), 0)
  const totalWithVideo = properties.filter((p) => p.videoUrl).length

  // Filtered properties for Admin table
  const adminFilteredProps = properties.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.kcn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.province.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCat = categoryFilter === 'ALL' || p.type === categoryFilter
    return matchSearch && matchCat
  })

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCatName.trim()) return
    const generatedCode = 'CAT_' + Date.now().toString(36).toUpperCase()
    addCategory({
      name: newCatName.trim(),
      code: generatedCode,
      icon: 'Warehouse',
      desc: 'Danh mục tùy chỉnh',
      active: true,
    })
    setNewCatName('')
  }

  const handleAddNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNoticeTitle.trim()) return
    addNotice({
      title: newNoticeTitle.trim(),
      content: newNoticeContent.trim(),
      badge: newNoticeBadge.trim(),
      active: true,
    })
    setNewNoticeTitle('')
    setNewNoticeContent('')
  }

  return (
    <div className="space-y-6">
      {/* Admin Alert Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            Bạn đang ở chế độ <b>Quản Trị Viên (Admin)</b>. Khi thêm, chỉnh sửa hoặc xuất bản bài
            viết mới, hệ thống sẽ tự động kích hoạt <b>Email Broadcast Real-time</b> gửi bản tin đến các nhà đầu tư.
          </span>
        </div>
        <button
          onClick={() => setRole('user')}
          className="rounded-xl bg-amber-200 px-3.5 py-1.5 font-bold text-amber-900 hover:bg-amber-300 dark:bg-amber-900 dark:text-amber-100 dark:hover:bg-amber-800 transition shrink-0"
        >
          Trở Về Chế Độ Khách Hàng
        </button>
      </div>

      {/* 3 Stat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-bold text-slate-400 block uppercase">Tổng Kho Xưởng</span>
          <div className="flex items-center justify-between mt-1">
            <b className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {properties.length}
            </b>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300 text-sm">
              <Warehouse className="w-4 h-4" />
            </span>
          </div>
          <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold block mt-1">
            Đang niêm yết trên Web
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-bold text-slate-400 block uppercase">Tổng Giá Trị Niêm Yết</span>
          <div className="flex items-center justify-between mt-1">
            <b className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {formatCurrency(totalListedValue)}
            </b>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300 text-sm">
              <Coins className="w-4 h-4" />
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">Toàn bộ danh mục</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-bold text-slate-400 block uppercase">Video Drone Tự Phát</span>
          <div className="flex items-center justify-between mt-1">
            <b className="text-xl sm:text-2xl font-black text-amber-500">
              {totalWithVideo} / {properties.length}
            </b>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-500 dark:bg-amber-950 dark:text-amber-300 text-sm">
              <Film className="w-4 h-4" />
            </span>
          </div>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold block mt-1">
            100% video HD 1080p
          </span>
        </div>
      </div>

      {/* Admin Navigation Pills Strip */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        {[
          { id: 'crud' as const, label: 'Nhà Xưởng (CRUD)', icon: Boxes },
          { id: 'categories' as const, label: 'Quản Lý Danh Mục', icon: Tags },
          { id: 'publish' as const, label: 'Đăng Bài & Bắn Email Newsletter', icon: Send },
          { id: 'subscribers' as const, label: 'Subscribers & Hotline Leads', icon: Users },
          { id: 'notices' as const, label: 'Thông Báo Trang Chủ', icon: Megaphone },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeSubTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={cn(
                'flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition',
                isActive
                  ? 'bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* TAB 1: CRUD PROPERTIES */}
      {activeSubTab === 'crud' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Boxes className="w-5 h-5 text-teal-600" />
                Quản Lý Mặt Hàng Nhà Xưởng (CRUD)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Thêm mới, sửa chi tiết giá, diện tích, video flycam và hình ảnh thực tế.
              </p>
            </div>
            <button
              onClick={() => openAdminEditModal()}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-teal-800 transition shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm & Xuất Bản Xưởng Mới</span>
            </button>
          </div>

          {/* Table Search & Filter */}
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50/70 border-b border-slate-200 dark:border-slate-800 dark:bg-slate-950/50">
              <div className="relative flex-1 max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm theo tên xưởng, KCN, tỉnh thành..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <option value="ALL">Tất cả danh mục</option>
                  {!categories.some((c) => c.code === 'RECYCLED_STEEL') && (
                    <option value="RECYCLED_STEEL">Sắt Thép Tái Sử Dụng</option>
                  )}
                  {categories.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <span className="text-xs text-slate-400 font-medium">
                  Hiển thị: <b>{adminFilteredProps.length}</b> mặt hàng
                </span>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px] dark:bg-slate-950 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Ảnh</th>
                    <th className="py-3 px-4">Tiêu Đề</th>
                    <th className="py-3 px-4">Phân Loại</th>
                    <th className="py-3 px-4">Vị Trí KCN</th>
                    <th className="py-3 px-4">Diện Tích</th>
                    <th className="py-3 px-4">Giá Niêm Yết</th>
                    <th className="py-3 px-4">Video & Audio</th>
                    <th className="py-3 px-4 text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {adminFilteredProps.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition"
                    >
                      <td className="py-3 px-4">
                        <div className="relative h-10 w-14 rounded-lg overflow-hidden bg-slate-900 shadow-xs">
                          <img src={p.image} alt={p.title} className="h-full w-full object-cover" />
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800 dark:text-white max-w-xs">
                        <p className="line-clamp-1">{p.title}</p>
                        <span className="text-[10px] font-mono text-slate-400 font-normal">
                          ID: {p.id}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          {p.typeDisplay}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {p.kcn}, {p.province}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                        {p.area}
                      </td>
                      <td className="py-3 px-4 font-bold text-teal-700 dark:text-teal-400 whitespace-nowrap">
                        {p.priceDisplay}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          {p.videoUrl && (
                            <span
                              className="rounded bg-blue-50 text-blue-700 px-1.5 py-0.5 text-[10px] font-semibold dark:bg-blue-950 dark:text-blue-300"
                              title="Có video flycam"
                            >
                              MP4
                            </span>
                          )}
                          {p.audioUrl && (
                            <span
                              className="rounded bg-teal-50 text-teal-700 px-1.5 py-0.5 text-[10px] font-semibold dark:bg-teal-950 dark:text-teal-300"
                              title="Có âm thanh thuyết minh"
                            >
                              MP3
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openAdminEditModal(p)}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition"
                            title="Sửa"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => open3DModal(p)}
                            className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950 transition"
                            title="Xem mô hình 3D"
                          >
                            <Box className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Bạn có chắc chắn muốn xóa mặt hàng "${p.title}"?`)) {
                                deleteProperty(p.id)
                              }
                            }}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CATEGORIES */}
      {activeSubTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4">
              Danh Sách Danh Mục Hiện Tại
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] dark:bg-slate-950 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Tên Danh Mục</th>
                    <th className="py-3 px-4 text-center">Số Lượng Mặt Hàng</th>
                    <th className="py-3 px-4 text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {categories.map((c) => {
                    const count = properties.filter((p) => p.type === c.code).length
                    return (
                      <tr key={c.code} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                          {c.name}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-teal-700 dark:text-teal-400">
                          {count} bài viết
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => deleteCategory(c.code)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded transition"
                            title="Xóa danh mục"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Category Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4">
              Thêm Danh Mục Mới
            </h3>
            <form onSubmit={handleAddCategorySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Tên danh mục
                </label>
                <input
                  type="text"
                  placeholder="VD: Kho Hóa Chất Tiêu Chuẩn"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-teal-700 transition dark:bg-teal-600"
              >
                Thêm Danh Mục
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: PUBLISH & REALTIME BROADCAST */}
      {activeSubTab === 'publish' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-teal-600" />
                Đăng Bài & Kích Hoạt Email Broadcast Real-time
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Quy trình tự động hóa: Khi bài viết được xuất bản, hệ thống sẽ tự động kích hoạt hàng đợi
                và gửi email bản tin đến các nhà đầu tư trong danh sách theo dõi.
              </p>
            </div>
            <button
              onClick={() => openAdminEditModal()}
              className="rounded-xl bg-teal-700 px-4 py-2 text-xs font-bold text-white hover:bg-teal-800 transition"
            >
              Mở Form Soạn Thảo & Đăng Ngay
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-teal-200 bg-teal-50/60 p-5 dark:border-teal-900/60 dark:bg-teal-950/30 space-y-3">
              <h4 className="font-bold text-sm text-teal-900 dark:text-teal-300 flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-600" />
                Cơ Chế Email Broadcast Queue (Backend Architecture)
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                1. <b>Event Trigger:</b> Admin click xuất bản bài đăng mới.<br />
                2. <b>Message Queue:</b> Hệ thống đẩy tác vụ gửi tin vào hàng đợi (Redis / RabbitMQ / Hangfire) xử lý bất đồng bộ tránh nghẽn API.<br />
                3. <b>Email Service:</b> Worker gửi email bản tin HTML kèm ảnh thumbnail, video drone và tệp audio thuyết minh trực quan.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5 dark:border-blue-900/60 dark:bg-blue-950/30 space-y-3">
              <h4 className="font-bold text-sm text-blue-900 dark:text-blue-300 flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-500" />
                Trạng Thái Broadcast Gần Nhất
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    Bán 12.000m2 Nhà Xưởng KCN VSIP 1
                  </span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Thành công ({subscribers.length + 3620} người)
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    Cho Thuê Kho Logistics 5.000m2 KCN Sóng Thần 2
                  </span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Thành công ({subscribers.length + 3620} người)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SUBSCRIBERS */}
      {activeSubTab === 'subscribers' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Danh Sách Nhà Đầu Tư Đang Theo Dõi ({subscribers.length + 3620})
              </h3>
              <p className="text-xs text-slate-400">
                Bao gồm người đăng ký nhận tin qua Email Newsletter và Hotline
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] dark:bg-slate-950 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Tên Nhà Đầu Tư / Doanh Nghiệp</th>
                  <th className="py-3 px-4">Kênh Đăng Ký</th>
                  <th className="py-3 px-4">Liên Hệ (Email / Phone)</th>
                  <th className="py-3 px-4">Thời Gian</th>
                  <th className="py-3 px-4">Trạng Thái Giao Nhận</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {subscribers.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                      {s.name}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                          s.channel === 'hotline'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                        }`}
                      >
                        {s.channel}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                      {s.email || s.phone}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">{s.time}</td>
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle className="w-3.5 h-3.5" />
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: NOTICES & TICKER */}
      {activeSubTab === 'notices' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Ticker bar editor */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-amber-500" />
                Nội Dung Chữ Chạy Notice Ticker Bar (Dưới Header)
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={activeNoticeText}
                  onChange={(e) => setActiveNoticeText(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Nội dung này được hiển thị cố định ngay đầu trang cho tất cả khách hàng truy cập.
              </p>
            </div>

            {/* Notices List */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Bảng Thông Báo & Sự Kiện (Modal Popup)
              </h3>
              <div className="space-y-3">
                {notices.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-start justify-between gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="rounded bg-teal-100 text-teal-800 px-2 py-0.5 text-[10px] font-bold dark:bg-teal-950 dark:text-teal-300">
                          {n.badge}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" /> {n.createdAt}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">{n.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{n.content}</p>
                    </div>

                    <button
                      onClick={() => deleteNotice(n.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded transition"
                      title="Gỡ thông báo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Add Notice Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4">
              Thêm Thông Báo Mới
            </h3>
            <form onSubmit={handleAddNoticeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Nhãn / Badge
                </label>
                <input
                  type="text"
                  placeholder="VD: Quy Hoạch KCN"
                  value={newNoticeBadge}
                  onChange={(e) => setNewNoticeBadge(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Tiêu đề thông báo
                </label>
                <input
                  type="text"
                  placeholder="VD: Cập nhật đơn giá thuê đất KCN Quý 4..."
                  value={newNoticeTitle}
                  onChange={(e) => setNewNoticeTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Nội dung chi tiết
                </label>
                <textarea
                  rows={3}
                  placeholder="Mô tả chính sách hoặc sự kiện..."
                  value={newNoticeContent}
                  onChange={(e) => setNewNoticeContent(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-teal-700 transition dark:bg-teal-600"
              >
                Đăng Thông Báo
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Global Admin Property Modal */}
      <AdminPropertyModal
        isOpen={activeModal === 'admin-edit'}
        onClose={closeModal}
        property={selectedProperty}
      />
    </div>
  )
}
