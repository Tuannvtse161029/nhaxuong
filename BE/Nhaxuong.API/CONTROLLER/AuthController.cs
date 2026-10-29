using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Nhaxuong.SERVICE.DTOs.Request;
using Nhaxuong.SERVICE.DTOs.Response;
using Nhaxuong.SERVICE.Services;

namespace Nhaxuong.API.CONTROLLER
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        /// <summary>
        /// Đăng nhập bằng Email và Mật khẩu (Admin &amp; User)
        /// </summary>
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

        /// <summary>
        /// Đăng ký tài khoản Email mới (Role: User)
        /// </summary>
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

        /// <summary>
        /// Đăng nhập / Đăng ký 1 chạm bằng Google
        /// </summary>
        [HttpPost("google")]
        public async Task<IActionResult> GoogleAuth([FromBody] GoogleAuthRequest? request)
        {
            try
            {
                var result = await _authService.GoogleAuthAsync(request ?? new GoogleAuthRequest());
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Đăng nhập / Đăng ký 1 chạm bằng Số điện thoại + OTP
        /// </summary>
        [HttpPost("phone")]
        public async Task<IActionResult> PhoneAuth([FromBody] PhoneAuthRequest request)
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

        /// <summary>
        /// Gửi mã OTP xác thực số điện thoại
        /// </summary>
        [HttpPost("send-otp")]
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

        /// <summary>
        /// Lấy thông tin tài khoản hiện tại từ Token
        /// </summary>
        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Ok(new UserDto
                {
                    Id = "usr_admin_01",
                    Name = "Quản Trị Viên (Admin)",
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

        #region Backward Compatibility Aliases (Hidden from Swagger UI)
        [HttpPost("phone/login")]
        [ApiExplorerSettings(IgnoreApi = true)]
        public Task<IActionResult> PhoneLoginAlias([FromBody] PhoneAuthRequest request) => PhoneAuth(request);

        [HttpPost("phone/register")]
        [ApiExplorerSettings(IgnoreApi = true)]
        public Task<IActionResult> PhoneRegisterAlias([FromBody] PhoneAuthRequest request) => PhoneAuth(request);

        [HttpPost("phone/send-otp")]
        [ApiExplorerSettings(IgnoreApi = true)]
        public Task<IActionResult> PhoneSendOtpAlias([FromBody] SendOtpRequest request) => SendOtp(request);
        #endregion
    }
}
