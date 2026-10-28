# 📡 RESTful API Specification
## Dự án: KCN LAND - Sàn Giao Dịch Nhà Xưởng & BĐS Công Nghiệp

- **Base URL:** `/api/v1`
- **Content-Type:** `application/json`
- **Authentication:** `Authorization: Bearer <JWT_TOKEN>`

---

## 1. Authentication & Users (`/auth`)

### 1.1 Đăng nhập
- **Endpoint:** `POST /api/v1/auth/login`
- **Request Body:**
  ```json
  {
    "email": "admin@nhaxuong.vn",
    "password": "your_secure_password"
  }
  ```
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "d8f9e0a1b2c3...",
      "user": {
        "id": "usr_01",
        "name": "Quản Trị Viên",
        "email": "admin@nhaxuong.vn",
        "role": "admin"
      }
    }
  }
  ```

### 1.2 Đăng ký
- **Endpoint:** `POST /api/v1/auth/register`
- **Request Body:**
  ```json
  {
    "name": "Nguyễn Minh Tuấn",
    "email": "tuan.nguyen@vinaindustry.vn",
    "password": "password123",
    "phone": "0901234567"
  }
  ```

### 1.3 Lấy thông tin tài khoản hiện tại
- **Endpoint:** `GET /api/v1/auth/me`
- **Headers:** `Authorization: Bearer <TOKEN>`

---

## 2. Categories API (`/categories`)

### 2.1 Lấy danh sách danh mục
- **Endpoint:** `GET /api/v1/categories`
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": [
      {
        "code": "SALE",
        "name": "Bán Nhà Xưởng",
        "icon": "Warehouse",
        "desc": "Xưởng tiêu chuẩn, hoàn công đầy đủ, trạm điện riêng",
        "active": true
      },
      {
        "code": "RENT",
        "name": "Cho Thuê Kho Bãi",
        "icon": "Boxes",
        "desc": "Kho logistics, dock leveler, PCCC tự động",
        "active": true
      },
      {
        "code": "KCN_PROJECT",
        "name": "Dự Án Đất KCN",
        "icon": "MapPin",
        "desc": "Đất sạch công nghiệp SKC, hạ tầng đồng bộ",
        "active": true
      }
    ]
  }
  ```

### 2.2 Thêm danh mục mới (Admin)
- **Endpoint:** `POST /api/v1/categories`
- **Request Body:**
  ```json
  {
    "code": "COLD_LOGISTICS",
    "name": "Kho Lạnh Công Nghiệp",
    "icon": "Snowflake",
    "desc": "Kho lạnh âm sâu đạt chuẩn ISO/HACCP"
  }
  ```

### 2.3 Xóa danh mục (Admin)
- **Endpoint:** `DELETE /api/v1/categories/:code`

---

## 3. Properties API - Nhà Xưởng (`/properties`)

### 3.1 Danh sách nhà xưởng (Có bộ lọc & phân trang)
- **Endpoint:** `GET /api/v1/properties`
- **Query Parameters:**
  - `type` (string, optional): `ALL`, `SALE`, `RENT`, `KCN_PROJECT`...
  - `keyword` (string, optional): Tìm theo từ khóa (tiêu đề, mô tả, KCN...)
  - `province` (string, optional): Tên tỉnh/thành (VD: `Bình Dương`)
  - `kcn` (string, optional): Tên KCN (VD: `KCN VSIP 1`)
  - `minPrice` (number, optional): Ngân sách tối thiểu (VNĐ, mặc định `0`)
  - `maxPrice` (number, optional): Ngân sách tối đa (VNĐ, mặc định `150000000000`)
  - `sortBy` (string, optional): `newest`, `price-asc`, `price-desc`
  - `page` (number, optional, default `1`)
  - `pageSize` (number, optional, default `12`)

- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": {
      "items": [
        {
          "id": "prop-1",
          "title": "Bán 12.000m2 Nhà Xưởng Tiêu Chuẩn KCN VSIP 1, Trạm Điện 1.500kVA",
          "type": "SALE",
          "typeDisplay": "Bán Nhà Xưởng",
          "province": "Bình Dương",
          "district": "Thuận An",
          "kcn": "KCN VSIP 1",
          "price": 48000000000,
          "priceDisplay": "48 Tỷ VNĐ",
          "area": "12.000 m2",
          "power": "1.500 kVA",
          "pccc": "Tự Động (Sprinkler)",
          "image": "https://.../thumb.jpg",
          "gallery": ["https://.../img1.jpg", "https://.../img2.jpg"],
          "videoUrl": "https://.../drone-flycam.mp4",
          "audioUrl": "https://.../voiceover-description.mp3",
          "audioDuration": "01:24",
          "desc": "Khuôn viên đất 12.000m2, diện tích xưởng xây dựng 8.000m2...",
          "created": "10:30 28/10/2026",
          "emailNotified": true
        }
      ],
      "total": 52,
      "page": 1,
      "pageSize": 12,
      "totalPages": 5
    }
  }
  ```

### 3.2 Chi tiết 1 bất động sản
- **Endpoint:** `GET /api/v1/properties/:id`

### 3.3 Thêm mới bài đăng nhà xưởng (Admin)
- **Endpoint:** `POST /api/v1/properties`
- **Request Body:**
  ```json
  {
    "title": "Cho Thuê Kho Logistics 10.000m2 KCN Long Đức",
    "type": "RENT",
    "province": "Đồng Nai",
    "district": "Long Thành",
    "kcn": "KCN Long Đức",
    "price": 750000000,
    "area": "10.000 m2",
    "power": "1.000 kVA",
    "pccc": "Tự Động (Sprinkler)",
    "image": "https://.../thumb.jpg",
    "videoUrl": "https://.../video.mp4",
    "audioUrl": "https://.../audio.mp3",
    "desc": "Mô tả chi tiết tải trọng sàn, trần cao...",
    "triggerEmail": true
  }
  ```

### 3.4 Cập nhật nhà xưởng (Admin)
- **Endpoint:** `PUT /api/v1/properties/:id`

### 3.5 Xóa nhà xưởng (Admin)
- **Endpoint:** `DELETE /api/v1/properties/:id`

---

## 4. Media Uploads API (`/uploads`)

- `POST /api/v1/uploads/image`: Upload ảnh bài viết / gallery (JPEG, PNG, WebP)
- `POST /api/v1/uploads/audio`: Upload tệp âm thanh thuyết minh (.mp3, .wav, .m4a)
- `POST /api/v1/uploads/video`: Upload tệp video flycam drone (.mp4, .webm)

---

## 5. Subscribers & Newsletter API (`/subscribers`)

### 5.1 Đăng ký nhận tin mới (Khách Hàng)
- **Endpoint:** `POST /api/v1/subscribers`
- **Request Body:**
  ```json
  {
    "name": "Nguyễn Minh Tuấn",
    "email": "tuan.nguyen@gmail.com",
    "phone": "0901234567"
  }
  ```

### 5.2 Danh sách người theo dõi (Admin)
- **Endpoint:** `GET /api/v1/subscribers`

---

## 6. Homepage Notices & Ticker (`/notices`)

- `GET /api/v1/notices`: Lấy danh sách thông báo popup sự kiện
- `POST /api/v1/notices`: Đăng thông báo mới (Admin)
- `DELETE /api/v1/notices/:id`: Gỡ thông báo (Admin)
- `GET /api/v1/notices/ticker`: Lấy chuỗi chữ chạy Notice Ticker Bar
- `PUT /api/v1/notices/ticker`: Cập nhật nội dung chữ chạy Notice Ticker Bar
