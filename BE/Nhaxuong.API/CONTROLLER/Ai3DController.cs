using Microsoft.AspNetCore.Mvc;
using Nhaxuong.SERVICE.Services;

namespace Nhaxuong.API.CONTROLLER
{
    [ApiController]
    [Route("api/ai")]
    [Route("ai")]
    public class Ai3DController : ControllerBase
    {
        private readonly IAi3DService _ai3DService;

        public Ai3DController(IAi3DService ai3DService)
        {
            _ai3DService = ai3DService;
        }

        [HttpPost("generate-3d")]
        public async Task<IActionResult> Generate3D([FromBody] Generate3DRequest request)
        {
            try
            {
                var result = await _ai3DService.Generate3DModelAsync(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    }
}
