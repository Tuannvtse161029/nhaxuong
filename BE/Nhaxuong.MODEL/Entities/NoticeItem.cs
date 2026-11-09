using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Nhaxuong.MODEL.Entities
{
    public class NoticeItem
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

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
