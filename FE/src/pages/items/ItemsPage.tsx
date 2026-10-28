import { useState, useMemo } from 'react'
import { Plus, Search, Filter, Edit2, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Table } from '@/components/common/Table'
import { Badge } from '@/components/common/Badge'
import { Modal } from '@/components/common/Modal'
import { formatCurrency, formatDate } from '@/utils/formatters'
import type { TableColumn } from '@/types/common.types'

interface EquipmentItem {
  id: string
  code: string
  name: string
  category: string
  quantity: number
  unitPrice: number
  status: 'active' | 'maintenance' | 'idle'
  updatedAt: string
}

const INITIAL_ITEMS: EquipmentItem[] = [
  {
    id: 'eq-1',
    code: 'CNC-001',
    name: 'Máy phay trung tâm CNC Mazak 3 trục',
    category: 'Gia công cơ khí',
    quantity: 3,
    unitPrice: 850000000,
    status: 'active',
    updatedAt: '2026-10-20',
  },
  {
    id: 'eq-2',
    code: 'LSR-002',
    name: 'Máy cắt Fiber Laser công suất 6kW',
    category: 'Gia công nhiệt',
    quantity: 2,
    unitPrice: 1450000000,
    status: 'active',
    updatedAt: '2026-10-25',
  },
  {
    id: 'eq-3',
    code: 'ROB-003',
    name: 'Cánh tay Robot hàn tự động ABB',
    category: 'Tự động hóa',
    quantity: 4,
    unitPrice: 620000000,
    status: 'maintenance',
    updatedAt: '2026-10-27',
  },
  {
    id: 'eq-4',
    code: 'CMP-004',
    name: 'Máy nén khí trục vít công nghiệp Pegasus',
    category: 'Phụ trợ khí nén',
    quantity: 5,
    unitPrice: 95000000,
    status: 'active',
    updatedAt: '2026-10-15',
  },
  {
    id: 'eq-5',
    code: 'DRY-005',
    name: 'Buồng sấy sấy sơn tĩnh điện đối lưu',
    category: 'Hoàn thiện bề mặt',
    quantity: 1,
    unitPrice: 380000000,
    status: 'idle',
    updatedAt: '2026-10-10',
  },
]

export function ItemsPage() {
  const [items, setItems] = useState<EquipmentItem[]>(INITIAL_ITEMS)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<EquipmentItem | null>(null)

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category: 'Gia công cơ khí',
    quantity: 1,
    unitPrice: 100000000,
    status: 'active' as EquipmentItem['status'],
  })

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase())
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory
      return matchSearch && matchCategory
    })
  }, [items, searchTerm, selectedCategory])

  const handleOpenAdd = () => {
    setEditingItem(null)
    setFormData({
      code: `EQ-${String(items.length + 1).padStart(3, '0')}`,
      name: '',
      category: 'Gia công cơ khí',
      quantity: 1,
      unitPrice: 100000000,
      status: 'active',
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (item: EquipmentItem) => {
    setEditingItem(item)
    setFormData({
      code: item.code,
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      status: item.status,
    })
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa mục này khỏi danh sách?')) {
      setItems((prev) => prev.filter((i) => i.id !== id))
    }
  }

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Vui lòng nhập tên thiết bị')
      return
    }

    if (editingItem) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === editingItem.id
            ? { ...i, ...formData, updatedAt: new Date().toISOString().split('T')[0] }
            : i
        )
      )
    } else {
      const newItem: EquipmentItem = {
        id: 'eq-' + Date.now(),
        ...formData,
        updatedAt: new Date().toISOString().split('T')[0],
      }
      setItems((prev) => [newItem, ...prev])
    }
    setIsModalOpen(false)
  }

  const columns: TableColumn<EquipmentItem>[] = [
    {
      key: 'code',
      title: 'Mã Thiết Bị',
      width: '140px',
      render: (row) => <span className="font-mono font-medium text-blue-600 dark:text-blue-400">{row.code}</span>,
    },
    {
      key: 'name',
      title: 'Tên Thiết Bị / Máy Móc',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">{row.name}</p>
          <p className="text-xs text-slate-400">{row.category}</p>
        </div>
      ),
    },
    {
      key: 'quantity',
      title: 'Số Lượng',
      align: 'center',
      render: (row) => <span className="font-medium">{row.quantity}</span>,
    },
    {
      key: 'unitPrice',
      title: 'Đơn Giá Ước Tính',
      render: (row) => <span>{formatCurrency(row.unitPrice)}</span>,
    },
    {
      key: 'status',
      title: 'Trạng Thái',
      render: (row) => {
        if (row.status === 'active') {
          return (
            <Badge variant="success" className="gap-1">
              <CheckCircle className="w-3 h-3" /> Đang vận hành
            </Badge>
          )
        }
        if (row.status === 'maintenance') {
          return (
            <Badge variant="warning" className="gap-1">
              <Clock className="w-3 h-3" /> Bảo trì
            </Badge>
          )
        }
        return (
          <Badge variant="default" className="gap-1">
            <AlertCircle className="w-3 h-3" /> Tạm dừng
          </Badge>
        )
      },
    },
    {
      key: 'updatedAt',
      title: 'Cập Nhật',
      render: (row) => <span className="text-xs text-slate-400">{formatDate(row.updatedAt)}</span>,
    },
    {
      key: 'actions',
      title: 'Thao Tác',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleOpenEdit(row)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800 transition-colors"
            title="Chỉnh sửa"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 transition-colors"
            title="Xóa"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header with Title and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Quản Lý Thiết Bị & Kho Xưởng
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Trang mẫu CRUD với tìm kiếm, lọc, phân trang, thêm mới và chỉnh sửa thiết bị.
          </p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={handleOpenAdd}>
          Thêm Thiết Bị
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Input
            placeholder="Tìm theo tên thiết bị hoặc mã code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent focus:outline-none"
            >
              <option value="all">Tất cả nhóm</option>
              <option value="Gia công cơ khí">Gia công cơ khí</option>
              <option value="Gia công nhiệt">Gia công nhiệt</option>
              <option value="Tự động hóa">Tự động hóa</option>
              <option value="Phụ trợ khí nén">Phụ trợ khí nén</option>
              <option value="Hoàn thiện bề mặt">Hoàn thiện bề mặt</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <Table columns={columns} data={filteredItems} emptyMessage="Không tìm thấy thiết bị phù hợp" />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Cập Nhật Thiết Bị' : 'Thêm Thiết Bị Mới'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Hủy bỏ
            </Button>
            <Button onClick={handleSave}>
              {editingItem ? 'Lưu thay đổi' : 'Thêm vào danh sách'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Mã thiết bị"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Nhóm danh mục
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="Gia công cơ khí">Gia công cơ khí</option>
                <option value="Gia công nhiệt">Gia công nhiệt</option>
                <option value="Tự động hóa">Tự động hóa</option>
                <option value="Phụ trợ khí nén">Phụ trợ khí nén</option>
                <option value="Hoàn thiện bề mặt">Hoàn thiện bề mặt</option>
              </select>
            </div>
          </div>

          <Input
            label="Tên thiết bị / Máy móc"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ví dụ: Máy tiện CNC 5 trục..."
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Số lượng"
              type="number"
              min={1}
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
            />
            <Input
              label="Đơn giá (VNĐ)"
              type="number"
              step={1000000}
              value={formData.unitPrice}
              onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Trạng thái ban đầu
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as EquipmentItem['status'] })
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="active">Đang vận hành (Active)</option>
              <option value="maintenance">Bảo trì (Maintenance)</option>
              <option value="idle">Tạm dừng (Idle)</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  )
}
