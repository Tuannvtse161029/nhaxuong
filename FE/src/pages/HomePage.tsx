import {
  Factory,
  Warehouse,
  Mail,
  Box,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Headphones,
  ShieldCheck,
  Building2,
  TrendingUp,
  FileCheck2,
  MapPin,
  PhoneCall,
  CheckCircle2,
  Award,
} from 'lucide-react'
import { useProperties } from '@/context/PropertyContext'
import { PropertyFilterBar } from '@/components/search/PropertyFilterBar'
import { PropertyCard } from '@/components/property/PropertyCard'
import { PropertyDetailModal } from '@/components/property/PropertyDetailModal'
import { Warehouse3DModal } from '@/components/three/Warehouse3DModal'
import { SavedPropertiesModal } from '@/components/saved/SavedPropertiesModal'
import { NoticeModal } from '@/components/notice/NoticeModal'
import { SubscribeNewsletterModal } from '@/components/subscribe/SubscribeNewsletterModal'

export function HomePage() {
  const {
    filteredProperties,
    resetFilters,
    activeModal,
    selectedProperty,
    closeModal,
    openSubscribeModal,
    open3DModal,
    properties,
    setFilterState,
  } = useProperties()

  const featuredKcnZones = [
    {
      name: 'KCN VSIP 1 & 2',
      province: 'Bình Dương',
      count: '450+ xưởng',
      img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80',
      tag: 'KCN Kiểu Mẫu FDI',
    },
    {
      name: 'KCN Sóng Thần 1 & 2',
      province: 'Bình Dương',
      count: '320+ xưởng',
      img: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&q=80',
      tag: 'Hub Logistics Phía Nam',
    },
    {
      name: 'KCN Long Đức & Amata',
      province: 'Đồng Nai',
      count: '280+ xưởng',
      img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
      tag: 'Gần Sân Bay Long Thành',
    },
    {
      name: 'KCN Yên Phong & Quế Võ',
      province: 'Bắc Ninh',
      count: '390+ xưởng',
      img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80',
      tag: 'Trung Tâm Điện Tử FDI',
    },
  ]

  return (
    <div className="space-y-12 pb-8">
      {/* 1. HERO BANNER CHUẨN SÀN GIAO DỊCH BẤT ĐỘNG SẢN CÔNG NGHIỆP */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 p-6 sm:p-10 lg:p-12 text-white shadow-2xl border border-slate-800">
        {/* Subtle Architectural Grid Lines */}
        <div className="pointer-events-none absolute -right-10 -bottom-10 opacity-5">
          <Factory className="h-[450px] w-[450px] text-teal-300" />
        </div>

        <div className="relative z-10 max-w-4xl">
          {/* Badge BĐS Sàn Giao Dịch */}
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-bold text-teal-300 backdrop-blur-md mb-4 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-teal-400 animate-ping" />
            <span>SÀN GIAO DỊCH BẤT ĐỘNG SẢN CÔNG NGHIỆP VIỆT NAM (NHAXUONG.VN)</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight font-sans">
            Mua Bán, Cho Thuê Nhà Xưởng & Đất Khu Công Nghiệp Chuẩn FDI
          </h1>

          <p className="mt-3 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Nền tảng tra cứu và giao dịch kho xưởng hàng đầu với công nghệ <b>Mô hình 3D Tour 360°</b>,{' '}
            <b>Audio thuyết minh (.mp3)</b> và <b>Video Flycam 1080p</b>. Toàn bộ tin đăng đã được thẩm định
            pháp lý <b>Sổ hồng SKC</b> và <b>Nghiệm thu PCCC</b>.
          </p>

          {/* Real Estate Market Statistics Bar */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 px-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Nguồn Cung Xưởng</span>
              <b className="text-base sm:text-lg font-black text-white">2.500+</b>
              <span className="text-[10px] text-teal-400 block">Đang hoạt động</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Khu Công Nghiệp</span>
              <b className="text-base sm:text-lg font-black text-white">418+ KCN</b>
              <span className="text-[10px] text-teal-400 block">Toàn quốc</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Pháp Lý & PCCC</span>
              <b className="text-base sm:text-lg font-black text-emerald-400">100%</b>
              <span className="text-[10px] text-emerald-400 block">Kiểm duyệt SKC</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Doanh Nghiệp FDI</span>
              <b className="text-base sm:text-lg font-black text-amber-400">3.600+</b>
              <span className="text-[10px] text-amber-400 block">Đang kết nối</span>
            </div>
          </div>

          {/* Quick Actions Strip */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const firstProp = properties[0]
                if (firstProp) open3DModal(firstProp)
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg hover:bg-teal-700 transition"
            >
              <Box className="w-4 h-4 text-amber-300" />
              <span>Xem Thử Mô Hình 3D Xoay 360°</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={openSubscribeModal}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-200 hover:bg-slate-800 backdrop-blur-md transition"
            >
              <Mail className="w-4 h-4 text-teal-400" />
              <span>Đăng Ký Nhận Báo Cáo Thị Trường BĐS</span>
            </button>
          </div>
        </div>

        {/* 2. Bộ Lọc Tìm Kiếm BĐS Công Nghiệp (Search & Filter Bar) */}
        <div className="mt-8">
          <PropertyFilterBar />
        </div>
      </div>

      {/* 2. DANH SÁCH BẤT ĐỘNG SẢN CÔNG NGHIỆP ĐANG MỞ BÁN & CHO THUÊ */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-100 text-teal-800 text-xs font-black dark:bg-teal-950 dark:text-teal-300">
                ★
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Mặt Bằng Nhà Xưởng & Kho Bãi Đang Niêm Yết
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Hiển thị <b className="text-slate-900 dark:text-white">{filteredProperties.length}</b> bất động sản
              công nghiệp phù hợp với tiêu chí của bạn
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 font-bold text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
              <Box className="w-3.5 h-3.5 text-amber-600" />
              <span>Mô Hình 3D HTML</span>
            </span>
            <span className="flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-2.5 py-1 font-bold text-teal-800 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-300">
              <Headphones className="w-3.5 h-3.5 text-teal-600" />
              <span>Audio .mp3</span>
            </span>
            <span className="hidden sm:flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-bold text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Nghiệm Thu PCCC</span>
            </span>
          </div>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
              <Warehouse className="h-8 w-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              Không tìm thấy nhà xưởng nào trong khoảng giá hoặc khu vực này!
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Hãy thử nới rộng khoảng giá trên thanh trượt kép Range Slider hoặc chọn lại Khu Công Nghiệp khác.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-teal-700 px-4 py-2 text-xs font-bold text-white transition hover:bg-teal-800"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xóa Bộ Lọc & Tìm Lại</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. SECTION BĐS: TOP KHU CÔNG NGHIỆP TRỌNG ĐIỂM THU HÚT ĐẦU TƯ */}
      <div className="space-y-5 pt-6 border-t border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-teal-600" />
              Top Khu Công Nghiệp Trọng Điểm Đang Có Nguồn Cung Xưởng Tốt
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Các cụm KCN sở hữu hạ tầng giao thông kết nối cao tốc, cảng biển nước sâu và sân bay quốc tế.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredKcnZones.map((zone) => (
            <div
              key={zone.name}
              onClick={() => setFilterState({ province: zone.province })}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={zone.img}
                  alt={zone.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-2.5 left-2.5 rounded-md bg-slate-950/80 px-2 py-0.5 text-[9.5px] font-bold text-teal-400 backdrop-blur-md">
                  {zone.tag}
                </span>
                <span className="absolute bottom-2.5 right-2.5 rounded-md bg-teal-700/90 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                  {zone.count}
                </span>
              </div>
              <div className="p-3.5">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-teal-600 transition">
                  {zone.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-red-500" /> {zone.province}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. SECTION BĐS: QUY CHUẨN GIAO DỊCH & DỊCH VỤ PHÁP LÝ NHÀ XƯỞNG */}
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-teal-50/40 p-6 sm:p-10 dark:border-slate-800 dark:bg-slate-900/60 dark:from-slate-900 dark:to-slate-950">
        <div className="max-w-3xl mb-8">
          <span className="text-xs font-black uppercase tracking-wider text-teal-700 dark:text-teal-400">
            Quy Trình Chuẩn BĐS Công Nghiệp
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            4 Bước Đầu Tư & Thuê Nhà Xưởng An Toàn Tại NHAXUONG.VN
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
            Chúng tôi đồng hành cùng các tập đoàn sản xuất, doanh nghiệp FDI từ bước khảo sát không gian
            cho đến hoàn tất thủ tục pháp lý đầu tư.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-850">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-100 text-teal-800 font-black text-sm mb-3 dark:bg-teal-950 dark:text-teal-300">
              01
            </span>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Khảo Sát 3D & Flycam</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Trải nghiệm mô hình 3D xoay 360°, nghe audio mô tả và xem video toàn cảnh trước khi đi thực địa.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-850">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-800 font-black text-sm mb-3 dark:bg-blue-950 dark:text-blue-300">
              02
            </span>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Thẩm Định Pháp Lý & PCCC</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Kiểm tra chi tiết Sổ hồng SKC, hồ sơ hoàn công, thẩm duyệt thiết kế và nghiệm thu PCCC tự động.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-850">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 font-black text-sm mb-3 dark:bg-emerald-950 dark:text-emerald-300">
              03
            </span>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Đàm Phán & Công Chứng</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Thương lượng đơn giá tốt nhất trực tiếp với chủ đầu tư và ký kết hợp đồng công chứng hợp pháp.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-850">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-800 font-black text-sm mb-3 dark:bg-amber-950 dark:text-amber-300">
              04
            </span>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Hỗ Trợ Giấy Phép FDI</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Tư vấn cấp chứng nhận đăng ký đầu tư (IRC), đăng ký doanh nghiệp (ERC) và giấy phép môi trường.
            </p>
          </div>
        </div>
      </div>

      {/* 5. CALL TO ACTION: DÀNH CHO KHÁCH HÀNG TÌM KIẾM MUA / THUÊ KHO XƯỞNG */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2 max-w-xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 block">
            Tư Vấn Mua Bán & Thuê Mặt Bằng Sản Xuất
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            Bạn Cần Tìm Mặt Bằng Nhà Xưởng Đúng Nhu Cầu?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Liên hệ ngay với đội ngũ chuyên gia của <b>NHAXUONG.VN</b> để nhận danh sách mặt bằng trống,
            bảng báo giá chi tiết, hồ sơ hoàn công PCCC và được hỗ trợ xe đưa đón khảo sát thực tế miễn phí.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
          <button
            type="button"
            onClick={openSubscribeModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-teal-700 transition"
          >
            <Mail className="w-4 h-4" />
            <span>Liên Hệ Nhận Báo Giá Ngay</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="tel:0901234567"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700 transition"
          >
            <PhoneCall className="w-4 h-4 text-teal-400" />
            <span>Hotline: 090 123 4567</span>
          </a>
        </div>
      </div>

      {/* Global Modals */}
      <PropertyDetailModal
        isOpen={activeModal === 'detail'}
        onClose={closeModal}
        property={selectedProperty}
      />

      <Warehouse3DModal
        isOpen={activeModal === '3d'}
        onClose={closeModal}
        property={selectedProperty}
      />

      <SavedPropertiesModal isOpen={activeModal === 'saved'} onClose={closeModal} />
      <NoticeModal isOpen={activeModal === 'notice'} onClose={closeModal} />
      <SubscribeNewsletterModal isOpen={activeModal === 'subscribe'} onClose={closeModal} />
    </div>
  )
}
