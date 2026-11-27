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
        /// Xem / tải hình ảnh đã upload
        /// </summary>
        [HttpGet("{fileName}")]
        [HttpGet("/uploads/{fileName}")]
        public IActionResult GetImage(string fileName)
        {
            var uploadsDir = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "uploads");
            var filePath = Path.Combine(uploadsDir, fileName);

            if (!System.IO.File.Exists(filePath))
            {
                var altPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", fileName);
                if (System.IO.File.Exists(altPath))
                {
                    filePath = altPath;
                }
                else
                {
                    return NotFound(new { message = "Không tìm thấy file: " + fileName });
                }
            }

            var ext = Path.GetExtension(fileName).ToLowerInvariant();
            var contentType = ext switch
            {
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".webp" => "image/webp",
                ".gif" => "image/gif",
                ".svg" => "image/svg+xml",
                _ => "application/octet-stream"
            };

            return PhysicalFile(filePath, contentType);
        }

        /// <summary>
        /// Xem / nhúng mô hình 3D tương tác
        /// </summary>
        [HttpGet("3d/{fileName}")]
        [HttpGet("/uploads/3d/{fileName}")]
        public IActionResult GetModel3D(string fileName)
        {
            try
            {
                var baseDir = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                var filePath = Path.GetFullPath(Path.Combine(baseDir, "uploads", "3d", fileName));

                if (!System.IO.File.Exists(filePath))
                {
                    var altPath = Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "3d", fileName));
                    if (System.IO.File.Exists(altPath))
                    {
                        filePath = altPath;
                    }
                    else
                    {
                        var appDir = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "wwwroot", "uploads", "3d", fileName));
                        if (System.IO.File.Exists(appDir))
                        {
                            filePath = appDir;
                        }
                        else
                        {
                            return NotFound(new { message = "Không tìm thấy file 3D: " + fileName });
                        }
                    }
                }

                var ext = Path.GetExtension(fileName).ToLowerInvariant();
                var contentType = ext switch
                {
                    ".html" or ".htm" => "text/html; charset=utf-8",
                    ".glb" => "model/gltf-binary",
                    _ => "application/octet-stream"
                };

                return PhysicalFile(filePath, contentType);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi đọc file 3D: " + ex.Message });
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
            if (ext != ".html" && ext != ".htm" && ext != ".glb")
            {
                return BadRequest(new { message = "Định dạng file không được hỗ trợ! Mô hình 3D phải là file HTML (.html hoặc .htm) hoặc GLB (.glb)." });
            }

            try
            {
                var baseDir = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                var uploadsDir = Path.Combine(baseDir, "uploads", "3d");
                if (!Directory.Exists(uploadsDir))
                {
                    Directory.CreateDirectory(uploadsDir);
                }

                var fileName = $"{Guid.NewGuid():N}_{Path.GetFileName(file.FileName)}";
                var filePath = Path.GetFullPath(Path.Combine(uploadsDir, fileName));

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var altDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "3d");
                if (altDir != uploadsDir)
                {
                    try
                    {
                        if (!Directory.Exists(altDir)) Directory.CreateDirectory(altDir);
                        System.IO.File.Copy(filePath, Path.Combine(altDir, fileName), true);
                    }
                    catch { }
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
