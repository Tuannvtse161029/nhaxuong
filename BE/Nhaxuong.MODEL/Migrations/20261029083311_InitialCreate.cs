using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Nhaxuong.MODELS.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Code = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Icon = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Desc = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Active = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Code);
                });

            migrationBuilder.CreateTable(
                name: "Notices",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Badge = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Active = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notices", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Properties",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Type = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    TypeDisplay = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Province = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    District = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Kcn = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Price = table.Column<long>(type: "bigint", nullable: false),
                    PriceDisplay = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    UnitPrice = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Area = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Power = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Pccc = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    BrokerPhone = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    BrokerName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    Image = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GalleryJson = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VideoUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AudioUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AudioDuration = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Desc = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CeilingHeight = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    FloorLoad = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    LegalStatus = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    RoadAccess = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    Verified = table.Column<bool>(type: "bit", nullable: false),
                    EmailNotified = table.Column<bool>(type: "bit", nullable: false),
                    Created = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Properties", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Subscribers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    Phone = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    Channel = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Time = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Subscribers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    Role = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Avatar = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AuthProvider = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Code", "Active", "CreatedAt", "Desc", "Icon", "Name" },
                values: new object[,]
                {
                    { "RECYCLED_STEEL", true, new DateTime(2026, 10, 29, 8, 33, 11, 210, DateTimeKind.Utc).AddTicks(4800), "Khung nhà xưởng tiền chế, dầm thép H, I, U và tôn tái sử dụng", "Layers", "Sắt Thép Tái Sử Dụng" },
                    { "RENT", true, new DateTime(2026, 10, 29, 8, 33, 11, 210, DateTimeKind.Utc).AddTicks(4797), "Kho logistics, dock leveler, bãi trung chuyển tiêu chuẩn", "Boxes", "Cho Thuê Kho Bãi" },
                    { "SALE", true, new DateTime(2026, 10, 29, 8, 33, 11, 210, DateTimeKind.Utc).AddTicks(4790), "Xưởng sản xuất tiêu chuẩn, hoàn công đầy đủ, trạm điện riêng", "Warehouse", "Bán Nhà Xưởng" }
                });

            migrationBuilder.InsertData(
                table: "Notices",
                columns: new[] { "Id", "Active", "Badge", "Content", "CreatedAt", "Title" },
                values: new object[,]
                {
                    { "not-1", true, "Quy Hoạch KCN", "Chính sách ưu đãi miễn thuế 2 năm đầu, giảm 50% trong 4 năm tiếp theo cho các ngành công nghệ sạch, kho vận logistics thông minh.", "2026-10-28", "Ưu đãi thuế quan và quy hoạch mở rộng KCN VSIP 1, Long Đức" },
                    { "not-2", true, "Công Nghệ 3D", "Giờ đây các nhà đầu tư có thể xem trước mặt bằng 3D nhà xưởng, mở mái xem bên trong kho và nghe audio thuyết minh tự động.", "2026-10-29", "Trải nghiệm Mô Hình 3D Xoay 360° & Video Drone 1080p Trực Tuyến" }
                });

            migrationBuilder.InsertData(
                table: "Properties",
                columns: new[] { "Id", "Area", "AudioDuration", "AudioUrl", "BrokerName", "BrokerPhone", "CeilingHeight", "Created", "CreatedAt", "Desc", "District", "EmailNotified", "FloorLoad", "GalleryJson", "Image", "Kcn", "LegalStatus", "Pccc", "Power", "Price", "PriceDisplay", "Province", "RoadAccess", "Title", "Type", "TypeDisplay", "UnitPrice", "Verified", "VideoUrl" },
                values: new object[,]
                {
                    { "prop-1", "12.000 m2", "01:24", "https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3", "Trần Quang Dũng (GĐ Nhà Xưởng KCN)", "0901 234 567", null, "10:30 28/10/2026", new DateTime(2026, 10, 29, 8, 33, 11, 210, DateTimeKind.Utc).AddTicks(5263), "Khuôn viên đất 12.000m2, diện tích xưởng xây dựng 8.000m2, trần cao 11m, sàn bê tông cốt thép chịu tải 5 tấn/m2, trạm biến áp riêng 1.500kVA. Hồ sơ nghiệm thu PCCC đầy đủ, sẵn sàng bàn giao cho doanh nghiệp FDI.", "Thuận An", true, null, null, "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80", "KCN VSIP 1", null, "Tự Động (Sprinkler)", "1.500 kVA", 48000000000L, "48 Tỷ VNĐ", "Bình Dương", null, "Bán 12.000m2 Nhà Xưởng Tiêu Chuẩn KCN VSIP 1, Trạm Điện 1.500kVA", "SALE", "Bán Nhà Xưởng", "4.0 Tr/m²", true, "https://assets.mixkit.co/videos/preview/mixkit-drone-view-of-a-large-factory-or-warehouse-42861-large.mp4" },
                    { "prop-2", "5.000 m2", "00:58", "https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3", "Nguyễn Thanh Tùng (Phụ trách Thuê KCN)", "0918 765 432", null, "09:15 28/10/2026", new DateTime(2026, 10, 29, 8, 33, 11, 210, DateTimeKind.Utc).AddTicks(5295), "Vị trí giáp ranh TP.HCM, đường xe container ra vào 24/7 không cấm tải, có sẵn 6 dock leveler xuất nhập hàng tiêu chuẩn châu Âu, văn phòng bảo vệ và camera giám sát 24/24.", "Dĩ An", true, null, null, "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80", "KCN Sóng Thần 2", null, "Thẩm Duyệt Hoàn Công", "800 kVA", 350000000L, "350 Triệu / Tháng", "Bình Dương", null, "Cho Thuê Kho Xưởng Logistics 5.000m2 KCN Sóng Thần 2 Dĩ An", "RENT", "Cho Thuê Kho Bãi", "70.000 đ/m²/tháng", true, "https://assets.mixkit.co/videos/preview/mixkit-forklift-moving-cargo-in-a-warehouse-42863-large.mp4" },
                    { "prop-steel-1", "3.200 m2", null, null, "Đỗ Hoàng Nam (Chuyên Viên Sắt Thép Tái Sử Dụng)", "0912 888 999", null, "11:00 29/10/2026", new DateTime(2026, 10, 29, 8, 33, 11, 210, DateTimeKind.Utc).AddTicks(5314), "Khung kèo thép Zamil khẩu độ 30m vượt nhịp không cột giữa, tháo dỡ nguyên vẹn đầy đủ dầm cột H350, giằng xà gồ mạ kẽm C200, bản mã và bulong neo móng. Thích hợp tái lắp dựng nhà xưởng hoặc kho bãi.", "Bến Cát", true, null, null, "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&q=80", "Kho Bãi ICD Tân Cảng", null, "Sơn chống rỉ, chịu tải 95%", "Kết cấu thép Zamil SS400", 980000000L, "980 Triệu VNĐ", "Bình Dương", null, "Thanh Lý Khung Nhà Xưởng Thép Tiền Chế Tái Sử Dụng 3.200m2", "RECYCLED_STEEL", "Sắt Thép Tái Sử Dụng", "306.000 đ/m²", true, "https://assets.mixkit.co/videos/preview/mixkit-drone-view-of-a-large-factory-or-warehouse-42861-large.mp4" },
                    { "prop-steel-2", "85 Tấn", null, null, "Nguyễn Văn Hùng (Kho Bãi Sắt Thép)", "0983 777 666", null, "10:30 29/10/2026", new DateTime(2026, 10, 29, 8, 33, 11, 210, DateTimeKind.Utc).AddTicks(5389), "Lô thép dầm chính H400x200, H300x150, I300 tháo dỡ từ nhà máy công nghiệp nhẹ, cây dài tiêu chuẩn 6m - 12m, bề mặt còn sơn lót chống rỉ tốt, không cong vênh.", "Long Thành", true, null, null, "https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=800&q=80", "KCN Long Đức", null, "Chất lượng chịu tải 95%", "Thép SS400 / Q345B", 1250000000L, "1.25 Tỷ VNĐ", "Đồng Nai", null, "Lô Dầm Thép Hình Chữ H, I & Xà Gồ Tháo Dỡ Tái Sử Dụng 85 Tấn", "RECYCLED_STEEL", "Sắt Thép Tái Sử Dụng", "14.700 đ/kg", true, "https://assets.mixkit.co/videos/preview/mixkit-forklift-moving-cargo-in-a-warehouse-42863-large.mp4" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "AuthProvider", "Avatar", "CreatedAt", "Email", "Name", "PasswordHash", "Phone", "Role" },
                values: new object[] { "usr_admin_01", "email", null, new DateTime(2026, 10, 29, 8, 33, 11, 210, DateTimeKind.Utc).AddTicks(5111), "admin@nhaxuong.vn", "Quản Trị Viên (Admin)", "$2a$11$N.vE9Q2d9m0W2sP4S6O0cOKxQe7C1I.8eJ2K4M6P8Q0S2U4W6Y8a.", "0901234567", "admin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropTable(
                name: "Notices");

            migrationBuilder.DropTable(
                name: "Properties");

            migrationBuilder.DropTable(
                name: "Subscribers");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
