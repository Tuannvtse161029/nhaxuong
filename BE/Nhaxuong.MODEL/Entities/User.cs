using System;
using System.ComponentModel.DataAnnotations;

namespace Nhaxuong.MODEL.Entities
{
    public class User
    {
        [Key]
        [MaxLength(50)]
        public string Id { get; set; } = Guid.NewGuid().ToString("N");

        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(150)]
        public string Email { get; set; } = string.Empty;

        [MaxLength(255)]
        public string PasswordHash { get; set; } = string.Empty;

        [MaxLength(30)]
        public string? Phone { get; set; }

        [MaxLength(30)]
        public string Role { get; set; } = "user";

        public string? Avatar { get; set; }

        [MaxLength(30)]
        public string AuthProvider { get; set; } = "email";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
