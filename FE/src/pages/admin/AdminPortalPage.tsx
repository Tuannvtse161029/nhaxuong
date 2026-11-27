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
  MapPin,
  ExternalLink,
} from 'lucide-react'
import { useProperties } from '@/context/PropertyContext'
import { AdminPropertyModal } from '@/components/admin/AdminPropertyModal'
import { AdminAi3DModal } from '@/components/admin/AdminAi3DModal'
import { formatCurrency } from '@/utils/formatters'
import { cn } from '@/utils/cn'

type AdminSubTab = 'crud' | 'categories' | 'publish' | 'subscribers' | 'notices' | 'ai3d'

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
    openAdminEditModal,
    activeModal,
    selectedProperty,
    closeModal,
    open3DModal,
    setRole,
  } = useProperties()

  const [activeSubTab, setActiveSubTab] = useState<AdminSubTab>('crud')
  const [showAi3DModal, setShowAi3DModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')

  // Category form state
  const [newCatName, setNewCatName] = useState('')
  const [newCatCode, setNewCatCode] = useState('')
  const [newCatDesc, setNewCatDesc] = useState('')

  // Notice form state
  const [newNoticeTitle, setNewNoticeTitle] = useState('')
  const [newNoticeContent, setNewNoticeContent] = useState('')
  const [newNoticeBadge, setNewNoticeBadge] = useState('Thông Báo')

  // Calculate statistics
  const totalListedValue = properties.reduce((acc, cur) => acc + (cur.price || 0), 0)
  const totalWith3D = properties.filter((p) => p.model3dUrl || p.model3DUrl).length

  // Filtered properties for Admin table
  const adminFilteredProps = properties.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.kcn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.district && p.district.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.province.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCat = categoryFilter === 'ALL' || p.type === categoryFilter
    return matchSearch && matchCat
  })

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCatName.trim()) return
    const generatedCode = newCatCode.trim()
      ? newCatCode.trim().toUpperCase()
      : 'CAT_' + Date.now().toString(36).toUpperCase()

    addCategory({
      name: newCatName.trim(),
      code: generatedCode,
      icon: 'Warehouse',
      desc: newCatDesc.trim() || 'Danh mục khung xưởng & sắt thép',
      active: true,
    })
    setNewCatName('')
    setNewCatCode('')
    setNewCatDesc('')
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-teal-500/30 bg-teal-950/20 p-4 text-xs text-teal-900 dark:border-teal-900/60 dark:bg-teal-950/40 dark:text-teal-200">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-teal-600 shrink-0" />
          <span>
            Đang quản trị với tài khoản <b>Quản Trị Viên (Admin)</b>. Bạn có toàn quyền quản lý danh mục,
            bài đăng, kích thước kết cấu 3D, vị trí địa lý và trạng thái 2 ô vuông Còn Hàng / Hết Hàng.
          </span>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="rounded-xl bg-teal-700 text-white px-3.5 py-1.5 font-bold hover:bg-teal-600 transition shrink-0 inline-flex items-center gap-1.5"
        >
          <span>Xem Sàn Ngoài Trang Chủ ↗</span>
        </a>
      </div>

      {/* 3 Stat Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-bold text-slate-400 block uppercase">Tổng Bài Đăng</span>
          <div className="flex items-center justify-between mt-1">
            <b className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {properties.length}
            </b>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300 text-sm">
              <Warehouse className="w-4 h-4" />
            </span>
          </div>
          <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold block mt-1">
            Đang niêm yết trên Sàn
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-bold text-slate-400 block uppercase">Danh Mục Hoạt Động</span>
          <div className="flex items-center justify-between mt-1">
            <b className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {categories.length}
            </b>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-sm">
              <Tags className="w-4 h-4" />
            </span>
          </div>
          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold block mt-1">
            {totalWith3D} bản vẽ & mô hình 3D
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="text-[11px] font-bold text-slate-400 block uppercase">Khách Đăng Ký Nhận Tin</span>
          <div className="flex items-center justify-between mt-1">
            <b className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {subscribers.length}
            </b>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 text-sm">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold block mt-1">
            Email & Hotline kết nối
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-200/80 pb-2 dark:border-slate-800 text-xs font-bold">
        {[
          { key: 'crud', label: 'Quản Lý Bài Đăng & 3D', icon: <Boxes className="w-4 h-4" /> },
          { key: 'ai3d', label: '🤖 Gemini AI Dựng 3D', icon: <Sparkles className="w-4 h-4 text-orange-400" /> },
          { key: 'categories', label: 'Quản Lý Danh Mục', icon: <Tags className="w-4 h-4" /> },
          { key: 'subscribers', label: 'Khách Đăng Ký Nhận Tin', icon: <Users className="w-4 h-4" /> },
          { key: 'notices', label: 'Bản Tin & Ticker', icon: <Megaphone className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              if (tab.key === 'ai3d') {
                setShowAi3DModal(true)
              } else {
                setActiveSubTab(tab.key as AdminSubTab)
              }
            }}
            className={cn(
              'flex items-center gap-2 rounded-xl px-4 py-2.5 transition whitespace-nowrap',
              activeSubTab === tab.key
                ? 'bg-slate-900 text-white dark:bg-teal-600 shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: POSTS & BLUEPRINTS MANAGEMENT */}
      {activeSubTab === 'crud' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm theo tiêu đề, vị trí, kích thước..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="ALL">Tất cả danh mục</option>
                {categories.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAi3DModal(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition shrink-0 cursor-pointer"
                title="Khởi chạy Gemini AI tự động tính toán kết cấu & sinh file HTML 3D"
              >
                <Sparkles className="w-4 h-4" />
                <span>🤖 AI Dựng Mô Hình 3D</span>
              </button>

              <button
                onClick={() => openAdminEditModal()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-teal-700 transition shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Đăng Bài / Bản Vẽ Mới</span>
              </button>
            </div>
          </div>

          {/* Posts Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800/80 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Bài Đăng / Hình Ảnh</th>
                  <th className="py-3 px-3">Danh Mục</th>
                  <th className="py-3 px-3">Vị Trí (Tỉnh / Huyện)</th>
                  <th className="py-3 px-3">Trạng Thái 2 Ô Vuông</th>
                  <th className="py-3 px-3">Kích Thước & Kết Cấu</th>
                  <th className="py-3 px-3">Giá Bán</th>
                  <th className="py-3 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {adminFilteredProps.map((p) => {
                  const isOut = p.stockStatus === 'OUT_OF_STOCK'
                  const isSite = p.storageLocation === 'AT_SITE'

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.title}
                            className="h-11 w-14 rounded-lg object-cover bg-slate-900 shrink-0"
                          />
                          <div className="max-w-xs">
                            <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1" title={p.title}>
                              {p.title}
                            </h4>
                            <p className="text-[11px] text-slate-400 mt-0.5 truncate">{p.kcn}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="rounded-md bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                          {p.typeDisplay || p.type}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="text-slate-700 dark:text-slate-300 font-medium">
                          <span>{p.district ? `${p.district}, ` : ''}{p.city || p.province}</span>
                        </div>
                      </td>

                      {/* 2 Square Status Indicator */}
                      <td className="py-3 px-3">
                        {isOut ? (
                          <div className="inline-flex items-center gap-1 rounded-md bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10.5px] font-black text-rose-700 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300">
                            <span className="h-2 w-2 rounded-[2px] bg-rose-500" />
                            <span className="h-2 w-2 rounded-[2px] bg-rose-500" />
                            <span className="ml-0.5">Hết hàng</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10.5px] font-black text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-300">
                            <span className="h-2 w-2 rounded-[2px] bg-emerald-500 animate-pulse" />
                            <span className="h-2 w-2 rounded-[2px] bg-emerald-500" />
                            <span className="ml-0.5">Còn hàng ({isSite ? 'Công trình' : 'Bãi'})</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <div className="text-slate-600 dark:text-slate-300">
                          <b>{p.length && p.width ? `${p.width}m x ${p.length}m` : p.area}</b>
                          <div className="text-[10.5px] text-slate-400">
                            {p.structureType || 'Kết cấu chuẩn'} • {p.hasCrane ? 'Có cẩu trục' : 'Không cẩu'}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 font-bold text-red-600 dark:text-red-400">
                        {p.priceDisplay}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {(p.model3dUrl || p.model3DUrl) && (
                            <button
                              onClick={() => open3DModal(p)}
                              className="p-1.5 rounded-lg text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-950/40"
                              title="Xem mô hình 3D"
                            >
                              <Box className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => openAdminEditModal(p)}
                            className="p-1.5 rounded-lg text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/40"
                            title="Chỉnh sửa bài đăng"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => deleteProperty(p.id)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                            title="Xóa bài đăng"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CATEGORY MANAGEMENT */}
      {activeSubTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Categories List */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Danh Mục Sản Phẩm Hiện Có ({categories.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((c) => (
                <div
                  key={c.code}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white">
                      <Warehouse className="w-4 h-4 text-teal-600" />
                      <span>{c.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono">Mã: {c.code}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{c.desc}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteCategory(c.code)}
                    className="p-1 text-slate-400 hover:text-red-500 rounded transition"
                    title="Xóa danh mục này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add Category Form */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Tạo Thêm Danh Mục Mới
            </h3>
            <form onSubmit={handleAddCategorySubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tên danh mục *
                </label>
                <input
                  type="text"
                  placeholder="VD: Thép Chữ H, Tôn PU, Dầm Cầu Trục..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mã Code (Tùy chọn, viết hoa không dấu)
                </label>
                <input
                  type="text"
                  placeholder="VD: THEP_CHU_H"
                  value={newCatCode}
                  onChange={(e) => setNewCatCode(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 font-mono dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mô tả danh mục
                </label>
                <textarea
                  rows={3}
                  placeholder="Mô tả quy cách, ứng dụng của danh mục này..."
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-teal-600 py-2.5 font-bold text-white hover:bg-teal-700 transition"
              >
                Lưu & Thêm Danh Mục
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: SUBSCRIBERS */}
      {activeSubTab === 'subscribers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Khách Hàng Đăng Ký Nhận Bản Tin Báo Giá ({subscribers.length})
            </h3>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 dark:bg-slate-800/80 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Tên Khách Hàng / Doanh Nghiệp</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Số Điện Thoại</th>
                  <th className="py-3 px-3">Kênh Nhận</th>
                  <th className="py-3 px-3">Thời Gian</th>
                  <th className="py-3 px-4 text-right">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{sub.name}</td>
                    <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300">{sub.email || '-'}</td>
                    <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300">{sub.phone || '-'}</td>
                    <td className="py-3 px-3 uppercase text-[10px] font-bold">{sub.channel}</td>
                    <td className="py-3 px-3 text-slate-400">{sub.time}</td>
                    <td className="py-3 px-4 text-right text-emerald-600 dark:text-emerald-400 font-bold">
                      {sub.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: NOTICES & TICKER */}
      {activeSubTab === 'notices' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Thông Báo Trang Chủ & Ticker Chạy Chữ
            </h3>
            <div className="space-y-3">
              {notices.map((n) => (
                <div
                  key={n.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="rounded bg-teal-100 text-teal-800 px-2 py-0.5 text-[10px] font-bold dark:bg-teal-950 dark:text-teal-300">
                        {n.badge}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{n.createdAt}</span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">{n.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{n.content}</p>
                  </div>
                  <button
                    onClick={() => deleteNotice(n.id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                    title="Xóa thông báo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Thêm Thông Báo Mới</h3>
            <form onSubmit={handleAddNoticeSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nhãn / Badge
                </label>
                <input
                  type="text"
                  placeholder="VD: Kho Hàng Mới, Công Nghệ 3D..."
                  value={newNoticeBadge}
                  onChange={(e) => setNewNoticeBadge(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tiêu đề thông báo *
                </label>
                <input
                  type="text"
                  placeholder="VD: Khai trương tổng kho khung xưởng..."
                  value={newNoticeTitle}
                  onChange={(e) => setNewNoticeTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nội dung chi tiết
                </label>
                <textarea
                  rows={3}
                  placeholder="Mô tả nội dung thông báo..."
                  value={newNoticeContent}
                  onChange={(e) => setNewNoticeContent(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-slate-900 py-2.5 font-bold text-white hover:bg-teal-700 transition dark:bg-teal-600"
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

      {/* Standalone AI 3D Modal */}
      <AdminAi3DModal
        isOpen={showAi3DModal}
        onClose={() => setShowAi3DModal(false)}
        onSelectModelUrl={(url, newTitle) => {
          openAdminEditModal({
            model3dUrl: url,
            model3DUrl: url,
            title: newTitle || 'Mô hình nhà xưởng 3D tương tác',
            type: 'THIET_KE_3D',
            typeDisplay: 'Xem Thiết Kế 3D Nhà Xưởng',
          } as any)
        }}
      />
    </div>
  )
}
