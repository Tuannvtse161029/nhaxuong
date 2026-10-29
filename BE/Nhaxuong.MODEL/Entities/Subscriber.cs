using System;
using System.ComponentModel.DataAnnotations;

namespace Nhaxuong.MODEL.Entities
{
    public class Subscriber
    {
        [Key]
        [MaxLength(50)]
        public string Id { get; set; } = Guid.NewGuid().ToString("N");

        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(150)]
        public string? Email { get; set; }

        [MaxLength(30)]
        public string? Phone { get; set; }

        [MaxLength(30)]
        public string Channel { get; set; } = "email"; // email, hotline

        [MaxLength(50)]
        public string Status { get; set; } = "Đang Nhận Tin";

        [MaxLength(50)]
        public string Time { get; set; } = DateTime.UtcNow.ToString("dd/MM/yyyy HH:mm");

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
