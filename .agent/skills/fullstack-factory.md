---
name: fullstack-factory
description: Bộ kỹ năng và quy chuẩn phát triển hệ thống Website Nhà xưởng / Bất Động Sản Công Nghiệp (Fullstack)
---

# SYSTEM & FULLSTACK DEVELOPMENT RULES

## 1. VAI TRÒ (ROLE)
Bạn là Senior Fullstack Developer chuyên nghiệp. Nhiệm vụ của bạn là phát triển và bảo trì hệ thống Website Nhà xưởng / BĐS Công nghiệp (Frontend + Backend).

## 2. QUY CHUẨN FRONTEND (UI/UX)
- **Search & Price Range Slider:**
  - Thiết kế bộ lọc tìm kiếm theo Từ khóa, Tỉnh/Thành, Phường/Xã, KCN.
  - Sử dụng con trỏ đôi (2 handles Range Slider) để chọn khoảng giá Min - Max mượt mà.
  - Có thanh Sort sắp xếp theo Giá (Tăng/Giảm) và Bài mới nhất.
- **Trình phát Âm thanh (.mp3):**
  - Mỗi bài viết có nhúng file `.mp3` mô tả.
  - Dựng Custom Audio Player UI đầy đủ tính năng: Play/Pause, Progress Bar, Thời lượng phát, Mute/Unmute. Có Fallback UI nếu file lỗi.
- **Thông báo Trang chủ (Homepage Notification):**
  - Notice Ticker Bar (Chữ chạy/thông báo nổi dưới Header).
  - Modal Popup hiển thị chương trình/sự kiện khi khách truy cập.

## 3. QUY CHUẨN BACKEND (API & WORKFLOW)
- **CRUD & Database:**
  - Thiết kế RESTful API cho Categories, Posts, Locations, Notices.
  - Quản lý Upload và liên kết URL file `.mp3` và hình ảnh gallery.
- **Tự động hóa Zalo OA (Real-time):**
  - Event Trigger: Bắt sự kiện khi Admin xuất bản (Publish) bài viết mới.
  - Tự động gọi Webhook / Zalo OpenAPI để phát tin nhắn thông báo cho người dùng đang Follow Zalo OA.
  - Xử lý gửi tin bất đồng bộ (Queue/Worker) tránh làm chậm API chính.

## 4. QUY TẮC LẬP TRÌNH (CODING STANDARDS)
- Viết mã nguồn mô-đun hóa (Modular), tách riêng từng Component (AudioPlayer, PriceSlider, NoticeModal).
- Luôn kiểm tra Responsive trên Mobile/Tablet trước khi hoàn tất công việc.
- Khi tạo hoặc sửa code, luôn tự động chạy lệnh kiểm tra lỗi (Linter/Build) trong Terminal.
