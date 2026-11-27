using Microsoft.AspNetCore.Mvc;
using Nhaxuong.SERVICE.DTOs.Request;
using Nhaxuong.SERVICE.Services;

namespace Nhaxuong.API.CONTROLLER
{
    [ApiController]
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

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateCategoryRequest request)
        {
            try
            {
                var updated = await _categoryService.UpdateAsync(id, request);
                return Ok(updated);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{codeOrId}")]
        public async Task<IActionResult> Delete(string codeOrId)
        {
            try
            {
                var success = await _categoryService.DeleteAsync(codeOrId);
                if (!success)
                {
                    return NotFound(new { message = $"Không tìm thấy danh mục '{codeOrId}'" });
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
