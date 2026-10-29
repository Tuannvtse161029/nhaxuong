using Microsoft.AspNetCore.Mvc;
using Nhaxuong.SERVICE.DTOs.Request;
using Nhaxuong.SERVICE.Services;

namespace Nhaxuong.API.CONTROLLER
{
    [ApiController]
    [Route("api/v1/properties")]
    [Route("api/properties")]
    [Route("properties")]
    [Route("api/items")]
    [Route("items")]
    public class PropertiesController : ControllerBase
    {
        private readonly IPropertyService _propertyService;

        public PropertiesController(IPropertyService propertyService)
        {
            _propertyService = propertyService;
        }

        [HttpGet]
        public async Task<IActionResult> GetProperties([FromQuery] PropertyFilterQuery query)
        {
            var result = await _propertyService.GetPropertiesAsync(query);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var item = await _propertyService.GetByIdAsync(id);
            if (item == null)
            {
                return NotFound(new { message = $"Không tìm thấy bất động sản với mã {id}" });
            }
            return Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePropertyRequest request)
        {
            try
            {
                var created = await _propertyService.CreateAsync(request);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] UpdatePropertyRequest request)
        {
            try
            {
                var updated = await _propertyService.UpdateAsync(id, request);
                return Ok(updated);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var success = await _propertyService.DeleteAsync(id);
            if (!success)
            {
                return NotFound(new { message = $"Không tìm thấy bất động sản với mã {id}" });
            }
            return Ok(new { message = "Đã xóa thành công" });
        }
    }
}
