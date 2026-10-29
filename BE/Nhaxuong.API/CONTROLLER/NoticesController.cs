using Microsoft.AspNetCore.Mvc;
using Nhaxuong.SERVICE.DTOs.Request;
using Nhaxuong.SERVICE.Services;

namespace Nhaxuong.API.CONTROLLER
{
    [ApiController]
    [Route("api/notices")]
    public class NoticesController : ControllerBase
    {
        private readonly INoticeService _noticeService;

        public NoticesController(INoticeService noticeService)
        {
            _noticeService = noticeService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var notices = await _noticeService.GetAllAsync();
            return Ok(notices);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateNoticeRequest request)
        {
            try
            {
                var created = await _noticeService.CreateAsync(request);
                return Ok(created);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var success = await _noticeService.DeleteAsync(id);
            if (!success)
            {
                return NotFound(new { message = $"Không tìm thấy thông báo '{id}'" });
            }
            return Ok(new { message = "Đã gỡ thông báo thành công" });
        }

        [HttpGet("ticker")]
        public async Task<IActionResult> GetTicker()
        {
            var ticker = await _noticeService.GetActiveTickerAsync();
            return Ok(new { ticker });
        }

        [HttpPut("ticker")]
        public async Task<IActionResult> UpdateTicker([FromBody] UpdateTickerRequest request)
        {
            var ticker = await _noticeService.UpdateActiveTickerAsync(request.Text);
            return Ok(new { ticker, message = "Đã cập nhật dòng chữ chạy trang chủ thành công" });
        }
    }
}
