using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Nhaxuong.MODELS.Migrations
{
    /// <inheritdoc />
    public partial class RemoveRedundantFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Time",
                table: "Subscribers");

            migrationBuilder.DropColumn(
                name: "AudioDuration",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "BrokerName",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "CeilingHeight",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "Created",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "District",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "FloorLoad",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "GalleryJson",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "LegalStatus",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "Pccc",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "Power",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "RoadAccess",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "Verified",
                table: "Properties");

            migrationBuilder.AlterColumn<string>(
                name: "BrokerPhone",
                table: "Properties",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Code",
                keyValue: "RECYCLED_STEEL",
                column: "CreatedAt",
                value: new DateTime(2026, 10, 29, 9, 2, 48, 261, DateTimeKind.Utc).AddTicks(9923));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Code",
                keyValue: "RENT",
                column: "CreatedAt",
                value: new DateTime(2026, 10, 29, 9, 2, 48, 261, DateTimeKind.Utc).AddTicks(9921));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Code",
                keyValue: "SALE",
                column: "CreatedAt",
                value: new DateTime(2026, 10, 29, 9, 2, 48, 261, DateTimeKind.Utc).AddTicks(9913));

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: "prop-1",
                column: "CreatedAt",
                value: new DateTime(2026, 10, 29, 9, 2, 48, 262, DateTimeKind.Utc).AddTicks(307));

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: "prop-2",
                column: "CreatedAt",
                value: new DateTime(2026, 10, 29, 9, 2, 48, 262, DateTimeKind.Utc).AddTicks(327));

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: "prop-steel-1",
                column: "CreatedAt",
                value: new DateTime(2026, 10, 29, 9, 2, 48, 262, DateTimeKind.Utc).AddTicks(344));

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: "prop-steel-2",
                column: "CreatedAt",
                value: new DateTime(2026, 10, 29, 9, 2, 48, 262, DateTimeKind.Utc).AddTicks(357));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: "usr_admin_01",
                column: "CreatedAt",
                value: new DateTime(2026, 10, 29, 9, 2, 48, 262, DateTimeKind.Utc).AddTicks(256));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Time",
                table: "Subscribers",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "BrokerPhone",
                table: "Properties",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AudioDuration",
                table: "Properties",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BrokerName",
                table: "Properties",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CeilingHeight",
                table: "Properties",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Created",
                table: "Properties",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "District",
                table: "Properties",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FloorLoad",
                table: "Properties",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GalleryJson",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LegalStatus",
                table: "Properties",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Pccc",
                table: "Properties",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Power",
                table: "Properties",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RoadAccess",
                table: "Properties",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Verified",
                table: "Properties",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Code",
                keyValue: "RECYCLED_STEEL",
                column: "CreatedAt",
                value: new DateTime(2026, 10, 29, 8, 33, 11, 210, DateTimeKind.Utc).AddTicks(4800));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Code",
                keyValue: "RENT",
                column: "CreatedAt",
                value: new DateTime(2026, 10, 29, 8, 33, 11, 210, DateTimeKind.Utc).AddTicks(4797));

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Code",
                keyValue: "SALE",
                column: "CreatedAt",
                value: new DateTime(2026, 10, 29, 8, 33, 11, 210, DateTimeKind.Utc).AddTicks(4790));

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: "prop-1",
                columns: new[] { "AudioDuration", "BrokerName", "CeilingHeight", "Created", "CreatedAt", "District", "FloorLoad", "GalleryJson", "LegalStatus", "Pccc", "Power", "RoadAccess", "Verified" },
                values: new object[] { "01:24", "Trần Quang Dũng (GĐ Nhà Xưởng KCN)", null, "10:30 28/10/2026", new DateTime(2026, 10, 29, 8, 33, 11, 210, DateTimeKind.Utc).AddTicks(5263), "Thuận An", null, null, null, "Tự Động (Sprinkler)", "1.500 kVA", null, true });

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: "prop-2",
                columns: new[] { "AudioDuration", "BrokerName", "CeilingHeight", "Created", "CreatedAt", "District", "FloorLoad", "GalleryJson", "LegalStatus", "Pccc", "Power", "RoadAccess", "Verified" },
                values: new object[] { "00:58", "Nguyễn Thanh Tùng (Phụ trách Thuê KCN)", null, "09:15 28/10/2026", new DateTime(2026, 10, 29, 8, 33, 11, 210, DateTimeKind.Utc).AddTicks(5295), "Dĩ An", null, null, null, "Thẩm Duyệt Hoàn Công", "800 kVA", null, true });

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: "prop-steel-1",
                columns: new[] { "AudioDuration", "BrokerName", "CeilingHeight", "Created", "CreatedAt", "District", "FloorLoad", "GalleryJson", "LegalStatus", "Pccc", "Power", "RoadAccess", "Verified" },
                values: new object[] { null, "Đỗ Hoàng Nam (Chuyên Viên Sắt Thép Tái Sử Dụng)", null, "11:00 29/10/2026", new DateTime(2026, 10, 29, 8, 33, 11, 210, DateTimeKind.Utc).AddTicks(5314), "Bến Cát", null, null, null, "Sơn chống rỉ, chịu tải 95%", "Kết cấu thép Zamil SS400", null, true });

            migrationBuilder.UpdateData(
                table: "Properties",
                keyColumn: "Id",
                keyValue: "prop-steel-2",
                columns: new[] { "AudioDuration", "BrokerName", "CeilingHeight", "Created", "CreatedAt", "District", "FloorLoad", "GalleryJson", "LegalStatus", "Pccc", "Power", "RoadAccess", "Verified" },
                values: new object[] { null, "Nguyễn Văn Hùng (Kho Bãi Sắt Thép)", null, "10:30 29/10/2026", new DateTime(2026, 10, 29, 8, 33, 11, 210, DateTimeKind.Utc).AddTicks(5389), "Long Thành", null, null, null, "Chất lượng chịu tải 95%", "Thép SS400 / Q345B", null, true });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: "usr_admin_01",
                column: "CreatedAt",
                value: new DateTime(2026, 10, 29, 8, 33, 11, 210, DateTimeKind.Utc).AddTicks(5111));
        }
    }
}
