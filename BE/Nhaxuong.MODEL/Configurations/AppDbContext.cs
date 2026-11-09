using Microsoft.EntityFrameworkCore;
using Nhaxuong.MODEL.Entities;

namespace Nhaxuong.MODEL.Configurations
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<PropertyItem> Properties => Set<PropertyItem>();
        public DbSet<Subscriber> Subscribers => Set<Subscriber>();
        public DbSet<NoticeItem> Notices => Set<NoticeItem>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Category Unique Code
            modelBuilder.Entity<Category>()
                .HasIndex(c => c.Code)
                .IsUnique();

            // Configure Property - Category Relationship
            modelBuilder.Entity<PropertyItem>()
                .HasOne(p => p.Category)
                .WithMany()
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.SetNull);

            // Seed default categories
            modelBuilder.Entity<Category>().HasData(
                new Category
                {
                    Id = 1,
                    Code = "RECYCLED_STEEL",
                    Name = "Sắt Thép Tái Sử Dụng",
                    Icon = "Layers",
                    Desc = "Khung nhà xưởng tiền chế, dầm thép H, I, U và tôn tái sử dụng",
                    Active = true
                },
                new Category
                {
                    Id = 2,
                    Code = "RENT",
                    Name = "Cho Thuê Kho Bãi",
                    Icon = "Boxes",
                    Desc = "Kho logistics, dock leveler, bãi trung chuyển tiêu chuẩn",
                    Active = true
                },
                new Category
                {
                    Id = 3,
                    Code = "SALE",
                    Name = "Bán Nhà Xưởng",
                    Icon = "Warehouse",
                    Desc = "Xưởng sản xuất tiêu chuẩn, hoàn công đầy đủ, trạm điện riêng",
                    Active = true
                }
            );

            // Seed default Admin user
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Name = "Quản Trị Viên (Admin)",
                    Email = "admin@nhaxuong.vn",
                    PasswordHash = "$2a$11$N.vE9Q2d9m0W2sP4S6O0cOKxQe7C1I.8eJ2K4M6P8Q0S2U4W6Y8a.", // Hash of "123456"
                    Role = "admin",
                    Phone = "0901234567",
                    AuthProvider = "email",
                    EmailVerified = true
                }
            );

            // Seed initial properties
            modelBuilder.Entity<PropertyItem>().HasData(
                new PropertyItem
                {
                    Id = 1,
                    Title = "Bán 12.000m2 Nhà Xưởng Tiêu Chuẩn KCN VSIP 1, Trạm Điện 1.500kVA",
                    Type = "SALE",
                    TypeDisplay = "Bán Nhà Xưởng",
                    Status = "Còn hàng",
                    CategoryId = 3,
                    Province = "Bình Dương",
                    Kcn = "KCN VSIP 1",
                    Price = 48000000000,
                    PriceDisplay = "48 Tỷ VNĐ",
                    UnitPrice = "4.0 Tr/m²",
                    Area = "12.000 m2",
                    BrokerPhone = "0901 234 567",
                    Image = "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
                    VideoUrl = "https://assets.mixkit.co/videos/preview/mixkit-drone-view-of-a-large-factory-or-warehouse-42861-large.mp4",
                    AudioUrl = "https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3",
                    Model3DUrl = null,
                    Desc = "Khuôn viên đất 12.000m2, diện tích xưởng xây dựng 8.000m2, trần cao 11m, sàn bê tông cốt thép chịu tải 5 tấn/m2, trạm biến áp riêng 1.500kVA. Hồ sơ nghiệm thu PCCC đầy đủ, sẵn sàng bàn giao cho doanh nghiệp FDI.",
                    EmailNotified = true
                },
                new PropertyItem
                {
                    Id = 2,
                    Title = "Cho Thuê Kho Xưởng Logistics 5.000m2 KCN Sóng Thần 2 Dĩ An",
                    Type = "RENT",
                    TypeDisplay = "Cho Thuê Kho Bãi",
                    Status = "Còn hàng",
                    CategoryId = 2,
                    Province = "Bình Dương",
                    Kcn = "KCN Sóng Thần 2",
                    Price = 350000000,
                    PriceDisplay = "350 Triệu / Tháng",
                    UnitPrice = "70.000 đ/m²/tháng",
                    Area = "5.000 m2",
                    BrokerPhone = "0918 765 432",
                    Image = "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80",
                    VideoUrl = "https://assets.mixkit.co/videos/preview/mixkit-forklift-moving-cargo-in-a-warehouse-42863-large.mp4",
                    AudioUrl = "https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3",
                    Model3DUrl = null,
                    Desc = "Vị trí giáp ranh TP.HCM, đường xe container ra vào 24/7 không cấm tải, có sẵn 6 dock leveler xuất nhập hàng tiêu chuẩn châu Âu, văn phòng bảo vệ và camera giám sát 24/24.",
                    EmailNotified = true
                },
                new PropertyItem
                {
                    Id = 3,
                    Title = "Thanh Lý Khung Nhà Xưởng Thép Tiền Chế Tái Sử Dụng 3.200m2",
                    Type = "RECYCLED_STEEL",
                    TypeDisplay = "Sắt Thép Tái Sử Dụng",
                    Status = "Còn hàng",
                    CategoryId = 1,
                    Province = "Bình Dương",
                    Kcn = "Kho Bãi ICD Tân Cảng",
                    Price = 980000000,
                    PriceDisplay = "980 Triệu VNĐ",
                    UnitPrice = "306.000 đ/m²",
                    Area = "3.200 m2",
                    BrokerPhone = "0912 888 999",
                    Image = "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&q=80",
                    VideoUrl = "https://assets.mixkit.co/videos/preview/mixkit-drone-view-of-a-large-factory-or-warehouse-42861-large.mp4",
                    AudioUrl = null,
                    Model3DUrl = null,
                    Desc = "Khung kèo thép Zamil khẩu độ 30m vượt nhịp không cột giữa, tháo dỡ nguyên vẹn đầy đủ dầm cột H350, giằng xà gồ mạ kẽm C200, bản mã và bulong neo móng. Thích hợp tái lắp dựng nhà xưởng hoặc kho bãi.",
                    EmailNotified = true
                },
                new PropertyItem
                {
                    Id = 4,
                    Title = "Lô Dầm Thép Hình Chữ H, I & Xà Gồ Tháo Dỡ Tái Sử Dụng 85 Tấn",
                    Type = "RECYCLED_STEEL",
                    TypeDisplay = "Sắt Thép Tái Sử Dụng",
                    Status = "Còn hàng",
                    CategoryId = 1,
                    Province = "Đồng Nai",
                    Kcn = "KCN Long Đức",
                    Price = 1250000000,
                    PriceDisplay = "1.25 Tỷ VNĐ",
                    UnitPrice = "14.700 đ/kg",
                    Area = "85 Tấn",
                    BrokerPhone = "0983 777 666",
                    Image = "https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=800&q=80",
                    VideoUrl = "https://assets.mixkit.co/videos/preview/mixkit-forklift-moving-cargo-in-a-warehouse-42863-large.mp4",
                    AudioUrl = null,
                    Model3DUrl = null,
                    Desc = "Lô thép dầm chính H400x200, H300x150, I300 tháo dỡ từ nhà máy công nghiệp nhẹ, cây dài tiêu chuẩn 6m - 12m, bề mặt còn sơn lót chống rỉ tốt, không cong vênh.",
                    EmailNotified = true
                }
            );

            // Seed notices
            modelBuilder.Entity<NoticeItem>().HasData(
                new NoticeItem
                {
                    Id = 1,
                    Title = "Ưu đãi thuế quan và quy hoạch mở rộng KCN VSIP 1, Long Đức",
                    Content = "Chính sách ưu đãi miễn thuế 2 năm đầu, giảm 50% trong 4 năm tiếp theo cho các ngành công nghệ sạch, kho vận logistics thông minh.",
                    Badge = "Quy Hoạch KCN",
                    Active = true,
                    CreatedAt = "2026-10-28"
                },
                new NoticeItem
                {
                    Id = 2,
                    Title = "Trải nghiệm Mô Hình 3D Xoay 360° & Video Drone 1080p Trực Tuyến",
                    Content = "Giờ đây các nhà đầu tư có thể xem trước mặt bằng 3D nhà xưởng, mở mái xem bên trong kho và nghe audio thuyết minh tự động.",
                    Badge = "Công Nghệ 3D",
                    Active = true,
                    CreatedAt = "2026-10-29"
                }
            );
        }
    }
}
