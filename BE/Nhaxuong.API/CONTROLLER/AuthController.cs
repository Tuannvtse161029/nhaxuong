using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nhaxuong.SERVICE.DTOs.Request;
using Nhaxuong.SERVICE.DTOs.Response;
using Nhaxuong.SERVICE.Services;

namespace Nhaxuong.API.CONTROLLER
{
    [ApiController]
    [Route("api/v1/auth")]
    [Route("api/auth")]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var result = await _authService.LoginAsync(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                var result = await _authService.RegisterAsync(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("google")]
        public async Task<IActionResult> GoogleAuth([FromBody] GoogleAuthRequest request)
        {
            try
            {
                var result = await _authService.GoogleAuthAsync(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("phone/login")]
        public async Task<IActionResult> PhoneLogin([FromBody] PhoneAuthRequest request)
        {
            try
            {
                var result = await _authService.PhoneAuthAsync(request, isRegister: false);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("phone/register")]
        public async Task<IActionResult> PhoneRegister([FromBody] PhoneAuthRequest request)
        {
            try
            {
                var result = await _authService.PhoneAuthAsync(request, isRegister: true);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("phone/send-otp")]
        public async Task<IActionResult> SendOtp([FromBody] SendOtpRequest request)
        {
            try
            {
                var otp = await _authService.SendOtpAsync(request.Phone);
                return Ok(new
                {
                    otp,
                    message = $"Mã OTP đã được gửi đến số điện thoại {request.Phone}: {otp}"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                // Fallback demo user if accessed without token
                return Ok(new UserDto
                {
                    Id = "usr_01",
                    Name = "Quản Trị Viên (Demo)",
                    Email = "admin@nhaxuong.vn",
                    Role = "admin",
                    Phone = "0901234567",
                    Avatar = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&auto=format&fit=crop&q=80",
                    AuthProvider = "email",
                    CreatedAt = "2026-01-01"
                });
            }

            try
            {
                var user = await _authService.GetMeAsync(userId);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            return Ok(new { message = "Đã đăng xuất thành công" });
        }
    }
}
