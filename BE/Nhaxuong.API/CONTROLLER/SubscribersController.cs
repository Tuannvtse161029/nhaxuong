using Microsoft.AspNetCore.Mvc;
using Nhaxuong.SERVICE.DTOs.Request;
using Nhaxuong.SERVICE.Services;

namespace Nhaxuong.API.CONTROLLER
{
    [ApiController]
    [Route("api/subscribers")]
    public class SubscribersController : ControllerBase
    {
        private readonly ISubscriberService _subscriberService;

        public SubscribersController(ISubscriberService subscriberService)
        {
            _subscriberService = subscriberService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var subscribers = await _subscriberService.GetAllAsync();
            return Ok(subscribers);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateSubscriberRequest request)
        {
            try
            {
                var created = await _subscriberService.CreateAsync(request);
                return Ok(created);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
