import { createContext, useState, useEffect, type ReactNode } from 'react'
import { storage } from '@/utils/storage'

export type Language = 'vi' | 'en'

export interface LanguageContextType {
  language: Language
  toggleLanguage: () => void
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const DICTIONARY: Record<Language, Record<string, string>> = {
  vi: {
    // Header & Navigation
    'brand_subtitle': 'KHO BÃI & SẮT THÉP',
    'header_desc': 'Sàn Mua Bán Khung Nhà Xưởng & Sắt Thép Miền Nam',
    'hotline_label': 'Hotline Kho Bãi: 0965 985 468',
    'realtime_quote': 'Nhận Báo Giá Real-time',
    'nav_home': 'Trang Chủ',
    'nav_steel': 'Thép Hình I',
    'nav_3d': 'Xem Thiết Kế 3D',
    'login': 'Đăng Nhập',
    'logout': 'Đăng Xuất',
    'saved_list': 'Danh sách đã lưu',
    'theme_light': 'Sáng',
    'theme_dark': 'Tối',

    // Hero Banner
    'hero_title': 'Sàn Giao Dịch Khung Xưởng & Sắt Thép',
    'hero_badge': 'Hàng Mới Về',
    'hero_sub': 'Khung Zamil, Thép hình I, Tôn lợp, Tôn sàn, Ống PCCC & Thiết kế 3D tại Bình Dương, Lâm Đồng, Đồng Nai',
    'hotline_btn': 'Hotline: 0965 985 468',

    // Horizontal Category Strip
    'cat_header_title': 'DANH MỤC SẢN PHẨM',
    'cat_scroll_hint': 'Vuốt ngang xem 8 danh mục',
    'cat_all': 'Tất Cả (Tin Mới Nhất)',
    'cat_BAN_KHUNG_XUONG': 'Bán Khung Nhà Xưởng',
    'cat_COT_KEO': 'Cột Kèo & Dầm Thép',
    'cat_THEP_HINH_I': 'Thép Hình I (I 200, I 300, I 500)',
    'cat_TON_LOP_VACH': 'Tôn (Tôn Lợp & Tôn Vách)',
    'cat_TON_SAN_DECK': 'Tôn Sàn (Decking)',
    'cat_ONG_PCCC': 'Ống Phòng Cháy Chữa Cháy (PCCC)',
    'cat_THANH_LY_XUONG': 'Thanh Lý Trọn Gói Nhà Xưởng',
    'cat_THIET_KE_3D': 'Xem Thiết Kế 3D Nhà Xưởng',

    // Filter Section
    'filter_title': 'Bộ Lọc Tìm Kiếm Nâng Cao',
    'filter_btn_hint': 'Chọn xong nhấn Tìm Hàng',
    'filter_desc': 'Lọc nhanh theo từ khóa, kích thước dài x rộng, vị trí bãi kho và loại kết cấu',
    'filter_collapse': 'Thu gọn',
    'filter_expand': 'Mở rộng',
    'filter_keyword_label': 'Từ Khóa Tìm Kiếm',
    'filter_keyword_placeholder': 'VD: Khung Zamil 24x84, thép I300, tôn sàn...',
    'filter_cat_label': 'Danh Mục Sản Phẩm',
    'filter_cat_all': '📦 Tất Cả Danh Mục',
    'filter_loc_label': 'Vị Trí / Bãi Kho',
    'filter_loc_all': '📍 Tất cả khu vực',
    'filter_width_label': 'Chiều Rộng (m)',
    'filter_width_placeholder': 'VD: 24',
    'filter_length_label': 'Chiều Dài (m)',
    'filter_length_placeholder': 'VD: 84',
    'filter_structure_label': 'Kết Cấu Khung Xưởng',
    'filter_structure_all': 'Tất Cả Kết Cấu',
    'filter_crane_label': 'Cẩu Trục',
    'filter_crane_all': 'Tất Cả (Có hoặc Không)',
    'filter_crane_yes': '✅ Bắt Buộc Có Cẩu Trục',
    'filter_crane_no': '❌ Không Có Cẩu Trục',
    'filter_stock_label': 'Trạng Thái Hàng',
    'filter_stock_all': 'Tất cả hàng',
    'filter_stock_in': '🟩 Còn Hàng',
    'filter_stock_out': '🟥 Hết Hàng',
    'filter_reset_btn': 'Xóa hết / Đặt lại',
    'filter_search_btn': 'TÌM HÀNG NGAY',
    'filter_active_label': 'Đang lọc:',
    'filter_clear_all': 'Xóa hết',

    // Listings & Cards
    'feed_title': 'Danh Sách Bài Đăng',
    'feed_count_unit': 'mặt hàng',
    'card_in_stock_yard': 'CÒN HÀNG • Ở BÃI',
    'card_in_stock_site': 'CÒN HÀNG • Ở CÔNG TRÌNH',
    'card_out_of_stock': 'HẾT HÀNG',
    'card_rotate_3d': 'Xoay 3D',
    'card_view_detail': 'Chi tiết',
    'card_call_now': 'Gọi',
    'card_just_posted': 'Vừa đăng',

    // Modal Details
    'modal_video_tab': 'Video Drone (1080p HD)',
    'modal_photo_tab': 'Hình Ảnh Thực Tế',
    'modal_specs_area': 'Quy Cách / Diện Tích',
    'modal_specs_price': 'Giá Niêm Yết',
    'modal_specs_location': 'Vị Trí',
    'modal_specs_hotline': 'Hotline Tư Vấn',
    'modal_view_3d_btn': 'Xem mô hình 3D HTML',
    'modal_close': 'Đóng ✕',
  },
  en: {
    // Header & Navigation
    'brand_subtitle': 'YARD & STEEL TRADING',
    'header_desc': 'South Vietnam Pre-engineered Steel & Industrial Warehouse Portal',
    'hotline_label': 'Yard Hotline: 0965 985 468',
    'realtime_quote': 'Get Real-time Quote',
    'nav_home': 'Home',
    'nav_steel': 'I-Beams',
    'nav_3d': '3D Designs',
    'login': 'Login',
    'logout': 'Logout',
    'saved_list': 'Saved Items',
    'theme_light': 'Light',
    'theme_dark': 'Dark',

    // Hero Banner
    'hero_title': 'Industrial Factory & Steel Trading Portal',
    'hero_badge': 'New Arrivals',
    'hero_sub': 'Zamil Frames, I-Beams, Roofing, Decking, Firefighting Pipes & 3D Drawings in Binh Duong, Lam Dong, Dong Nai',
    'hotline_btn': 'Hotline: 0965 985 468',

    // Horizontal Category Strip
    'cat_header_title': 'PRODUCT CATEGORIES',
    'cat_scroll_hint': 'Swipe to view 8 categories',
    'cat_all': 'All (Latest Listings)',
    'cat_BAN_KHUNG_XUONG': 'Pre-engineered Factories',
    'cat_COT_KEO': 'Steel Columns & Trusses',
    'cat_THEP_HINH_I': 'Structural I-Beams (I200 - I500)',
    'cat_TON_LOP_VACH': 'Roofing & Wall Sheets',
    'cat_TON_SAN_DECK': 'Floor Decking Sheets',
    'cat_ONG_PCCC': 'Fire Fighting Pipes (FP)',
    'cat_THANH_LY_XUONG': 'Factory Liquidation',
    'cat_THIET_KE_3D': 'Interactive 3D Factory Models',

    // Filter Section
    'filter_title': 'Advanced Search Filters',
    'filter_btn_hint': 'Select filters then click Search',
    'filter_desc': 'Filter by keyword, length x width dimensions, yard location and structure type',
    'filter_collapse': 'Collapse',
    'filter_expand': 'Expand',
    'filter_keyword_label': 'Search Keywords',
    'filter_keyword_placeholder': 'E.g. Zamil 24x84, I300 beam, floor deck...',
    'filter_cat_label': 'Product Category',
    'filter_cat_all': '📦 All Categories',
    'filter_loc_label': 'Location / Yard',
    'filter_loc_all': '📍 All Locations',
    'filter_width_label': 'Width (m)',
    'filter_width_placeholder': 'E.g. 24',
    'filter_length_label': 'Length (m)',
    'filter_length_placeholder': 'E.g. 84',
    'filter_structure_label': 'Structure Type',
    'filter_structure_all': 'All Structures',
    'filter_crane_label': 'Overhead Crane',
    'filter_crane_all': 'All (With or Without)',
    'filter_crane_yes': '✅ Crane Required',
    'filter_crane_no': '❌ Without Crane',
    'filter_stock_label': 'Stock Status',
    'filter_stock_all': 'All Items',
    'filter_stock_in': '🟩 In Stock',
    'filter_stock_out': '🟥 Out of Stock',
    'filter_reset_btn': 'Reset All',
    'filter_search_btn': 'SEARCH NOW',
    'filter_active_label': 'Filtering by:',
    'filter_clear_all': 'Clear All',

    // Listings & Cards
    'feed_title': 'Available Listings',
    'feed_count_unit': 'items',
    'card_in_stock_yard': 'IN STOCK • AT YARD',
    'card_in_stock_site': 'IN STOCK • AT SITE',
    'card_out_of_stock': 'OUT OF STOCK',
    'card_rotate_3d': '3D Rotate',
    'card_view_detail': 'Details',
    'card_call_now': 'Call',
    'card_just_posted': 'Just now',

    // Modal Details
    'modal_video_tab': 'Drone Video (1080p HD)',
    'modal_photo_tab': 'Real Photos',
    'modal_specs_area': 'Dimensions / Area',
    'modal_specs_price': 'Listed Price',
    'modal_specs_location': 'Location',
    'modal_specs_hotline': 'Hotline Support',
    'modal_view_3d_btn': 'View 3D HTML Model',
    'modal_close': 'Close ✕',
  },
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = storage.getItem<Language>('app_language', 'vi')
    return saved === 'en' ? 'en' : 'vi'
  })

  useEffect(() => {
    storage.setItem('app_language', language)
  }, [language])

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'vi' ? 'en' : 'vi'))
  }

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
  }

  const t = (key: string): string => {
    const dict = DICTIONARY[language] || DICTIONARY.vi
    return dict[key] || DICTIONARY.vi[key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}
