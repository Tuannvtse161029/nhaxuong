import type { ReactNode } from 'react'

export interface SelectOption<T = string | number> {
  label: string
  value: T
  disabled?: boolean
}

export interface TableColumn<T> {
  key: keyof T | string
  title: string
  render?: (row: T, index: number) => ReactNode
  width?: string | number
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
}

export interface BreadcrumbItem {
  label: string
  path?: string
}

export interface NavigationItem {
  title: string
  path: string
  icon?: string
  badge?: string | number
  children?: NavigationItem[]
  roles?: string[]
}
