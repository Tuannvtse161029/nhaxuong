using System;
using System.ComponentModel.DataAnnotations;

namespace Nhaxuong.MODEL.Entities
{
    public class NoticeItem
    {
        [Key]
        [MaxLength(50)]
        public string Id { get; set; } = Guid.NewGuid().ToString("N");

        [Required]
        [MaxLength(255)]
        public string Title { get; set; } = string.Empty;

        public string Content { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Badge { get; set; } = "Thông Báo";

        public bool Active { get; set; } = true;

        [MaxLength(50)]
        public string CreatedAt { get; set; } = DateTime.UtcNow.ToString("yyyy-MM-dd");
    }
}
