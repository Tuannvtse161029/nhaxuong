import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react'
import type { Property, PropertyType, Category, Notice, Subscriber, PropertyFilterState } from '@/types/property.types'
import {
  INITIAL_PROPERTIES,
  INITIAL_CATEGORIES,
  INITIAL_NOTICES,
  INITIAL_SUBSCRIBERS,
} from '@/data/mockData'
import { storage } from '@/utils/storage'
import { propertyApi } from '@/api/propertyApi'
import { ENV } from '@/config/env.config'

interface ToastItem {
  id: string
  message: string
  type: 'success' | 'info' | 'email'
}

interface PropertyContextType {
  // Properties
  properties: Property[]
  addProperty: (property: Omit<Property, 'id' | 'created'>, triggerEmail?: boolean) => Promise<Property>
  updateProperty: (id: string | number, updated: Partial<Property>, triggerBroadcast?: boolean) => Promise<Property>
  deleteProperty: (id: string | number) => Promise<void>

  // Categories
  categories: Category[]
  addCategory: (cat: Category) => void
  updateCategory: (id: number, cat: Partial<Category>) => void
  deleteCategory: (codeOrId: string | number) => void

  // Notices
  notices: Notice[]
  activeNoticeText: string
  setActiveNoticeText: (text: string) => void
  addNotice: (notice: Omit<Notice, 'id' | 'createdAt'>) => void
  deleteNotice: (id: string | number) => void

  // Subscribers
  subscribers: Subscriber[]
  addSubscriber: (sub: Omit<Subscriber, 'id' | 'time'>) => void

  // Wishlist
  savedPropertyIds: (string | number)[]
  toggleSaveProperty: (id: string | number) => void
  isSaved: (id: string | number) => boolean

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
  city: 'ALL',
  district: 'ALL',
  kcn: 'Tất cả bãi kho',
  stockStatus: 'ALL',
  storageLocation: 'ALL',
  structureType: 'ALL',
  hasCrane: null,
  minPrice: 0,
  maxPrice: 150000000000,
  sortBy: 'newest',
}

