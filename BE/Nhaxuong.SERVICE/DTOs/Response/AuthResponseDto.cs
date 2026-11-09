namespace Nhaxuong.SERVICE.DTOs.Response
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = "user";
        public string? Phone { get; set; }
        public string? Avatar { get; set; }
        public string AuthProvider { get; set; } = "email";
        public bool EmailVerified { get; set; } = false;
        public string CreatedAt { get; set; } = string.Empty;
    }

    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public string? RefreshToken { get; set; }
        public UserDto User { get; set; } = new();
    }
}
