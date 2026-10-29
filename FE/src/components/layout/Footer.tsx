import {
  Factory,
  PhoneCall,
  Mail,
  MapPin,
  ShieldCheck,
  Building2,
  FileText,
  Clock,
  ArrowRight,
} from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
      {/* Upper Info Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1 & 2: Brand & Introduction */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-teal-400 border border-slate-800 shadow-md">
                <Factory className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  NHAXUONG<span className="text-teal-600 dark:text-teal-400">.VN</span>
                </span>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Sàn Giao Dịch Bất Động Sản Công Nghiệp Toàn Quốc
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Cổng thông tin chuyên biệt kết nối doanh nghiệp sản xuất, logistics và nhà đầu tư FDI
              với nguồn cung nhà xưởng xây sẵn, kho bãi tiêu chuẩn và quỹ đất công nghiệp SKC đã
              nghiệm thu PCCC trên khắp 63 tỉnh thành.
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>
                  <b>Trụ Sở Chính:</b> Tòa Nhà Landmark 81, Nguyễn Hữu Cảnh, P. 22, Q. Bình Thạnh,
                  TP. Hồ Chí Minh
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <PhoneCall className="w-4 h-4 text-teal-600 shrink-0" />
                <span>
                  Hotline Hỗ Trợ 24/7: <b className="text-teal-600 dark:text-teal-400">090 123 4567</b> /{' '}
                  <b>(028) 3888 9999</b>
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Mail className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Email Tư Vấn & CSKH: contact@nhaxuong.vn</span>
              </div>
            </div>
          </div>

          {/* Col 3: Danh Mục BĐS */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Bất Động Sản Công Nghiệp
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li className="hover:text-teal-600 dark:hover:text-teal-400 cursor-pointer flex items-center gap-1.5">
                <ArrowRight className="w-3 h-3 text-teal-500" /> Bán Nhà Xưởng Tiêu Chuẩn
              </li>
              <li className="hover:text-teal-600 dark:hover:text-teal-400 cursor-pointer flex items-center gap-1.5">
                <ArrowRight className="w-3 h-3 text-teal-500" /> Cho Thuê Kho Logistics & CFS
              </li>
              <li className="hover:text-teal-600 dark:hover:text-teal-400 cursor-pointer flex items-center gap-1.5">
                <ArrowRight className="w-3 h-3 text-teal-500" /> Chuyển Nhượng Đất KCN (SKC)
              </li>
              <li className="hover:text-teal-600 dark:hover:text-teal-400 cursor-pointer flex items-center gap-1.5">
                <ArrowRight className="w-3 h-3 text-teal-500" /> Kho Lạnh & Kho Mát Âm Sâu
              </li>
              <li className="hover:text-teal-600 dark:hover:text-teal-400 cursor-pointer flex items-center gap-1.5">
                <ArrowRight className="w-3 h-3 text-teal-500" /> Nhà Xưởng Xây Sẵn FDI (RBF)
              </li>
            </ul>
          </div>

          {/* Col 4: Khu Vực Trọng Điểm */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Khu Vực KCN Trọng Điểm
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li className="hover:text-teal-600 dark:hover:text-teal-400 cursor-pointer">
                Kho Xưởng Bình Dương (VSIP, Sóng Thần)
              </li>
              <li className="hover:text-teal-600 dark:hover:text-teal-400 cursor-pointer">
                Kho Bãi Đồng Nai (Long Đức, Amata)
              </li>
              <li className="hover:text-teal-600 dark:hover:text-teal-400 cursor-pointer">
                Đất KCN Long An (Hải Sơn, Long Hậu)
              </li>
              <li className="hover:text-teal-600 dark:hover:text-teal-400 cursor-pointer">
                Kho Xưởng Hải Phòng (Đình Vũ, Nam Cầu Kiền)
              </li>
              <li className="hover:text-teal-600 dark:hover:text-teal-400 cursor-pointer">
                Nhà Xưởng Bắc Ninh (Yên Phong, Quế Võ)
              </li>
            </ul>
          </div>

          {/* Col 5: Dịch Vụ & Pháp Lý BĐS */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Dịch Vụ BĐS Doanh Nghiệp
            </h4>
            <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <b className="text-slate-800 dark:text-slate-200 block mb-0.5">Thẩm Định & Pháp Lý:</b>
                <span>Hỗ trợ tra cứu quy hoạch KCN, hoàn công PCCC và cấp sổ hồng SKC.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                <b className="text-slate-800 dark:text-slate-200 block mb-0.5">Tư Vấn Đầu Tư FDI:</b>
                <span>Cấp chứng nhận IRC, ERC và thủ tục pháp lý môi trường nhanh chóng.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-100 bg-slate-50 py-4 px-6 text-center text-xs text-slate-500 dark:border-slate-900 dark:bg-slate-900/60 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} NHAXUONG.VN - Bản quyền thuộc Công Ty Cổ Phần BĐS Công Nghiệp Nhà Xưởng Việt Nam.</p>
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
