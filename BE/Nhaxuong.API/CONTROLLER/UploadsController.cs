using Microsoft.AspNetCore.Mvc;

namespace Nhaxuong.API.CONTROLLER
{
    [ApiController]
    [Route("api/uploads")]
    [Route("uploads")]
    public class UploadsController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;

        public UploadsController(IWebHostEnvironment env)
        {
            _env = env;
        }

        /// <summary>
        /// Tải lên hình ảnh banner, thumbnail, gallery
        /// </summary>
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

        /// <summary>
        /// Tải lên mô hình 3D tương tác (File HTML)
        /// </summary>
        [HttpPost("model3d")]
        [HttpPost("3d")]
        public async Task<IActionResult> UploadModel3D(IFormFile? file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { message = "Vui lòng chọn file HTML mô hình 3D hợp lệ" });
            }

            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (ext != ".html" && ext != ".htm")
            {
                return BadRequest(new { message = "Định dạng file không được hỗ trợ! Mô hình 3D phải là file HTML (.html hoặc .htm)." });
            }

            try
            {
                var uploadsDir = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads", "3d");
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

                var url = $"/uploads/3d/{fileName}";
                return Ok(new { url, fileName, size = file.Length });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi tải file mô hình 3D HTML: " + ex.Message });
            }
        }
    }
}
