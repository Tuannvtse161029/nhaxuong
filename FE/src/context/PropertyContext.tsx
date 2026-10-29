import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { Property, PropertyType, Category, Notice, Subscriber, PropertyFilterState } from '@/types/property.types'
import {
  INITIAL_PROPERTIES,
  INITIAL_CATEGORIES,
  INITIAL_NOTICES,
  INITIAL_SUBSCRIBERS,
} from '@/data/mockData'
import { storage } from '@/utils/storage'

interface ToastItem {
  id: string
  message: string
  type: 'success' | 'info' | 'email'
}

interface PropertyContextType {
  // Properties
  properties: Property[]
  addProperty: (property: Omit<Property, 'id' | 'created'>, triggerEmail?: boolean) => void
  updateProperty: (id: string, updated: Partial<Property>, triggerBroadcast?: boolean) => void
  deleteProperty: (id: string) => void

  // Categories
  categories: Category[]
  addCategory: (cat: Category) => void
  deleteCategory: (code: string) => void

  // Notices
  notices: Notice[]
  activeNoticeText: string
  setActiveNoticeText: (text: string) => void
  addNotice: (notice: Omit<Notice, 'id' | 'createdAt'>) => void
  deleteNotice: (id: string) => void

  // Subscribers
  subscribers: Subscriber[]
  addSubscriber: (sub: Omit<Subscriber, 'id' | 'time'>) => void

  // Wishlist
  savedPropertyIds: string[]
  toggleSaveProperty: (id: string) => void
  isSaved: (id: string) => boolean

  // Filters
  filterState: PropertyFilterState
  setFilterState: (updater: Partial<PropertyFilterState> | ((prev: PropertyFilterState) => PropertyFilterState)) => void
  resetFilters: () => void
  filteredProperties: Property[]

  // Roles & View
  role: 'user' | 'admin'
  setRole: (role: 'user' | 'admin') => void

  // Active Modals & Selected Property
  activeModal: 'none' | 'detail' | '3d' | 'saved' | 'notice' | 'subscribe' | 'admin-edit'
  selectedProperty: Property | null
  openDetailModal: (property: Property) => void
  open3DModal: (property: Property) => void
  openSavedModal: () => void
  openNoticeModal: () => void
  openSubscribeModal: () => void
  openAdminEditModal: (property?: Property) => void
  closeModal: () => void

  // Toasts
  toasts: ToastItem[]
  showToast: (message: string, type?: ToastItem['type']) => void
  removeToast: (id: string) => void
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined)

const DEFAULT_FILTER: PropertyFilterState = {
  type: 'ALL',
  keyword: '',
  province: 'Toàn Quốc',
  kcn: 'Tất cả bãi kho',
  minPrice: 0,
  maxPrice: 150000000000, // 150 tỷ
  sortBy: 'newest',
}

