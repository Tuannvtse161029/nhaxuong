export type PropertyType =
  | 'ALL'
  | 'BAN_KHUNG_XUONG'
  | 'COT_KEO'
  | 'THEP_HINH_I'
  | 'TON_LOP_VACH'
  | 'TON_SAN_DECK'
  | 'ONG_PCCC'
  | 'THANH_LY_XUONG'
  | 'THIET_KE_3D'
  | 'SALE'
  | 'RENT'
  | 'RECYCLED_STEEL'
  | string

export interface Property {
  id: number | string
  title: string
  type: PropertyType
  typeDisplay: string
  status?: string // 'Còn hàng', 'Đã bán', 'Hết hàng', 'Đang giao dịch'
  stockStatus?: 'IN_STOCK' | 'OUT_OF_STOCK' | string // 🟩 Còn hàng vs 🟥 Hết hàng
  storageLocation?: 'AT_YARD' | 'AT_SITE' | string // Ở bãi vs Ở công trình
  categoryId?: number | null
  categoryName?: string | null
  province: string
  city?: string // Lâm Đồng, Bình Dương, Đồng Nai, TP.HCM
  district?: string // Dĩ An, Thuận An, Bảo Lộc, Đà Lạt
  kcn: string // Vị trí cụ thể kho bãi / công trình
  price: number // in VND
  priceDisplay: string
  unitPrice?: string
  area: string // e.g. "2.016 m²" or "95 Tấn"
  length?: number // Chiều dài (m)
  width?: number // Chiều rộng (m)
  structureType?: string // "Thép I", "Zamil", "Kèo Tiệp", "Khác"
  hasCrane?: boolean // true/false
  craneCapacity?: string // "5 Tấn", "10 Tấn", "15 Tấn"...
  brokerPhone?: string
  brokerName?: string
  image: string
  images?: string[]
  gallery?: string[]
  videoUrl?: string
  audioUrl?: string
  audioDuration?: string
  model3dUrl?: string | null // Link file 3D HTML hoặc GLB
  model3DUrl?: string | null // Casing alias
  drawing2DUrl?: string | null // Link file bản vẽ DXF / STEP / PDF
  desc: string
  created: string
  emailNotified?: boolean
  ceilingHeight?: string
  floorLoad?: string
  legalStatus?: string
  roadAccess?: string
  verified?: boolean
}

export interface Category {
  id?: number
  code: string
  name: string
  icon: string
  desc: string
  active: boolean
}

export interface Notice {
  id: number | string
  title: string
  content: string
  badge: string
  link?: string
  active: boolean
  createdAt: string
}

export interface Subscriber {
  id: string
  name: string
  email?: string
  phone?: string
  time: string
  status: string
  channel: 'email' | 'hotline'
}

export interface PropertyFilterState {
  type: PropertyType
  keyword: string
  province: string
  city?: string
  district?: string
  kcn: string
  minPrice: number
  maxPrice: number
  sortBy: 'newest' | 'price-asc' | 'price-desc'
  status?: string
  stockStatus?: string // 'ALL' | 'IN_STOCK' | 'OUT_OF_STOCK'
  storageLocation?: string // 'ALL' | 'AT_YARD' | 'AT_SITE'
  categoryId?: number
  structureType?: string // 'ALL' | 'Thép I' | 'Zamil' | 'Kèo Tiệp'
  hasCrane?: boolean | null // null = all, true = has crane, false = no crane
  lengthMin?: number
  lengthMax?: number
  widthMin?: number
  widthMax?: number
}
