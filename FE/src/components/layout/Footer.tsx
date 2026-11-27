import {
  Factory,
  PhoneCall,
  Mail,
  MapPin,
  ArrowRight,
  Warehouse,
  Layers,
  Grid,
  FileText,
  LayoutGrid,
  ShieldAlert,
  Truck,
  Box,
} from 'lucide-react'
import { useProperties } from '@/context/PropertyContext'
import { useNavigate } from 'react-router-dom'

export function Footer() {
  const { setFilterState } = useProperties()
  const navigate = useNavigate()

  const footerCategories = [
    { code: 'BAN_KHUNG_XUONG', name: 'Bán Khung Nhà Xưởng', icon: Warehouse, desc: 'Khung Zamil, tiền chế vượt nhịp 18m - 60m' },
    { code: 'COT_KEO', name: 'Cột Kèo & Dầm Thép', icon: Layers, desc: 'Cột dầm H, I, kèo thép, xà gồ C & Z' },
    { code: 'THEP_HINH_I', name: 'Thép Hình I (I 200, I 300, I 500)', icon: Grid, desc: 'Thép đúc Posco, An Khánh I 200 - I 500' },
    { code: 'TON_LOP_VACH', name: 'Tôn (Tôn Lợp & Tôn Vách)', icon: FileText, desc: 'Tôn sóng vuông mạ kẽm, tôn PU chống nóng' },
    { code: 'TON_SAN_DECK', name: 'Tôn Sàn (Decking)', icon: LayoutGrid, desc: 'Tôn sàn Decking H50W1000 dày 0.75 - 1.2mm' },
    { code: 'ONG_PCCC', name: 'Ống Phòng Cháy Chữa Cháy (PCCC)', icon: ShieldAlert, desc: 'Ống thép PCCC D90, D114, D168 mạ kẽm' },
    { code: 'THANH_LY_XUONG', name: 'Thanh Lý Trọn Gói Nhà Xưởng', icon: Truck, desc: 'Thanh lý xác xưởng cũ, dọn dẹp mặt bằng' },
    { code: 'THIET_KE_3D', name: 'Xem Thiết Kế 3D Nhà Xưởng', icon: Box, desc: 'Mô hình 3D xoay 360° & tra cứu kích thước' },
  ]

  const handleCategoryClick = (categoryCode: string) => {
    navigate('/')
    setFilterState({ type: categoryCode as any, keyword: '', categoryId: undefined })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
      {/* Upper Info Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Left: Brand & Contact Info (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-teal-400 border border-slate-800 shadow-md shrink-0">
                <Factory className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  NHAXUONG<span className="text-teal-600 dark:text-teal-400">.VN</span>
                </span>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Tổng Kho Khung Xưởng & Sắt Thép Miền Nam
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Sàn giao dịch và thanh lý kết cấu nhà xưởng tiền chế, dầm thép I 200/I 300/I 500, tôn sàn decking, ống PCCC và bản vẽ thiết kế 3D. Hỗ trợ bốc xếp, cẩu hạ và vận chuyển tận chân công trình tại Bình Dương, Dĩ An, Lâm Đồng và các tỉnh lân cận.
            </p>

            <div className="space-y-2.5 text-xs pt-1">
              <div className="flex items-start gap-2.5 text-slate-600 dark:text-slate-300">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>
                  <b>Tổng Kho & Bãi Tập Kết:</b> Bãi ICD Tân Cảng, P. Bình Thắng, TP. Dĩ An, Bình Dương • Bãi Kho TP. Bảo Lộc, Lâm Đồng
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                <PhoneCall className="w-4 h-4 text-teal-600 shrink-0" />
                <span>
                  Hotline Trực Tiếp: <a href="tel:0965985468" className="text-teal-600 dark:text-teal-400 font-bold hover:underline">0965 985 468</a>
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                <Mail className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Email Hỗ Trợ: contact@nhaxuong.vn</span>
              </div>
            </div>
          </div>

          {/* Right: Danh Mục Sản Phẩm (7 cols) - Thay thế toàn bộ KCN Trọng Điểm & Dịch Vụ */}
          <div className="lg:col-span-7 space-y-3.5">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center justify-between">
                <span>Danh Mục Sản Phẩm & Kết Cấu Nhà Xưởng</span>
                <span className="text-[10px] font-normal text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-2 py-0.5 rounded-full">
                  Bấm để lọc hàng
                </span>
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {footerCategories.map((cat) => {
                const IconComponent = cat.icon
                return (
                  <button
                    key={cat.code}
                    type="button"
                    onClick={() => handleCategoryClick(cat.code)}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-teal-50/60 hover:border-teal-300 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-800 dark:hover:border-teal-500/50 transition group text-left cursor-pointer"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-2xs border border-slate-200 dark:border-slate-700 shrink-0 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors flex items-center justify-between">
                        <span className="truncate">{cat.name}</span>
                        <ArrowRight className="w-3 h-3 text-slate-300 dark:text-slate-600 group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                      </div>
                      <p className="text-[10.5px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                        {cat.desc}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-100 bg-slate-50 py-4 px-6 text-center text-xs text-slate-500 dark:border-slate-900 dark:bg-slate-900/60 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} NHAXUONG.VN - Bản quyền thuộc Công Ty Cổ Phần Nhà Xưởng Việt Nam.</p>
          <div className="flex items-center gap-4 text-[11px] font-medium">
            <span className="hover:text-teal-600 transition-colors cursor-pointer">Quy chế hoạt động sàn</span>
            <span>•</span>
            <span className="hover:text-teal-600 transition-colors cursor-pointer">Chính sách bảo mật</span>
            <span>•</span>
            <span className="hover:text-teal-600 transition-colors cursor-pointer">Hướng Dẫn Mua & Thuê Xưởng</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
