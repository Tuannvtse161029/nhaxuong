using System;
using System.ComponentModel.DataAnnotations;

namespace Nhaxuong.MODEL.Entities
{
    public class Category
    {
        [Key]
        [MaxLength(50)]
        public string Code { get; set; } = string.Empty;

        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(100)]
        public string Icon { get; set; } = "Warehouse";

        public string Desc { get; set; } = string.Empty;

        public bool Active { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
