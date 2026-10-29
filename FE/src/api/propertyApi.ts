import axiosClient from './axiosClient'
import { API_ENDPOINTS } from './endpoints'
import type { Property, Category, Notice, Subscriber, PropertyFilterState } from '@/types/property.types'

export interface PagedResponse<T> {
  items: T[]
  total: number
  totalCount?: number
  page: number
  pageNumber?: number
  pageSize: number
  totalPages: number
}

export const propertyApi = {
  // Properties
  async getProperties(filter?: Partial<PropertyFilterState>): Promise<Property[]> {
    const params = new URLSearchParams()
    if (filter?.type && filter.type !== 'ALL') params.append('type', filter.type)
    if (filter?.keyword) params.append('keyword', filter.keyword)
    if (filter?.province && filter.province !== 'Toàn Quốc') params.append('province', filter.province)
    if (filter?.kcn && filter.kcn !== 'Tất cả bãi kho' && filter.kcn !== 'Tất cả KCN') params.append('kcn', filter.kcn)
    if (filter?.minPrice) params.append('minPrice', filter.minPrice.toString())
    if (filter?.maxPrice) params.append('maxPrice', filter.maxPrice.toString())
    if (filter?.sortBy) params.append('sortBy', filter.sortBy)

    const query = params.toString() ? `?${params.toString()}` : ''
    const res = await axiosClient.get<any, PagedResponse<Property> | Property[]>(`${API_ENDPOINTS.PROPERTIES.LIST}${query}`)
    if (Array.isArray(res)) return res
    if (res && Array.isArray(res.items)) return res.items
    return []
  },

  async getPropertyById(id: string): Promise<Property> {
    return axiosClient.get<any, Property>(API_ENDPOINTS.PROPERTIES.DETAIL(id))
  },

  async createProperty(property: Omit<Property, 'id' | 'created'> & { triggerEmail?: boolean }): Promise<Property> {
    return axiosClient.post<any, Property>(API_ENDPOINTS.PROPERTIES.CREATE, property)
  },

  async updateProperty(id: string, property: Partial<Property>): Promise<Property> {
    return axiosClient.put<any, Property>(API_ENDPOINTS.PROPERTIES.UPDATE(id), property)
  },

  async deleteProperty(id: string): Promise<{ message: string }> {
    return axiosClient.delete<any, { message: string }>(API_ENDPOINTS.PROPERTIES.DELETE(id))
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    return axiosClient.get<any, Category[]>(API_ENDPOINTS.CATEGORIES.LIST)
  },

  async createCategory(cat: Category): Promise<Category> {
    return axiosClient.post<any, Category>(API_ENDPOINTS.CATEGORIES.CREATE, cat)
  },

  async deleteCategory(code: string): Promise<{ message: string }> {
    return axiosClient.delete<any, { message: string }>(API_ENDPOINTS.CATEGORIES.DELETE(code))
  },

  // Subscribers
  async getSubscribers(): Promise<Subscriber[]> {
    return axiosClient.get<any, Subscriber[]>(API_ENDPOINTS.SUBSCRIBERS.LIST)
  },

  async createSubscriber(sub: Omit<Subscriber, 'id' | 'time'>): Promise<Subscriber> {
    return axiosClient.post<any, Subscriber>(API_ENDPOINTS.SUBSCRIBERS.CREATE, sub)
  },

  // Notices
  async getNotices(): Promise<Notice[]> {
    return axiosClient.get<any, Notice[]>(API_ENDPOINTS.NOTICES.LIST)
  },

  async createNotice(notice: Omit<Notice, 'id' | 'createdAt'>): Promise<Notice> {
    return axiosClient.post<any, Notice>(API_ENDPOINTS.NOTICES.CREATE, notice)
  },

  async deleteNotice(id: string): Promise<{ message: string }> {
    return axiosClient.delete<any, { message: string }>(API_ENDPOINTS.NOTICES.DELETE(id))
  },

  async getTicker(): Promise<{ ticker: string }> {
    return axiosClient.get<any, { ticker: string }>(API_ENDPOINTS.NOTICES.TICKER)
  },

  async updateTicker(text: string): Promise<{ ticker: string; message: string }> {
    return axiosClient.put<any, { ticker: string; message: string }>(API_ENDPOINTS.NOTICES.TICKER, { text })
  },

  // Uploads
  async uploadImage(file: File): Promise<{ url: string; fileName: string; size: number }> {
    const formData = new FormData()
    formData.append('file', file)
    return axiosClient.post(API_ENDPOINTS.UPLOADS.IMAGE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}
