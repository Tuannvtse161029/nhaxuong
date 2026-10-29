using Microsoft.AspNetCore.Mvc;

namespace Nhaxuong.API.CONTROLLER
{
    [ApiController]
    [Route("api/v1/uploads")]
    [Route("api/uploads")]
    [Route("uploads")]
    public class UploadsController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;

        public UploadsController(IWebHostEnvironment env)
        {
            _env = env;
        }

        [HttpPost("image")]
        public async Task<IActionResult> UploadImage(IFormFile? file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "Vui lòng chọn file hình ảnh hợp lệ" });
            }

            try
            {
                var uploadsDir = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads");
                if (!Directory.Exists(uploadsDir))
                {
                    Directory.CreateDirectory(uploadsDir);
                }

                var fileName = $"{Guid.NewGuid():N}_{Path.GetFileName(file.FileName)}";
                var filePath = Path.Combine(uploadsDir, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var url = $"/uploads/{fileName}";
                return Ok(new { url, fileName, size = file.Length });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi tải file: " + ex.Message });
            }
        }
    }
}
