using Microsoft.AspNetCore.Mvc;

namespace Nhaxuong.API.CONTROLLER
{
    [ApiController]
    [Route("api/users")]
    [Route("users")]
    public class UsersController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetUsers()
        {
            var adminList = new[]
            {
                new
                {
                    id = "usr-admin-1",
                    email = "admin@nhaxuong.vn",
                    name = "Ban Quản Trị Nhaxuong.vn",
                    phone = "0965985468",
                    role = "admin",
                    active = true,
                    createdAt = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss")
                }
            };
            return Ok(adminList);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(string id)
        {
            return Ok(new
            {
                id = id,
                email = "admin@nhaxuong.vn",
                name = "Ban Quản Trị Nhaxuong.vn",
                phone = "0965985468",
                role = "admin",
                active = true
            });
        }
    }
}