export function PropertyProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = storage.getItem<Property[]>('nhaxuong_properties_v4', INITIAL_PROPERTIES)
    const existingIds = new Set(saved.map((p) => p.id))
    const missing = INITIAL_PROPERTIES.filter((p) => !existingIds.has(p.id))
    if (missing.length > 0) {
      const merged = [...missing, ...saved]
      storage.setItem('nhaxuong_properties_v4', merged)
      return merged
    }
    return saved
  })

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = storage.getItem<Category[]>('nhaxuong_categories_v6', INITIAL_CATEGORIES)
    const initialCodes = new Set(INITIAL_CATEGORIES.map((c) => c.code))
    const userCreated = saved.filter((c) => !initialCodes.has(c.code))
    const merged = [...INITIAL_CATEGORIES, ...userCreated]
    storage.setItem('nhaxuong_categories_v6', merged)
    return merged
  })

  const [notices, setNotices] = useState<Notice[]>(() =>
    storage.getItem('nhaxuong_notices_v6', INITIAL_NOTICES)
  )
  const [subscribers, setSubscribers] = useState<Subscriber[]>(() =>
    storage.getItem('nhaxuong_subscribers_v6', INITIAL_SUBSCRIBERS)
  )
  const [savedPropertyIds, setSavedPropertyIds] = useState<(string | number)[]>(() =>
    storage.getItem('nhaxuong_saved_ids_v6', ['prop-kx-1'])
  )
  const [role, setRoleState] = useState<'user' | 'admin'>('user')
  const [activeNoticeText, setActiveNoticeText] = useState(
    'Tổng kho khung xưởng & sắt thép tại Dĩ An - Bình Dương & Lâm Đồng. Hotline: 0965 985 468!'
  )

  const [filterState, setFilterStateInternal] = useState<PropertyFilterState>(DEFAULT_FILTER)
  const [activeModal, setActiveModal] = useState<PropertyContextType['activeModal']>('none')
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [toasts, setToasts] = useState<ToastItem[]>([])

  // Load from backend on mount if not in pure mock mode, but ALWAYS preserve INITIAL_PROPERTIES & INITIAL_CATEGORIES
  useEffect(() => {
    if (!ENV.USE_MOCK_API) {
      propertyApi
        .getCategories()
        .then((cats) => {
          if (Array.isArray(cats) && cats.length > 0) {
            // Keep all 8 core categories and append any new ones
            const initialCodes = new Set(INITIAL_CATEGORIES.map((c) => c.code))
            const newBackendCats = cats.filter((c) => !initialCodes.has(c.code))
            const merged = [...INITIAL_CATEGORIES, ...newBackendCats]
            setCategories(merged)
            storage.setItem('nhaxuong_categories_v6', merged)
          }
        })
        .catch(() => {})

      propertyApi
        .getProperties()
        .then((props) => {
          if (Array.isArray(props) && props.length > 0) {
            // Merge backend items with initial items, preserving rich multi-images & specs
            const initialMap = new Map(INITIAL_PROPERTIES.map((p) => [p.id, p]))
            const enrichedProps = props.map((p) => {
              const model3d = p.model3dUrl || (p as any).model3DUrl || (p as any).Model3DUrl || null
              const drawing2d = p.drawing2DUrl || (p as any).drawing2dUrl || null
              const init = initialMap.get(p.id)
              if (init) {
                return {
                  ...init,
                  ...p,
                  model3dUrl: model3d || init.model3dUrl || init.model3DUrl || null,
                  model3DUrl: model3d || init.model3dUrl || init.model3DUrl || null,
                  drawing2DUrl: drawing2d || init.drawing2DUrl || null,
                  images: (p.images && p.images.length > 0) ? p.images : init.images,
                  gallery: (p.gallery && p.gallery.length > 0) ? p.gallery : init.gallery,
                  unitPrice: p.unitPrice || init.unitPrice,
                }
              }
              return {
                ...p,
                model3dUrl: model3d,
                model3DUrl: model3d,
                drawing2DUrl: drawing2d,
              }
            })
            const apiIds = new Set(props.map((p) => p.id))
            const missingProps = INITIAL_PROPERTIES.filter((p) => !apiIds.has(p.id))
            const merged = [...enrichedProps, ...missingProps]
            setProperties(merged)
            storage.setItem('nhaxuong_properties_v6', merged)
          } else {
            setProperties(INITIAL_PROPERTIES)
            storage.setItem('nhaxuong_properties_v6', INITIAL_PROPERTIES)
          }
        })
        .catch(() => {})
    }
  }, [])

  // Sync to localStorage
  useEffect(() => {
    storage.setItem('nhaxuong_properties_v6', properties)
  }, [properties])

  useEffect(() => {
    storage.setItem('nhaxuong_categories_v6', categories)
  }, [categories])

  useEffect(() => {
    storage.setItem('nhaxuong_notices_v6', notices)
  }, [notices])

  useEffect(() => {
    storage.setItem('nhaxuong_subscribers_v6', subscribers)
  }, [subscribers])

  useEffect(() => {
    storage.setItem('nhaxuong_saved_ids_v3', savedPropertyIds)
  }, [savedPropertyIds])

  const setFilterState = (updater: Partial<PropertyFilterState> | ((prev: PropertyFilterState) => PropertyFilterState)) => {
    if (typeof updater === 'function') {
      setFilterStateInternal((prev) => updater(prev))
    } else {
      setFilterStateInternal((prev) => ({ ...prev, ...updater }))
    }
  }

  const resetFilters = () => setFilterStateInternal(DEFAULT_FILTER)

  // Filter properties client-side
  const filteredProperties = useMemo(() => {
    return properties.filter((item) => {
      // Category filter
      if (filterState.type && filterState.type !== 'ALL') {
        const targetType = filterState.type.toUpperCase()
        const matchesType = (item.type || '').toUpperCase() === targetType
        const matchesCategory = item.categoryName?.toUpperCase().includes(targetType)
        if (!matchesType && !matchesCategory) return false
      }

      // CategoryId
      if (filterState.categoryId && item.categoryId !== filterState.categoryId) {
        return false
      }

      // Stock status filter (IN_STOCK / OUT_OF_STOCK)
      if (filterState.stockStatus && filterState.stockStatus !== 'ALL') {
        const itemStock = (item.stockStatus || 'IN_STOCK').toUpperCase()
        if (itemStock !== filterState.stockStatus.toUpperCase()) return false
      }

      // Storage location filter (AT_YARD / AT_SITE)
      if (filterState.storageLocation && filterState.storageLocation !== 'ALL') {
        const itemLoc = (item.storageLocation || 'AT_YARD').toUpperCase()
        if (itemLoc !== filterState.storageLocation.toUpperCase()) return false
      }

      // Structure type (Thép I, Zamil, Kèo Tiệp)
      if (filterState.structureType && filterState.structureType !== 'ALL') {
        const itemStructure = (item.structureType || '').toLowerCase()
        const filterStructure = filterState.structureType.toLowerCase()
        if (!itemStructure.includes(filterStructure)) return false
      }

      // Has Crane filter
      if (filterState.hasCrane !== null && filterState.hasCrane !== undefined) {
        if (Boolean(item.hasCrane) !== filterState.hasCrane) return false
      }

      // Dimension filters: Length
      if (filterState.lengthMin && (item.length || 0) < filterState.lengthMin) {
        return false
      }
      if (filterState.lengthMax && (item.length || 0) > filterState.lengthMax) {
        return false
      }

      // Dimension filters: Width
      if (filterState.widthMin && (item.width || 0) < filterState.widthMin) {
        return false
      }
      if (filterState.widthMax && (item.width || 0) > filterState.widthMax) {
        return false
      }

      // Province filter
      if (filterState.province && filterState.province !== 'Toàn Quốc' && filterState.province !== 'ALL') {
        const itemProv = (item.province || '').toLowerCase()
        const targetProv = filterState.province.toLowerCase()
        if (!itemProv.includes(targetProv)) return false
      }

      // District / City filter
      if (filterState.district && filterState.district !== 'ALL' && filterState.district !== 'Tất cả khu vực') {
        const itemDist = ((item.district || '') + ' ' + (item.kcn || '')).toLowerCase()
        const cleanDist = filterState.district.replace(/\s*\(.*\)/, '').toLowerCase()
        if (!itemDist.includes(cleanDist)) return false
      }

      // Keyword search
      if (filterState.keyword.trim()) {
        const kw = filterState.keyword.toLowerCase().trim()
        const text = `${item.title} ${item.desc} ${item.kcn} ${item.province} ${item.district || ''} ${item.structureType || ''}`.toLowerCase()
        if (!text.includes(kw)) return false
      }

      // Price filter
      if (item.price < filterState.minPrice || item.price > filterState.maxPrice) {
        return false
      }

      return true
    }).sort((a, b) => {
      if (filterState.sortBy === 'price-asc') return a.price - b.price
      if (filterState.sortBy === 'price-desc') return b.price - a.price
      return 0
    })
  }, [properties, filterState])

  // Toasts
  const showToast = (message: string, type: ToastItem['type'] = 'info') => {
    const id = 'toast-' + Date.now() + Math.random().toString(36).substring(2, 5)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // Wishlist
  const toggleSaveProperty = (id: string | number) => {
    setSavedPropertyIds((prev) => {
      const exists = prev.includes(id)
      if (exists) {
        showToast('Đã xóa mặt hàng khỏi danh sách quan tâm')
        return prev.filter((item) => item !== id)
      } else {
        showToast('Đã lưu vào danh sách quan tâm!')
        return [...prev, id]
      }
    })
  }

  const isSaved = (id: string | number) => savedPropertyIds.includes(id)

  const setRole = (newRole: 'user' | 'admin') => {
    setRoleState(newRole)
    showToast(
      newRole === 'admin'
        ? 'Đã chuyển sang chế độ Quản Trị Viên (Admin)'
        : 'Đã chuyển về chế độ Xem Khách Hàng',
      'info'
    )
  }

  // Properties CRUD
  const addProperty = async (property: Omit<Property, 'id' | 'created'>, triggerEmail = true): Promise<Property> => {
    let finalProp: Property
    const model3d = property.model3dUrl || property.model3DUrl || null
    const drawing2d = property.drawing2DUrl || null
    const payload = {
      ...property,
      model3dUrl: model3d,
      model3DUrl: model3d,
      drawing2DUrl: drawing2d,
      triggerEmail,
    }

    if (!ENV.USE_MOCK_API) {
      try {
        const res = await propertyApi.createProperty(payload as any)
        const returnedModel3d = (res as any)?.model3dUrl || (res as any)?.model3DUrl || model3d || null
        const returnedDrawing2d = (res as any)?.drawing2DUrl || (res as any)?.drawing2dUrl || drawing2d || null
        finalProp = {
          ...property,
          ...res,
          model3dUrl: returnedModel3d,
          model3DUrl: returnedModel3d,
          drawing2DUrl: returnedDrawing2d,
          id: res.id || ('prop-' + Date.now()),
          created: res.created || 'Vừa xong',
          emailNotified: triggerEmail,
          images: (res.images && res.images.length > 0) ? res.images : property.images,
          gallery: (res.gallery && res.gallery.length > 0) ? res.gallery : property.gallery,
        }
      } catch (err: any) {
        console.warn('API sync warning:', err.message)
        finalProp = {
          ...property,
          model3dUrl: model3d,
          model3DUrl: model3d,
          drawing2DUrl: drawing2d,
          id: 'prop-' + Date.now(),
          created: 'Vừa xong',
          emailNotified: triggerEmail,
        }
      }
    } else {
      finalProp = {
        ...property,
        model3dUrl: model3d,
        model3DUrl: model3d,
        drawing2DUrl: drawing2d,
        id: 'prop-' + Date.now(),
        created: 'Vừa xong',
        emailNotified: triggerEmail,
      }
    }

    setProperties((prev) => [finalProp, ...prev])

    if (triggerEmail) {
      showToast(
        `Đã kích hoạt <b>Email Broadcast Real-time:</b> Thông báo sản phẩm mới tới các khách hàng quan tâm!`,
        'email'
      )
    } else {
      showToast('Đã đăng tin mới thành công!', 'success')
    }

    return finalProp
  }

  const updateProperty = async (id: string | number, updated: Partial<Property>, triggerBroadcast = false): Promise<Property> => {
    const model3d = updated.model3dUrl !== undefined ? updated.model3dUrl : updated.model3DUrl
    const drawing2d = updated.drawing2DUrl
    const normalizedUpdate: Partial<Property> = {
      ...updated,
      ...(model3d !== undefined ? { model3dUrl: model3d, model3DUrl: model3d } : {}),
      ...(drawing2d !== undefined ? { drawing2DUrl: drawing2d } : {}),
    }

    if (!ENV.USE_MOCK_API) {
      try {
        await propertyApi.updateProperty(id, normalizedUpdate as any)
      } catch (err: any) {
        console.warn('API sync warning:', err.message)
      }
    }

    let updatedResult: Property | null = null
    setProperties((prev) =>
      prev.map((p) => {
        if (String(p.id) === String(id)) {
          updatedResult = { ...p, ...normalizedUpdate }
          return updatedResult
        }
        return p
      })
    )

    if (triggerBroadcast) {
      showToast(
        `Đã gửi Email thông báo cập nhật giá & mặt bằng tới các khách hàng quan tâm!`,
        'email'
      )
    } else {
      showToast('Đã lưu cập nhật thông tin thành công')
    }

    return updatedResult || ({ id, ...updated } as Property)
  }

  const deleteProperty = async (id: string | number): Promise<void> => {
    setProperties((prev) => prev.filter((p) => String(p.id) !== String(id)))
    if (!ENV.USE_MOCK_API) {
      try {
        await propertyApi.deleteProperty(id)
      } catch (err: any) {
        console.warn('API sync warning:', err.message)
      }
    }
    showToast('Đã xóa mặt hàng khỏi hệ thống')
  }

  // Categories CRUD
  const addCategory = (cat: Category) => {
    setCategories((prev) => [...prev, cat])
    if (!ENV.USE_MOCK_API) {
      propertyApi.createCategory(cat).catch((err) => {
        console.warn('API sync warning:', err.message)
      })
    }
    showToast(`Đã thêm danh mục mới: ${cat.name}`)
  }

  const updateCategory = (id: number, cat: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...cat } : c))
    )
    if (!ENV.USE_MOCK_API) {
      propertyApi.updateCategory(id, cat).catch((err) => {
        console.warn('API sync warning:', err.message)
      })
    }
    showToast('Đã cập nhật danh mục thành công')
  }

  const deleteCategory = (codeOrId: string | number) => {
    setCategories((prev) =>
      prev.filter((c) => String(c.id) !== String(codeOrId) && c.code !== String(codeOrId))
    )
    if (!ENV.USE_MOCK_API) {
      propertyApi.deleteCategory(codeOrId).catch((err) => {
        console.warn('API sync warning:', err.message)
      })
    }
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
    if (!ENV.USE_MOCK_API) {
      propertyApi.createNotice(n).catch((err) => {
        console.warn('API sync warning:', err.message)
      })
    }
    showToast('Đã đăng thông báo mới lên trang chủ')
  }

  const deleteNotice = (id: string | number) => {
    setNotices((prev) => prev.filter((n) => String(n.id) !== String(id)))
    if (!ENV.USE_MOCK_API) {
      propertyApi.deleteNotice(id).catch((err) => {
        console.warn('API sync warning:', err.message)
      })
    }
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
    if (!ENV.USE_MOCK_API) {
      propertyApi.createSubscriber(sub).catch((err) => {
        console.warn('API sync warning:', err.message)
      })
    }
    showToast(`Cảm ơn bạn! Đã đăng ký nhận bản tin qua ${sub.channel.toUpperCase()} thành công.`, 'success')
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
        updateCategory,
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
