using Microsoft.AspNetCore.Mvc;
using Nhaxuong.SERVICE.DTOs.Request;
using Nhaxuong.SERVICE.Services;

namespace Nhaxuong.API.CONTROLLER
{
    [ApiController]
    [Route("api/v1/categories")]
    [Route("api/categories")]
    [Route("categories")]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _categoryService.GetAllAsync();
            return Ok(categories);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCategoryRequest request)
        {
            try
            {
                var created = await _categoryService.CreateAsync(request);
                return Ok(created);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{code}")]
        public async Task<IActionResult> Delete(string code)
        {
            try
            {
                var success = await _categoryService.DeleteAsync(code);
                if (!success)
                {
                    return NotFound(new { message = $"Không tìm thấy danh mục '{code}'" });
                }
                return Ok(new { message = "Đã xóa danh mục thành công" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
