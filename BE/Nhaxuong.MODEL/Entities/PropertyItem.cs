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

        [MaxLength(100)]
        public string? District { get; set; }

        [Required]
        [MaxLength(200)]
        public string Kcn { get; set; } = string.Empty; // Vị trí (KCN hoặc Bãi kho)

        public long Price { get; set; }

        [MaxLength(100)]
        public string PriceDisplay { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? UnitPrice { get; set; }

        [Required]
        [MaxLength(100)]
        public string Area { get; set; } = string.Empty; // m2 hoặc Tấn

        [MaxLength(100)]
        public string? Power { get; set; }

        [MaxLength(100)]
        public string? Pccc { get; set; }

        [MaxLength(100)]
        public string? BrokerPhone { get; set; }

        [MaxLength(150)]
        public string? BrokerName { get; set; }

        public string Image { get; set; } = string.Empty;

        public string? GalleryJson { get; set; }

        public string? VideoUrl { get; set; }

        public string? AudioUrl { get; set; }

        [MaxLength(20)]
        public string? AudioDuration { get; set; }

        public string Desc { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? CeilingHeight { get; set; }

        [MaxLength(100)]
        public string? FloorLoad { get; set; }

        [MaxLength(150)]
        public string? LegalStatus { get; set; }

        [MaxLength(150)]
        public string? RoadAccess { get; set; }

        public bool Verified { get; set; } = true;

        public bool EmailNotified { get; set; } = false;

        [MaxLength(50)]
        public string Created { get; set; } = DateTime.UtcNow.ToString("HH:mm dd/MM/yyyy");

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
