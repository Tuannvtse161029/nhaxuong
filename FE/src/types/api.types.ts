export interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  data: T
  statusCode?: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface PaginationParams {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ApiError {
  message: string
  statusCode?: number
  errors?: Record<string, string[]>
}
