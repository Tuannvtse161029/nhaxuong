export type PropertyType = 'ALL' | 'SALE' | 'RENT' | 'KCN_PROJECT' | 'STANDARD_FACTORY' | 'COLD_LOGISTICS'

export interface Property {
  id: string
  title: string
  type: PropertyType
  typeDisplay: string
  province: string
  district?: string
  kcn: string
  price: number // in VND
  priceDisplay: string
  area: string // e.g. "12.000 m2"
  power: string // e.g. "1.500 kVA"
  pccc: string // e.g. "Tự Động (Sprinkler)"
  image: string
  gallery?: string[]
  videoUrl?: string
  audioUrl?: string // .mp3 audio voiceover description
  audioDuration?: string // e.g. "01:45"
  desc: string
  created: string
  emailNotified?: boolean
  unitPrice?: string // e.g. "4.0 Triệu/m2" or "70.000 đ/m2/tháng"
  ceilingHeight?: string // e.g. "11 mét"
  floorLoad?: string // e.g. "5 tấn/m2"
  legalStatus?: string // e.g. "Sổ hồng SKC (Sẵn sàng công chứng)"
  roadAccess?: string // e.g. "Container 40ft không cấm giờ"
  verified?: boolean
  brokerName?: string
  brokerPhone?: string
}

export interface Category {
  code: string
  name: string
  icon: string
  desc: string
  active: boolean
}

export interface Notice {
  id: string
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
  kcn: string
  minPrice: number
  maxPrice: number
  sortBy: 'newest' | 'price-asc' | 'price-desc'
}
