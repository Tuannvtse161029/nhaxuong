# 🏭 Nhà Xưởng - Front-End React Architecture

Sườn dự án mẫu Front-End (FE) chuẩn hóa, hiện đại và sẵn sàng tích hợp với bất kỳ dự án nào (quản lý nhà xưởng, ERP, kho bãi, IoT, dashboard giám sát...).

---

## 🚀 Công Nghệ Sử Dụng (Tech Stack)

- **Core**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6/8](https://vitejs.dev/) (Build siêu tốc, HMR tức thì)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + `@tailwindcss/vite`
- **Routing**: [React Router DOM v7](https://reactrouter.com/) (Hỗ trợ Protected Routes & Public Routes)
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/) (Interceptors gắn JWT token, auto redirect khi hết hạn phiên)
- **State Management**: React Context (`AuthContext`, `ThemeContext` Dark/Light)

---

## 📁 Cấu Trúc Thư Mục (Project Structure)

```text
FE/
├── .env                  # Cấu hình biến môi trường cục bộ
├── .env.example          # Mẫu biến môi trường
├── index.html            # File HTML gốc
├── package.json          # Danh sách thư viện và scripts
├── tsconfig.app.json     # Cấu hình TypeScript cho App (Alias @/* -> src/*)
├── vite.config.ts        # Cấu hình Vite & Tailwind v4
└── src/
    ├── api/              # Tầng gọi API Backend
    │   ├── axiosClient.ts      # Axios instance kèm Interceptors & Bearer Token
    │   ├── endpoints.ts        # Quản lý tập trung các URL endpoint
    │   └── authApi.ts          # Service mẫu (Đăng nhập, Đăng ký, Lấy thông tin user)
    ├── assets/           # Tài nguyên tĩnh (ảnh, logo, svg)
    ├── components/       # Các components tái sử dụng
    │   ├── common/             # UI nguyên tử: Button, Input, Card, Modal, Table, Badge...
    │   └── layout/             # Header, Sidebar, Footer
    ├── config/           # Cấu hình tĩnh
    │   ├── env.config.ts       # Wrapper biến môi trường type-safe
    │   └── navigation.config.ts# Cấu hình menu điều hướng Sidebar
    ├── context/          # Quản lý trạng thái toàn cục (React Context)
    │   ├── AuthContext.tsx     # Quản lý đăng nhập, phiên làm việc, thông tin user
    │   └── ThemeContext.tsx    # Chuyển đổi giao diện Sáng / Tối (Dark mode)
    ├── hooks/            # Custom Hooks tiện ích
    │   ├── useAuth.ts          # Hook truy cập AuthContext
    │   ├── useTheme.ts         # Hook truy cập ThemeContext
    │   ├── useDebounce.ts      # Hook tối ưu tìm kiếm theo thời gian thực
    │   └── useLocalStorage.ts  # Hook đồng bộ state với LocalStorage
    ├── layouts/          # Khung trang giao diện
    │   ├── MainLayout.tsx      # Khung chính cho các trang quản trị (Sidebar + Header + Content)
    │   └── AuthLayout.tsx      # Khung thẻ căn giữa cho Đăng nhập / Đăng ký
    ├── pages/            # Các màn hình chức năng
    │   ├── auth/               # LoginPage.tsx
    │   ├── dashboard/          # DashboardPage.tsx (Chỉ số vận hành, biểu đồ, nhật ký)
    │   ├── items/              # ItemsPage.tsx (Mẫu CRUD hoàn chỉnh: Tìm kiếm, lọc, modal thêm/sửa, bảng dữ liệu)
    │   ├── profile/            # ProfilePage.tsx (Xem & cập nhật thông tin cá nhân)
    │   ├── reports/            # ReportsPage.tsx (Báo cáo & thống kê)
    │   ├── settings/           # SettingsPage.tsx (Cài đặt hệ thống & giao diện)
    │   └── errors/             # NotFoundPage.tsx (Trang lỗi 404)
    ├── routes/           # Định tuyến ứng dụng
    │   ├── AppRoutes.tsx       # Cấu hình Router tổng
    │   ├── ProtectedRoute.tsx  # Chặn truy cập nếu chưa đăng nhập
    │   └── PublicRoute.tsx     # Chuyển hướng về Dashboard nếu đã đăng nhập
    ├── types/            # Khai báo TypeScript types / interfaces
    │   ├── api.types.ts        # ApiResponse, PaginatedResponse
    │   ├── auth.types.ts       # User, LoginCredentials, AuthResponse
    │   └── common.types.ts     # TableColumn, SelectOption, BreadcrumbItem
    ├── utils/            # Hàm tiện ích dùng chung
    │   ├── cn.ts               # Merge class Tailwind CSS an toàn
    │   ├── formatters.ts       # Format tiền tệ VNĐ/USD, ngày tháng năm
    │   └── storage.ts          # Thao tác an toàn với LocalStorage
    ├── App.tsx           # Component gốc tích hợp các Providers
    ├── main.tsx          # Điểm khởi chạy của ứng dụng
    └── index.css         # Import Tailwind CSS và font chữ toàn cục
```

---

## 🏃 Hướng Dẫn Chạy Dự Án

### 1. Cài đặt thư viện:
```bash
cd FE
npm install
```

### 2. Chạy môi trường phát triển (Dev server):
```bash
npm run dev
```
Mở trình duyệt tại: `http://localhost:5173`

### 3. Đăng nhập thử nghiệm:
- **Email:** `admin@nhaxuong.vn`
- **Mật khẩu:** `123456`
*(Hệ thống đã bật sẵn chế độ `VITE_USE_MOCK_API=true` trong file `.env` giúp bạn xem thử và thao tác toàn bộ giao diện mà không cần khởi động backend).*

### 4. Build sản phẩm (Production):
```bash
npm run build
```

---

## 🔌 Hướng Dẫn Kết Nối Backend Thực Tế

Khi bạn đã có Backend trong thư mục `BE/`:
1. Mở file [`.env`](file:///d:/Nh%C3%A0%20X%C6%B0%E1%BB%9Fng/FE/.env):
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_USE_MOCK_API=false
   ```
2. Thêm các URL endpoint vào [`src/api/endpoints.ts`](file:///d:/Nh%C3%A0%20X%C6%B0%E1%BB%9Fng/FE/src/api/endpoints.ts).
3. Tạo các file service trong `src/api/` (tương tự như `authApi.ts`) để gọi backend thông qua `axiosClient`.
