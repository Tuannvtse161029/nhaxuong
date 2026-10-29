using System;
using System.ComponentModel.DataAnnotations;

namespace Nhaxuong.MODEL.Entities
{
    public class PropertyItem
    {
        [Key]
        [MaxLength(50)]
        public string Id { get; set; } = Guid.NewGuid().ToString("N");

        [Required]
        [MaxLength(255)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Type { get; set; } = "SALE"; // SALE, RENT, RECYCLED_STEEL

        [MaxLength(100)]
        public string TypeDisplay { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Province { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string Kcn { get; set; } = string.Empty; // Vị trí kho bãi / KCN

        public long Price { get; set; }

        [MaxLength(100)]
        public string PriceDisplay { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? UnitPrice { get; set; }

        [Required]
        [MaxLength(100)]
        public string Area { get; set; } = string.Empty; // m2 hoặc Tấn

        [MaxLength(50)]
        public string? BrokerPhone { get; set; }

        public string Image { get; set; } = string.Empty;

        public string? VideoUrl { get; set; }

        public string? AudioUrl { get; set; }

        public string Desc { get; set; } = string.Empty;

        public bool EmailNotified { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
