using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Nhaxuong.MODELS.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSchemaV2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Categories",
                table: "Categories");

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Code",
                keyValue: "RECYCLED_STEEL");

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Code",
                keyValue: "RENT");

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Code",
                keyValue: "SALE");

            migrationBuilder.DeleteData(
                table: "Notices",
                keyColumn: "Id",
                keyValue: "not-1");

            migrationBuilder.DeleteData(
                table: "Notices",
                keyColumn: "Id",
                keyValue: "not-2");

            migrationBuilder.DeleteData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: "prop-1");

            migrationBuilder.DeleteData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: "prop-2");

            migrationBuilder.DeleteData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: "prop-steel-1");

            migrationBuilder.DeleteData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: "prop-steel-2");

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: "usr_admin_01");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "Users",
                type: "integer",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<bool>(
                name: "EmailVerified",
                table: "Users",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "Properties",
                type: "integer",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<int>(
                name: "CategoryId",
                table: "Properties",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Model3DUrl",
                table: "Properties",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Properties",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "Notices",
                type: "integer",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(50)",
                oldMaxLength: 50)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "Categories",
                type: "integer",
                nullable: false,
                defaultValue: 0)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Categories",
                table: "Categories",
                column: "Id");

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "Active", "Code", "CreatedAt", "Desc", "Icon", "Name" },
                values: new object[,]
                {
                    { 1, true, "RECYCLED_STEEL", new DateTime(2026, 11, 9, 5, 22, 53, 245, DateTimeKind.Utc).AddTicks(34), "Khung nhà xưởng tiền chế, dầm thép H, I, U và tôn tái sử dụng", "Layers", "Sắt Thép Tái Sử Dụng" },
                    { 2, true, "RENT", new DateTime(2026, 11, 9, 5, 22, 53, 245, DateTimeKind.Utc).AddTicks(36), "Kho logistics, dock leveler, bãi trung chuyển tiêu chuẩn", "Boxes", "Cho Thuê Kho Bãi" },
                    { 3, true, "SALE", new DateTime(2026, 11, 9, 5, 22, 53, 245, DateTimeKind.Utc).AddTicks(78), "Xưởng sản xuất tiêu chuẩn, hoàn công đầy đủ, trạm điện riêng", "Warehouse", "Bán Nhà Xưởng" }
                });

            migrationBuilder.InsertData(
                table: "Notices",
                columns: new[] { "Id", "Active", "Badge", "Content", "CreatedAt", "Title" },
                values: new object[,]
                {
                    { 1, true, "Quy Hoạch KCN", "Chính sách ưu đãi miễn thuế 2 năm đầu, giảm 50% trong 4 năm tiếp theo cho các ngành công nghệ sạch, kho vận logistics thông minh.", "2026-10-28", "Ưu đãi thuế quan và quy hoạch mở rộng KCN VSIP 1, Long Đức" },
                    { 2, true, "Công Nghệ 3D", "Giờ đây các nhà đầu tư có thể xem trước mặt bằng 3D nhà xưởng, mở mái xem bên trong kho và nghe audio thuyết minh tự động.", "2026-10-29", "Trải nghiệm Mô Hình 3D Xoay 360° & Video Drone 1080p Trực Tuyến" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "AuthProvider", "Avatar", "CreatedAt", "Email", "EmailVerified", "Name", "PasswordHash", "Phone", "Role" },
                values: new object[] { 1, "email", null, new DateTime(2026, 11, 9, 5, 22, 53, 245, DateTimeKind.Utc).AddTicks(211), "admin@nhaxuong.vn", true, "Quản Trị Viên (Admin)", "$2a$11$N.vE9Q2d9m0W2sP4S6O0cOKxQe7C1I.8eJ2K4M6P8Q0S2U4W6Y8a.", "0901234567", "admin" });

            migrationBuilder.InsertData(
                table: "Properties",
                columns: new[] { "Id", "Area", "AudioUrl", "BrokerPhone", "CategoryId", "CreatedAt", "Desc", "EmailNotified", "Image", "Kcn", "Model3DUrl", "Price", "PriceDisplay", "Province", "Status", "Title", "Type", "TypeDisplay", "UnitPrice", "VideoUrl" },
                values: new object[,]
                {
                    { 1, "12.000 m2", "https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3", "0901 234 567", 3, new DateTime(2026, 11, 9, 5, 22, 53, 245, DateTimeKind.Utc).AddTicks(229), "Khuôn viên đất 12.000m2, diện tích xưởng xây dựng 8.000m2, trần cao 11m, sàn bê tông cốt thép chịu tải 5 tấn/m2, trạm biến áp riêng 1.500kVA. Hồ sơ nghiệm thu PCCC đầy đủ, sẵn sàng bàn giao cho doanh nghiệp FDI.", true, "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80", "KCN VSIP 1", null, 48000000000L, "48 Tỷ VNĐ", "Bình Dương", "Còn hàng", "Bán 12.000m2 Nhà Xưởng Tiêu Chuẩn KCN VSIP 1, Trạm Điện 1.500kVA", "SALE", "Bán Nhà Xưởng", "4.0 Tr/m²", "https://assets.mixkit.co/videos/preview/mixkit-drone-view-of-a-large-factory-or-warehouse-42861-large.mp4" },
                    { 2, "5.000 m2", "https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3", "0918 765 432", 2, new DateTime(2026, 11, 9, 5, 22, 53, 245, DateTimeKind.Utc).AddTicks(234), "Vị trí giáp ranh TP.HCM, đường xe container ra vào 24/7 không cấm tải, có sẵn 6 dock leveler xuất nhập hàng tiêu chuẩn châu Âu, văn phòng bảo vệ và camera giám sát 24/24.", true, "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80", "KCN Sóng Thần 2", null, 350000000L, "350 Triệu / Tháng", "Bình Dương", "Còn hàng", "Cho Thuê Kho Xưởng Logistics 5.000m2 KCN Sóng Thần 2 Dĩ An", "RENT", "Cho Thuê Kho Bãi", "70.000 đ/m²/tháng", "https://assets.mixkit.co/videos/preview/mixkit-forklift-moving-cargo-in-a-warehouse-42863-large.mp4" },
                    { 3, "3.200 m2", null, "0912 888 999", 1, new DateTime(2026, 11, 9, 5, 22, 53, 245, DateTimeKind.Utc).AddTicks(237), "Khung kèo thép Zamil khẩu độ 30m vượt nhịp không cột giữa, tháo dỡ nguyên vẹn đầy đủ dầm cột H350, giằng xà gồ mạ kẽm C200, bản mã và bulong neo móng. Thích hợp tái lắp dựng nhà xưởng hoặc kho bãi.", true, "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&q=80", "Kho Bãi ICD Tân Cảng", null, 980000000L, "980 Triệu VNĐ", "Bình Dương", "Còn hàng", "Thanh Lý Khung Nhà Xưởng Thép Tiền Chế Tái Sử Dụng 3.200m2", "RECYCLED_STEEL", "Sắt Thép Tái Sử Dụng", "306.000 đ/m²", "https://assets.mixkit.co/videos/preview/mixkit-drone-view-of-a-large-factory-or-warehouse-42861-large.mp4" },
                    { 4, "85 Tấn", null, "0983 777 666", 1, new DateTime(2026, 11, 9, 5, 22, 53, 245, DateTimeKind.Utc).AddTicks(239), "Lô thép dầm chính H400x200, H300x150, I300 tháo dỡ từ nhà máy công nghiệp nhẹ, cây dài tiêu chuẩn 6m - 12m, bề mặt còn sơn lót chống rỉ tốt, không cong vênh.", true, "https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=800&q=80", "KCN Long Đức", null, 1250000000L, "1.25 Tỷ VNĐ", "Đồng Nai", "Còn hàng", "Lô Dầm Thép Hình Chữ H, I & Xà Gồ Tháo Dỡ Tái Sử Dụng 85 Tấn", "RECYCLED_STEEL", "Sắt Thép Tái Sử Dụng", "14.700 đ/kg", "https://assets.mixkit.co/videos/preview/mixkit-forklift-moving-cargo-in-a-warehouse-42863-large.mp4" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Properties_CategoryId",
                table: "Properties",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Categories_Code",
                table: "Categories",
                column: "Code",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Properties_Categories_CategoryId",
                table: "Properties",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Properties_Categories_CategoryId",
                table: "Properties");

            migrationBuilder.DropIndex(
                name: "IX_Properties_CategoryId",
                table: "Properties");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Categories",
                table: "Categories");

            migrationBuilder.DropIndex(
                name: "IX_Categories_Code",
                table: "Categories");

            migrationBuilder.DeleteData(
                table: "Notices",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Notices",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyColumnType: "integer",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyColumnType: "integer",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyColumnType: "integer",
                keyValue: 3);

            migrationBuilder.DropColumn(
                name: "EmailVerified",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "Model3DUrl",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Categories");

            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "Users",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "Properties",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<string>(
                name: "Id",
                table: "Notices",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Categories",
                table: "Categories",
                column: "Code");

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Code", "Active", "CreatedAt", "Desc", "Icon", "Name" },
                values: new object[,]
                {
                    { "RECYCLED_STEEL", true, new DateTime(2026, 11, 4, 5, 54, 25, 870, DateTimeKind.Utc).AddTicks(9214), "Khung nhà xưởng tiền chế, dầm thép H, I, U và tôn tái sử dụng", "Layers", "Sắt Thép Tái Sử Dụng" },
                    { "RENT", true, new DateTime(2026, 11, 4, 5, 54, 25, 870, DateTimeKind.Utc).AddTicks(9213), "Kho logistics, dock leveler, bãi trung chuyển tiêu chuẩn", "Boxes", "Cho Thuê Kho Bãi" },
                    { "SALE", true, new DateTime(2026, 11, 4, 5, 54, 25, 870, DateTimeKind.Utc).AddTicks(9210), "Xưởng sản xuất tiêu chuẩn, hoàn công đầy đủ, trạm điện riêng", "Warehouse", "Bán Nhà Xưởng" }
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
                columns: new[] { "Id", "Area", "AudioUrl", "BrokerPhone", "CreatedAt", "Desc", "EmailNotified", "Image", "Kcn", "Price", "PriceDisplay", "Province", "Title", "Type", "TypeDisplay", "UnitPrice", "VideoUrl" },
                values: new object[,]
                {
                    { "prop-1", "12.000 m2", "https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3", "0901 234 567", new DateTime(2026, 11, 4, 5, 54, 25, 870, DateTimeKind.Utc).AddTicks(9382), "Khuôn viên đất 12.000m2, diện tích xưởng xây dựng 8.000m2, trần cao 11m, sàn bê tông cốt thép chịu tải 5 tấn/m2, trạm biến áp riêng 1.500kVA. Hồ sơ nghiệm thu PCCC đầy đủ, sẵn sàng bàn giao cho doanh nghiệp FDI.", true, "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80", "KCN VSIP 1", 48000000000L, "48 Tỷ VNĐ", "Bình Dương", "Bán 12.000m2 Nhà Xưởng Tiêu Chuẩn KCN VSIP 1, Trạm Điện 1.500kVA", "SALE", "Bán Nhà Xưởng", "4.0 Tr/m²", "https://assets.mixkit.co/videos/preview/mixkit-drone-view-of-a-large-factory-or-warehouse-42861-large.mp4" },
                    { "prop-2", "5.000 m2", "https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3", "0918 765 432", new DateTime(2026, 11, 4, 5, 54, 25, 870, DateTimeKind.Utc).AddTicks(9393), "Vị trí giáp ranh TP.HCM, đường xe container ra vào 24/7 không cấm tải, có sẵn 6 dock leveler xuất nhập hàng tiêu chuẩn châu Âu, văn phòng bảo vệ và camera giám sát 24/24.", true, "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80", "KCN Sóng Thần 2", 350000000L, "350 Triệu / Tháng", "Bình Dương", "Cho Thuê Kho Xưởng Logistics 5.000m2 KCN Sóng Thần 2 Dĩ An", "RENT", "Cho Thuê Kho Bãi", "70.000 đ/m²/tháng", "https://assets.mixkit.co/videos/preview/mixkit-forklift-moving-cargo-in-a-warehouse-42863-large.mp4" },
                    { "prop-steel-1", "3.200 m2", null, "0912 888 999", new DateTime(2026, 11, 4, 5, 54, 25, 870, DateTimeKind.Utc).AddTicks(9401), "Khung kèo thép Zamil khẩu độ 30m vượt nhịp không cột giữa, tháo dỡ nguyên vẹn đầy đủ dầm cột H350, giằng xà gồ mạ kẽm C200, bản mã và bulong neo móng. Thích hợp tái lắp dựng nhà xưởng hoặc kho bãi.", true, "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&q=80", "Kho Bãi ICD Tân Cảng", 980000000L, "980 Triệu VNĐ", "Bình Dương", "Thanh Lý Khung Nhà Xưởng Thép Tiền Chế Tái Sử Dụng 3.200m2", "RECYCLED_STEEL", "Sắt Thép Tái Sử Dụng", "306.000 đ/m²", "https://assets.mixkit.co/videos/preview/mixkit-drone-view-of-a-large-factory-or-warehouse-42861-large.mp4" },
                    { "prop-steel-2", "85 Tấn", null, "0983 777 666", new DateTime(2026, 11, 4, 5, 54, 25, 870, DateTimeKind.Utc).AddTicks(9408), "Lô thép dầm chính H400x200, H300x150, I300 tháo dỡ từ nhà máy công nghiệp nhẹ, cây dài tiêu chuẩn 6m - 12m, bề mặt còn sơn lót chống rỉ tốt, không cong vênh.", true, "https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=800&q=80", "KCN Long Đức", 1250000000L, "1.25 Tỷ VNĐ", "Đồng Nai", "Lô Dầm Thép Hình Chữ H, I & Xà Gồ Tháo Dỡ Tái Sử Dụng 85 Tấn", "RECYCLED_STEEL", "Sắt Thép Tái Sử Dụng", "14.700 đ/kg", "https://assets.mixkit.co/videos/preview/mixkit-forklift-moving-cargo-in-a-warehouse-42863-large.mp4" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "AuthProvider", "Avatar", "CreatedAt", "Email", "Name", "PasswordHash", "Phone", "Role" },
                values: new object[] { "usr_admin_01", "email", null, new DateTime(2026, 11, 4, 5, 54, 25, 870, DateTimeKind.Utc).AddTicks(9360), "admin@nhaxuong.vn", "Quản Trị Viên (Admin)", "$2a$11$N.vE9Q2d9m0W2sP4S6O0cOKxQe7C1I.8eJ2K4M6P8Q0S2U4W6Y8a.", "0901234567", "admin" });
        }
    }
}
