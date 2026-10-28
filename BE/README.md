# 🏭 Backend Architecture - Nhaxuong
## Cấu Trúc Giải Pháp 4 Tầng (.NET Clean Architecture Scaffolding)

Cấu trúc thư mục Backend được khởi tạo theo chuẩn kiến trúc phân tầng (Multi-project Clean Architecture Solution). 

Toàn bộ hệ sinh thái thư mục, tệp cấu hình giải pháp ([`Nhaxuong.sln`](file:///d:/Nh%C3%A0%20X%C6%B0%E1%BB%9Fng/BE/Nhaxuong.sln)), các tệp định nghĩa dự án (`.csproj`), cấu hình môi trường chạy (`launchSettings.json`), cấu hình Docker và tệp cấu hình kết nối Database ([`appsettings.json`](file:///d:/Nh%C3%A0%20X%C6%B0%E1%BB%9Fng/BE/Nhaxuong.API/appsettings.json)) đã được chuẩn hóa. Không chứa mã nguồn nghiệp vụ thừa, cấu trúc sạch 100%.

---

## 📁 Sơ Đồ Cấu Trúc Thư Mục Backend

```text
BE/
├── Nhaxuong.sln                      # File giải pháp tổng (.NET Solution)
├── Dockerfile                        # Cấu hình containerization cho Nhaxuong.API
├── .dockerignore / .gitignore        # Cấu hình loại trừ file build tạm
│
├── Nhaxuong.API/                     # Presentation Layer (API Host & Controllers)
│   ├── Nhaxuong.API.csproj           # Khai báo packages: JWT Bearer, Swagger, EF Core Design...
│   ├── Nhaxuong.API.http             # File kiểm tra nhanh HTTP request
│   ├── appsettings.json              # File cấu hình Database ConnectionStrings, JWT, Email...
│   ├── appsettings.Example.json      # File mẫu cấu hình tham chiếu
│   ├── CONTROLLER/                   # Thư mục chứa các API Controller
│   ├── HostedServices/               # Background Services / Worker Queue
│   ├── Hubs/                         # Real-time WebSocket / SignalR Hubs
│   ├── Interceptors/                 # Logging, Auditing & Exception Interceptors
│   ├── Properties/
│   │   └── launchSettings.json       # Cấu hình cổng chạy Ports (5152 / 7290)
│   └── Services/                     # Dịch vụ cục bộ thuộc API host
│
├── Nhaxuong.MODEL/                   # Domain & Data Layer (Entities & EF Core Context)
│   ├── Nhaxuong.MODELS.csproj        # Khai báo Microsoft.EntityFrameworkCore.SqlServer
│   ├── Configurations/               # Fluent API Entity Type Configurations
│   ├── Entities/                     # Models Entity (Property, User, Category, Notice...)
│   └── Migrations/                   # EF Core Code-First Database Migrations
│
├── Nhaxuong.REPO/                    # Persistence Layer (Repository Pattern)
│   ├── Nhaxuong.REPOSITORIES.csproj  # Phụ thuộc vào Nhaxuong.MODEL
│   ├── Interfaces/                   # Interface cho các Repositories
│   └── PAGINATION/                   # Pagination Helpers & PageList Models
│
├── Nhaxuong.SERVICE/                 # Business Logic Layer (Services & DTOs)
│   ├── Nhaxuong.SERVICES.csproj      # AutoMapper, BCrypt, MailKit, JWT Tokens...
│   ├── DTOs/
│   │   ├── Request/                  # DTOs nhận vào từ client
│   │   └── Response/                 # DTOs trả về cho client
│   ├── ExternalServices/             # Tích hợp dịch vụ bên ngoài (Email, Cloud Storage...)
│   ├── Interfaces/                   # Interface cho các Business Services
│   └── Mapping/                      # AutoMapper Profiles
│
└── docs/                             # Tài liệu đặc tả kỹ thuật dự án Nhà Xưởng
    ├── API_SPECIFICATION.md          # Chi tiết toàn bộ endpoints RESTful API
    ├── DATABASE_SCHEMA.sql           # Schema SQL hoàn chỉnh
    ├── prisma.schema                 # Mô hình dữ liệu ORM tham chiếu
    └── ENV_EXAMPLE.env               # Cấu hình biến môi trường
```

---

## 🔌 Cấu Hình Kết Nối Cơ Sở Dữ Liệu (`appsettings.json`)

Tệp [`Nhaxuong.API/appsettings.json`](file:///d:/Nh%C3%A0%20X%C6%B0%E1%BB%9Fng/BE/Nhaxuong.API/appsettings.json) đã được chuẩn hóa:
- **ConnectionStrings**: Chuỗi kết nối Database `DefaultConnection`.
- **Jwt**: Khóa bảo mật `Key`, `Issuer: Nhaxuong`, `Audience: NhaxuongUsers`, `ExpireMinutes`.
- **EmailSettings**: Cấu hình SMTP Gmail thông báo bản tin.
- **AI Settings**: Gemini & OpenAI API Configuration (nếu cần xử lý tóm tắt hoặc sinh mô tả tự động).
