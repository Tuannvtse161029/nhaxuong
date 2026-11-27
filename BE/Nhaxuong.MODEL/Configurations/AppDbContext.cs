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

            // Seed 8 specialized categories for Factory Steel Marketplace & 3D Blueprints
            modelBuilder.Entity<Category>().HasData(
                new Category
                {
                    Id = 1,
                    Code = "BAN_KHUNG_XUONG",
                    Name = "Bán Khung Nhà Xưởng",
                    Icon = "Warehouse",
                    Desc = "Khung nhà xưởng tiền chế, khung thép Zamil, khẩu độ vượt nhịp 15m - 60m",
                    Active = true
                },
                new Category
                {
                    Id = 2,
                    Code = "COT_KEO",
                    Name = "Cột Kèo & Dầm Thép",
                    Icon = "Layers",
                    Desc = "Cột dầm H, I, kèo mái, hệ giằng, xà gồ Z và C mạ kẽm tháo dỡ nguyên vẹn",
                    Active = true
                },
                new Category
                {
                    Id = 3,
                    Code = "THEP_HINH_I",
                    Name = "Thép Hình I (I 200, I 300, I 500)",
                    Icon = "Grid",
                    Desc = "Thép hình đúc I 200x100, I 300x150, I 500x200 cắt theo quy cách tiêu chuẩn",
                    Active = true
                },
                new Category
                {
                    Id = 4,
                    Code = "TON_LOP_VACH",
                    Name = "Tôn (Tôn Lợp & Tôn Vách)",
                    Icon = "FileText",
                    Desc = "Tôn lợp mái 5 sóng, 9 sóng vuông, tôn chống nóng PU và tôn vách bao che",
                    Active = true
                },
                new Category
                {
                    Id = 5,
                    Code = "TON_SAN_DECK",
                    Name = "Tôn Sàn (Decking)",
                    Icon = "LayoutGrid",
                    Desc = "Tôn sàn Deck H50W1000, mạ kẽm cuộn đúc bê tông sàn nhà kho cao tầng",
                    Active = true
                },
                new Category
                {
                    Id = 6,
                    Code = "ONG_PCCC",
                    Name = "Ống Phòng Cháy Chữa Cháy (PCCC)",
                    Icon = "ShieldAlert",
                    Desc = "Ống thép hàn đen, ống mạ kẽm PCCC tiêu chuẩn ASTM/BS, co cút van mặt bích",
                    Active = true
                },
                new Category
                {
                    Id = 7,
                    Code = "THANH_LY_XUONG",
                    Name = "Thanh Lý Trọn Gói Nhà Xưởng",
                    Icon = "Truck",
                    Desc = "Thu mua thanh lý và bàn giao trọn gói nhà xưởng cũ tại công trình toàn quốc",
                    Active = true
                },
                new Category
                {
                    Id = 8,
                    Code = "THIET_KE_3D",
                    Name = "Xem Thiết Kế 3D Nhà Xưởng",
                    Icon = "Box",
                    Desc = "Bản vẽ 2D AutoCAD & Mô hình 3D tương tác 360°, tra cứu theo kích thước và kết cấu",
                    Active = true
                }
            );

            // Seed default Admin user with credentials: admin / baopro2147!
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Name = "Quản Trị Viên (Admin)",
                    Email = "admin@nhaxuong.vn",
                    PasswordHash = "$2a$11$q9oWw1K0kC759yR7uLcqne5vTf.yU/9N1aG1qD6c8G1yHjFmKn0ea", // Hash of "baopro2147!"
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
                    Title = "Khung Nhà Xưởng Tiền Chế 24m x 84m (2.016 m²) Kèo Zamil Có Cẩu Trục 10T",
                    Type = "BAN_KHUNG_XUONG",
                    TypeDisplay = "Bán Khung Nhà Xưởng",
                    Status = "Còn hàng",
                    StockStatus = "IN_STOCK",
                    StorageLocation = "AT_YARD",
                    CategoryId = 1,
                    Province = "Bình Dương",
                    City = "Bình Dương",
                    District = "Dĩ An",
                    Kcn = "Kho Bãi ICD Tân Cảng, TP. Dĩ An",
                    Price = 1450000000,
                    PriceDisplay = "1.45 Tỷ VNĐ",
                    UnitPrice = "719.000 đ/m²",
                    Area = "2.016 m²",
                    Length = 84,
                    Width = 24,
                    StructureType = "Zamil",
                    HasCrane = true,
                    CraneCapacity = "10 Tấn",
                    BrokerPhone = "0901 234 567",
                    Image = "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
                    VideoUrl = "https://assets.mixkit.co/videos/preview/mixkit-drone-view-of-a-large-factory-or-warehouse-42861-large.mp4",
                    AudioUrl = "https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3",
                    Model3DUrl = "/models3d/nha_xuong_24x84.html",
                    Drawing2DUrl = "/models3d/mat_bang_24x84.dxf",
                    Desc = "Khung nhà xưởng Zamil chuẩn xuất khẩu kích thước 24m x 84m, bước cột 6m, chiều cao giọt nước 8.5m, dầm đỡ cẩu trục 10 tấn chạy suốt chiều dài. Toàn bộ phụ kiện bản mã, giằng xà gồ mạ kẽm tập kết sẵn tại bãi Dĩ An.",
                    EmailNotified = true
                },
                new PropertyItem
                {
                    Id = 2,
                    Title = "Bản Vẽ & Mô Hình 3D Nhà Xưởng Thép I 66m x 136m (8.976 m²) 3 Nhịp Cột",
                    Type = "THIET_KE_3D",
                    TypeDisplay = "Xem Thiết Kế 3D Nhà Xưởng",
                    Status = "Còn hàng",
                    StockStatus = "IN_STOCK",
                    StorageLocation = "AT_YARD",
                    CategoryId = 8,
                    Province = "Bình Dương",
                    City = "Bình Dương",
                    District = "Thuận An",
                    Kcn = "Trung Tâm Kỹ Thuật & Thiết Kế KCN Thuận An",
                    Price = 35000000,
                    PriceDisplay = "35 Triệu VNĐ",
                    UnitPrice = "Hồ sơ thiết kế trọn gói",
                    Area = "8.976 m²",
                    Length = 136,
                    Width = 66,
                    StructureType = "Thép I",
                    HasCrane = true,
                    CraneCapacity = "15 Tấn",
                    BrokerPhone = "0918 765 432",
                    Image = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
                    VideoUrl = "https://assets.mixkit.co/videos/preview/mixkit-cargo-containers-in-a-port-loading-zone-42866-large.mp4",
                    AudioUrl = "https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3",
                    Model3DUrl = "/models3d/nha_xuong_66x136.html",
                    Drawing2DUrl = "/models3d/khung_keo_FR1_66m.step",
                    Desc = "Bộ hồ sơ bản vẽ kết cấu đầy đủ (AutoCAD DXF + STEP + 3D GLB) cho nhà xưởng khẩu độ lớn 66m chia 3 nhịp 22m, dài 136m. Có hệ dầm cẩu trục đôi 15 tấn, hệ mái lợp tôn seamlock cách nhiệt, cửa thông gió đỉnh mái.",
                    EmailNotified = true
                },
                new PropertyItem
                {
                    Id = 3,
                    Title = "Thanh Lý Trọn Gói Nhà Xưởng Kèo Tiệp 1.800m² Tại Công Trình Bảo Lộc",
                    Type = "THANH_LY_XUONG",
                    TypeDisplay = "Thanh Lý Trọn Gói Nhà Xưởng",
                    Status = "Còn hàng",
                    StockStatus = "IN_STOCK",
                    StorageLocation = "AT_SITE",
                    CategoryId = 7,
                    Province = "Lâm Đồng",
                    City = "Lâm Đồng",
                    District = "Bảo Lộc",
                    Kcn = "KCN Lộc Sơn, TP. Bảo Lộc",
                    Price = 850000000,
                    PriceDisplay = "850 Triệu VNĐ",
                    UnitPrice = "472.000 đ/m²",
                    Area = "1.800 m²",
                    Length = 60,
                    Width = 30,
                    StructureType = "Kèo Tiệp",
                    HasCrane = false,
                    BrokerPhone = "0912 888 999",
                    Image = "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&q=80",
                    VideoUrl = "https://assets.mixkit.co/videos/preview/mixkit-drone-view-of-a-large-factory-or-warehouse-42861-large.mp4",
                    AudioUrl = null,
                    Model3DUrl = null,
                    Desc = "Nhà xưởng đang đứng tại công trình TP. Bảo Lộc - Lâm Đồng. Kết cấu kèo Tiệp chữ A chắc chắn, khẩu độ 30m không cột giữa, tôn vách và tôn mái còn mới 90%. Bên bán hỗ trợ tháo dỡ cẩu hạ hàng lên xe đầu kéo.",
                    EmailNotified = true
                },
                new PropertyItem
                {
                    Id = 4,
                    Title = "Lô Thép Hình I 200, I 300, I 500 Cây Dài 12m Kho Bãi Dĩ An (95 Tấn)",
                    Type = "THEP_HINH_I",
                    TypeDisplay = "Thép Hình I (I 200, I 300, I 500)",
                    Status = "Còn hàng",
                    StockStatus = "IN_STOCK",
                    StorageLocation = "AT_YARD",
                    CategoryId = 3,
                    Province = "Bình Dương",
                    City = "Bình Dương",
                    District = "Dĩ An",
                    Kcn = "KCN Sóng Thần 1, Dĩ An",
                    Price = 1380000000,
                    PriceDisplay = "1.38 Tỷ VNĐ",
                    UnitPrice = "14.500 đ/kg",
                    Area = "95 Tấn",
                    Length = 12,
                    Width = null,
                    StructureType = "Thép I",
                    HasCrane = false,
                    BrokerPhone = "0983 777 666",
                    Image = "https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=800&q=80",
                    VideoUrl = "https://assets.mixkit.co/videos/preview/mixkit-forklift-moving-cargo-in-a-warehouse-42863-large.mp4",
                    AudioUrl = null,
                    Model3DUrl = null,
                    Desc = "Thép hình đúc Posco và An Khánh: I200x100x5.5x8, I300x150x6.5x9, I500x200x10x16. Cây dài chuẩn 12m nguyên cây không chắp nối, bề mặt sơn lót chống rỉ bảo quản trong nhà xưởng có cẩu trục 20 tấn bốc xếp ngay.",
                    EmailNotified = true
                },
                new PropertyItem
                {
                    Id = 5,
                    Title = "Lô Ống Thép Hàn PCCC D219, D114, D90 Mạ Kẽm Nhúng Nóng 4.500 Mét",
                    Type = "ONG_PCCC",
                    TypeDisplay = "Ống Phòng Cháy Chữa Cháy (PCCC)",
                    Status = "Hết hàng",
                    StockStatus = "OUT_OF_STOCK",
                    StorageLocation = "AT_YARD",
                    CategoryId = 6,
                    Province = "Bình Dương",
                    City = "Bình Dương",
                    District = "Thuận An",
                    Kcn = "Kho Bãi Bình Chuẩn, TP. Thuận An",
                    Price = 620000000,
                    PriceDisplay = "620 Triệu VNĐ",
                    UnitPrice = "138.000 đ/m",
                    Area = "4.500 Mét",
                    BrokerPhone = "0901 234 567",
                    Image = "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80",
                    VideoUrl = null,
                    AudioUrl = null,
                    Model3DUrl = null,
                    Desc = "Ống thép mạ kẽm PCCC tiêu chuẩn BS 1387:1985, độ dày Class A và Medium, kèm bích ren và khớp nối mềm. Đã giao dịch thành công cho nhà thầu KCN VSIP 1.",
                    EmailNotified = true
                }
            );

            // Seed notices
            modelBuilder.Entity<NoticeItem>().HasData(
                new NoticeItem
                {
                    Id = 1,
                    Title = "Khai trương kho bãi khung xưởng & sắt thép tại Dĩ An - Bình Dương",
                    Content = "Tổng kho 15.000m² tại Dĩ An sẵn sàng phục vụ cẩu tải khung thép Zamil, dầm I và tôn sàn giao ngay cho quý khách hàng toàn miền Nam.",
                    Badge = "Kho Hàng Mới",
                    Active = true,
                    CreatedAt = "2026-11-01"
                },
                new NoticeItem
                {
                    Id = 2,
                    Title = "Tra cứu mô hình 3D kết cấu nhà xưởng 360° trực tuyến trên di động",
                    Content = "Quý khách có thể lọc kích thước Dài x Rộng, loại kết cấu (Zamil, Thép I, Kèo Tiệp) và xem mô hình 3D trực quan ngay trên điện thoại.",
                    Badge = "Công Nghệ 3D",
                    Active = true,
                    CreatedAt = "2026-11-05"
                }
            );
        }
    }
}
