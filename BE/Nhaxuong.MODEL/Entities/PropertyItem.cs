using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Nhaxuong.MODEL.Entities
{
    public class PropertyItem
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Type { get; set; } = "SALE"; // SALE, RENT, RECYCLED_STEEL, THIET_KE_3D

        [MaxLength(100)]
        public string TypeDisplay { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Status { get; set; } = "Còn hàng"; // Còn hàng, Đã bán, Hết hàng, Đang giao dịch

        // Dual Square Status Logic
        [MaxLength(50)]
        public string StockStatus { get; set; } = "IN_STOCK"; // IN_STOCK (Còn hàng), OUT_OF_STOCK (Hết hàng / Đã bán)

        [MaxLength(50)]
        public string StorageLocation { get; set; } = "AT_YARD"; // AT_YARD (Ở bãi), AT_SITE (Ở công trình)

        public int? CategoryId { get; set; }

        [ForeignKey(nameof(CategoryId))]
        public virtual Category? Category { get; set; }

        // Vị trí địa lý
        [Required]
        [MaxLength(100)]
        public string Province { get; set; } = string.Empty; // Lâm Đồng, Bình Dương, Đồng Nai, TP.HCM

        [MaxLength(100)]
        public string? City { get; set; } // Lâm Đồng, Bình Dương, v.v.

        [MaxLength(100)]
        public string? District { get; set; } // Dĩ An, Thuận An, Bảo Lộc, Đà Lạt, v.v.

        [Required]
        [MaxLength(200)]
        public string Kcn { get; set; } = string.Empty; // Vị trí kho bãi / KCN cụ thể

        // Giá cả
        public long Price { get; set; }

        [MaxLength(100)]
        public string PriceDisplay { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? UnitPrice { get; set; }

        [Required]
        [MaxLength(100)]
        public string Area { get; set; } = string.Empty; // Diện tích (m2) hoặc Tấn

        // Thông số kết cấu nhà xưởng & Bản vẽ 3D
        public double? Length { get; set; } // Chiều dài (m)
        public double? Width { get; set; } // Chiều rộng (m)

        [MaxLength(100)]
        public string? StructureType { get; set; } // Thép I, Zamil, Kèo Tiệp, Khác

        public bool HasCrane { get; set; } = false; // Có cẩu trục không

        [MaxLength(100)]
        public string? CraneCapacity { get; set; } // e.g. "5 Tấn", "10 Tấn", "15 Tấn"

        [MaxLength(50)]
        public string? BrokerPhone { get; set; }

        public string Image { get; set; } = string.Empty;

        public string? VideoUrl { get; set; }

        public string? AudioUrl { get; set; }

        public string? Model3DUrl { get; set; } // Link file HTML mô hình 3D tương tác hoặc GLB

        public string? Drawing2DUrl { get; set; } // Link file bản vẽ DXF / STEP / PDF

        public string Desc { get; set; } = string.Empty;

        public bool EmailNotified { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