export function PropertyProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = storage.getItem<Property[]>('kcn_properties', INITIAL_PROPERTIES)
    const existingIds = new Set(saved.map((p) => p.id))
    const missing = INITIAL_PROPERTIES.filter((p) => !existingIds.has(p.id))
    if (missing.length > 0) {
      const merged = [...missing, ...saved]
      storage.setItem('kcn_properties', merged)
      return merged
    }
    return saved
  })
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = storage.getItem<Category[]>('kcn_categories', INITIAL_CATEGORIES)
    const validCodes = new Set(INITIAL_CATEGORIES.map((c) => c.code))
    const cleaned = saved.filter((c) => validCodes.has(c.code) || c.code.startsWith('CAT_'))
    const existingCodes = new Set(cleaned.map((c) => c.code))
    const missing = INITIAL_CATEGORIES.filter((c) => !existingCodes.has(c.code))
    const merged = [...cleaned, ...missing]
    storage.setItem('kcn_categories', merged)
    return merged
  })
  const [notices, setNotices] = useState<Notice[]>(() =>
    storage.getItem('kcn_notices', INITIAL_NOTICES)
  )
  const [subscribers, setSubscribers] = useState<Subscriber[]>(() =>
    storage.getItem('kcn_subscribers', INITIAL_SUBSCRIBERS)
  )
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(() =>
    storage.getItem('kcn_saved_ids', ['prop-1'])
  )
  const [role, setRoleState] = useState<'user' | 'admin'>('user')
  const [activeNoticeText, setActiveNoticeText] = useState(
    'Ưu đãi thuế quan mở rộng KCN VSIP 1, Long Đức. Hỗ trợ mô hình 3D HTML xoay tương tác 360° và Audio thuyết minh trực quan!'
  )

  const [filterState, setFilterStateInternal] = useState<PropertyFilterState>(DEFAULT_FILTER)
  const [activeModal, setActiveModal] = useState<PropertyContextType['activeModal']>('none')
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [toasts, setToasts] = useState<ToastItem[]>([])

  // Ensure default categories and recycled steel properties exist even on previously cached browser sessions
  useEffect(() => {
    setCategories((prev) => {
      const validCodes = new Set(INITIAL_CATEGORIES.map((c) => c.code))
      const cleaned = prev.filter((c) => validCodes.has(c.code) || c.code.startsWith('CAT_'))
      const existingCodes = new Set(cleaned.map((c) => c.code))
      const missing = INITIAL_CATEGORIES.filter((c) => !existingCodes.has(c.code))
      const next = [...cleaned, ...missing]
      storage.setItem('kcn_categories', next)
      return next
    })

    setProperties((prev) => {
      const existingIds = new Set(prev.map((p) => p.id))
      const missing = INITIAL_PROPERTIES.filter((p) => !existingIds.has(p.id))
      const merged = [...missing, ...prev].map((p) => {
        if ((p.type as string) === 'KCN_PROJECT' || (p.type as string) === 'STANDARD_FACTORY' || (p.type as string) === 'COLD_LOGISTICS') {
          return { ...p, type: 'SALE' as PropertyType, typeDisplay: 'Bán Nhà Xưởng' }
        }
        return p
      })
      storage.setItem('kcn_properties', merged)
      return merged
    })
  }, [])

  // Sync to localStorage
  useEffect(() => {
    storage.setItem('kcn_properties', properties)
  }, [properties])

  useEffect(() => {
    storage.setItem('kcn_categories', categories)
  }, [categories])

  useEffect(() => {
    storage.setItem('kcn_saved_ids', savedPropertyIds)
  }, [savedPropertyIds])

  useEffect(() => {
    storage.setItem('kcn_subscribers', subscribers)
  }, [subscribers])

  const showToast = (message: string, type: ToastItem['type'] = 'success') => {
    const id = 'toast_' + Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4500)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const setRole = (newRole: 'user' | 'admin') => {
    setRoleState(newRole)
    if (newRole === 'admin') {
      showToast('👑 Đã chuyển sang chế độ Quản Trị Viên (Admin)', 'info')
    } else {
      showToast('👤 Đã chuyển sang chế độ Khách Hàng (User)', 'info')
    }
  }

  const toggleSaveProperty = (id: string) => {
    setSavedPropertyIds((prev) => {
      const exists = prev.includes(id)
      if (exists) {
        showToast('Đã bỏ lưu nhà xưởng khỏi danh sách yêu thích')
        return prev.filter((item) => item !== id)
      } else {
        showToast('❤️ Đã lưu nhà xưởng vào danh sách yêu thích!')
        return [...prev, id]
      }
    })
  }

  const isSaved = (id: string) => savedPropertyIds.includes(id)

  const setFilterState = (
    updater: Partial<PropertyFilterState> | ((prev: PropertyFilterState) => PropertyFilterState)
  ) => {
    if (typeof updater === 'function') {
      setFilterStateInternal(updater)
    } else {
      setFilterStateInternal((prev) => ({ ...prev, ...updater }))
    }
  }

  const resetFilters = () => {
    setFilterStateInternal(DEFAULT_FILTER)
  }

  // Filtered properties calculation
  const filteredProperties = properties
    .filter((p) => {
      // Type filter
      if (filterState.type !== 'ALL' && p.type !== filterState.type) {
        return false
      }
      // Keyword
      if (filterState.keyword.trim()) {
        const kw = filterState.keyword.toLowerCase().trim()
        const matchTitle = p.title.toLowerCase().includes(kw)
        const matchDesc = p.desc.toLowerCase().includes(kw)
        const matchKcn = p.kcn.toLowerCase().includes(kw)
        if (!matchTitle && !matchDesc && !matchKcn) return false
      }
      // Province
      if (filterState.province !== 'Toàn Quốc' && p.province !== filterState.province) {
        return false
      }
      // Bãi kho / KCN
      if (filterState.kcn !== 'Tất cả bãi kho' && filterState.kcn !== 'Tất cả KCN' && p.kcn !== filterState.kcn) {
        return false
      }
      // Price range
      if (p.price < filterState.minPrice || p.price > filterState.maxPrice) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      if (filterState.sortBy === 'price-asc') return a.price - b.price
      if (filterState.sortBy === 'price-desc') return b.price - a.price
      return 0 // Default newest
    })

  // CRUD Properties
  const addProperty = (
    propertyData: Omit<Property, 'id' | 'created'>,
    triggerEmail = true
  ) => {
    const now = new Date()
    const timeStr = `${now.toLocaleTimeString('vi-VN')} ${now.toLocaleDateString('vi-VN')}`
    const newProp: Property = {
      ...propertyData,
      id: 'prop-' + Date.now(),
      created: timeStr,
      emailNotified: triggerEmail,
    }

    setProperties((prev) => [newProp, ...prev])

    if (triggerEmail) {
      showToast(
        `✉️ <b>Email Broadcast:</b> Đã phát hành bản tin email kèm video drone và thông số nhà xưởng!`,
        'email'
      )
    }
  }

  const updateProperty = (id: string, updated: Partial<Property>, triggerBroadcast = false) => {
    setProperties((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    )
    if (triggerBroadcast) {
      showToast(
        `✉️ <b>Email Broadcast:</b> Đã thông báo cập nhật giá & mặt bằng tới các nhà đầu tư quan tâm!`,
        'email'
      )
    } else {
      showToast('Đã lưu cập nhật thông tin mặt hàng thành công')
    }
  }

  const deleteProperty = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id))
    showToast('Đã xóa mặt hàng khỏi hệ thống')
  }

  // Categories
  const addCategory = (cat: Category) => {
    setCategories((prev) => [...prev, cat])
    showToast(`Đã thêm danh mục mới: ${cat.name}`)
  }

  const deleteCategory = (code: string) => {
    if (['SALE', 'RENT', 'KCN_PROJECT'].includes(code)) {
      alert('Không thể xóa danh mục hệ thống cốt lõi!')
      return
    }
    setCategories((prev) => prev.filter((c) => c.code !== code))
    showToast('Đã xóa danh mục')
  }

  // Notices
  const addNotice = (n: Omit<Notice, 'id' | 'createdAt'>) => {
    const newNotice: Notice = {
      ...n,
      id: 'not-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    }
    setNotices((prev) => [newNotice, ...prev])
    setActiveNoticeText(newNotice.title)
    showToast('Đã đăng thông báo mới lên trang chủ')
  }

  const deleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id))
    showToast('Đã gỡ thông báo')
  }

  // Subscribers
  const addSubscriber = (sub: Omit<Subscriber, 'id' | 'time'>) => {
    const newSub: Subscriber = {
      ...sub,
      id: 'sub-' + Date.now(),
      time: new Date().toLocaleTimeString('vi-VN') + ' Hôm nay',
    }
    setSubscribers((prev) => [newSub, ...prev])
    showToast(`🎉 Cảm ơn bạn! Đã đăng ký nhận bản tin qua ${sub.channel.toUpperCase()} thành công.`, 'success')
  }

  // Modals
  const openDetailModal = (property: Property) => {
    setSelectedProperty(property)
    setActiveModal('detail')
  }

  const open3DModal = (property: Property) => {
    setSelectedProperty(property)
    setActiveModal('3d')
  }

  const openSavedModal = () => setActiveModal('saved')
  const openNoticeModal = () => setActiveModal('notice')
  const openSubscribeModal = () => setActiveModal('subscribe')
  const openAdminEditModal = (property?: Property) => {
    setSelectedProperty(property || null)
    setActiveModal('admin-edit')
  }
  const closeModal = () => {
    setActiveModal('none')
    setSelectedProperty(null)
  }

  return (
    <PropertyContext.Provider
      value={{
        properties,
        addProperty,
        updateProperty,
        deleteProperty,
        categories,
        addCategory,
        deleteCategory,
        notices,
        activeNoticeText,
        setActiveNoticeText,
        addNotice,
        deleteNotice,
        subscribers,
        addSubscriber,
        savedPropertyIds,
        toggleSaveProperty,
        isSaved,
        filterState,
        setFilterState,
        resetFilters,
        filteredProperties,
        role,
        setRole,
        activeModal,
        selectedProperty,
        openDetailModal,
        open3DModal,
        openSavedModal,
        openNoticeModal,
        openSubscribeModal,
        openAdminEditModal,
        closeModal,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </PropertyContext.Provider>
  )
}

export function useProperties() {
  const context = useContext(PropertyContext)
  if (!context) {
    throw new Error('useProperties must be used within a PropertyProvider')
  }
  return context
}
