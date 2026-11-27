using Microsoft.EntityFrameworkCore;
using Nhaxuong.MODEL.Configurations;
using Nhaxuong.MODEL.Entities;
using Nhaxuong.SERVICE.DTOs.Request;
using Nhaxuong.SERVICE.DTOs.Response;

namespace Nhaxuong.SERVICE.Services
{
    public interface ICategoryService
    {
        Task<List<CategoryDto>> GetAllAsync();
        Task<CategoryDto> CreateAsync(CreateCategoryRequest request);
        Task<CategoryDto> UpdateAsync(int id, CreateCategoryRequest request);
        Task<bool> DeleteAsync(string codeOrId);
        Task<bool> DeleteAsync(int id);
    }

    public class CategoryService : ICategoryService
    {
        private readonly AppDbContext _context;

        public CategoryService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<CategoryDto>> GetAllAsync()
        {
            try
            {
                var categories = await _context.Categories
                    .OrderBy(c => c.Id)
                    .ToListAsync();

                if (categories.Count == 0)
                {
                    return GetDefaultCategories();
                }

                return categories.Select(c => new CategoryDto
                {
                    Id = c.Id,
                    Code = c.Code,
                    Name = c.Name,
                    Icon = c.Icon,
                    Desc = c.Desc,
                    Active = c.Active
                }).ToList();
            }
            catch (Exception)
            {
                return GetDefaultCategories();
            }
        }

        public async Task<CategoryDto> CreateAsync(CreateCategoryRequest request)
        {
            var code = string.IsNullOrWhiteSpace(request.Code)
                ? "CAT_" + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
                : request.Code.Trim().ToUpper();

            var exists = await _context.Categories.AnyAsync(c => c.Code == code);
            if (exists)
            {
                throw new InvalidOperationException($"Danh mục với mã '{code}' đã tồn tại.");
            }

            var entity = new Category
            {
                Code = code,
                Name = request.Name,
                Icon = string.IsNullOrWhiteSpace(request.Icon) ? "Warehouse" : request.Icon,
                Desc = request.Desc ?? string.Empty,
                Active = request.Active,
                CreatedAt = DateTime.UtcNow
            };

            await _context.Categories.AddAsync(entity);
            await _context.SaveChangesAsync();

            return new CategoryDto
            {
                Id = entity.Id,
                Code = entity.Code,
                Name = entity.Name,
                Icon = entity.Icon,
                Desc = entity.Desc,
                Active = entity.Active
            };
        }

        public async Task<CategoryDto> UpdateAsync(int id, CreateCategoryRequest request)
        {
            var entity = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);
            if (entity == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy danh mục với mã id {id}");
            }

            entity.Name = request.Name;
            if (!string.IsNullOrWhiteSpace(request.Icon)) entity.Icon = request.Icon;
            if (request.Desc != null) entity.Desc = request.Desc;
            entity.Active = request.Active;

            await _context.SaveChangesAsync();

            return new CategoryDto
            {
                Id = entity.Id,
                Code = entity.Code,
                Name = entity.Name,
                Icon = entity.Icon,
                Desc = entity.Desc,
                Active = entity.Active
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);
            if (entity == null) return false;

            _context.Categories.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(string codeOrId)
        {
            if (int.TryParse(codeOrId, out var id))
            {
                return await DeleteAsync(id);
            }

            var normalizedCode = codeOrId.Trim().ToUpper();
            var entity = await _context.Categories.FirstOrDefaultAsync(c => c.Code == normalizedCode);
            if (entity == null) return false;

            _context.Categories.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        private static List<CategoryDto> GetDefaultCategories()
        {
            return new List<CategoryDto>
            {
                new() { Id = 1, Code = "BAN_KHUNG_XUONG", Name = "Bán Khung Nhà Xưởng", Icon = "Warehouse", Desc = "Khung nhà xưởng tiền chế, kết cấu Zamil khẩu độ lớn", Active = true },
                new() { Id = 2, Code = "COT_KEO", Name = "Cột Kèo & Dầm Thép", Icon = "Layers", Desc = "Cột dầm H, I, kèo mái, hệ giằng, xà gồ Z và C mạ kẽm", Active = true },
                new() { Id = 3, Code = "THEP_HINH_I", Name = "Thép Hình I (I 200, I 300, I 500)", Icon = "Grid", Desc = "Thép hình đúc I 200, I 300, I 500 cắt theo quy cách tiêu chuẩn", Active = true },
                new() { Id = 4, Code = "TON_LOP_VACH", Name = "Tôn (Tôn Lợp & Tôn Vách)", Icon = "FileText", Desc = "Tôn lợp mái 5 sóng, 9 sóng, tôn chống nóng PU và tôn vách bao che", Active = true },
                new() { Id = 5, Code = "TON_SAN_DECK", Name = "Tôn Sàn (Decking)", Icon = "LayoutGrid", Desc = "Tôn sàn Deck H50W1000 mạ kẽm cuộn đúc bê tông sàn nhà kho", Active = true },
                new() { Id = 6, Code = "ONG_PCCC", Name = "Ống Phòng Cháy Chữa Cháy (PCCC)", Icon = "ShieldAlert", Desc = "Ống thép hàn đen, ống mạ kẽm PCCC tiêu chuẩn ASTM/BS", Active = true },
                new() { Id = 7, Code = "THANH_LY_XUONG", Name = "Thanh Lý Trọn Gói Nhà Xưởng", Icon = "Truck", Desc = "Thu mua thanh lý và bàn giao trọn gói nhà xưởng cũ tại công trình", Active = true },
                new() { Id = 8, Code = "THIET_KE_3D", Name = "Xem Thiết Kế 3D Nhà Xưởng", Icon = "Box", Desc = "Bản vẽ 2D AutoCAD & Mô hình 3D tương tác 360°, tra cứu theo kích thước và kết cấu", Active = true }
            };
        }
    }

    public interface ISubscriberService
    {
        Task<List<SubscriberDto>> GetAllAsync();
        Task<SubscriberDto> CreateAsync(CreateSubscriberRequest request);
    }

    public class SubscriberService : ISubscriberService
    {
        private readonly AppDbContext _context;

        public SubscriberService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<SubscriberDto>> GetAllAsync()
        {
            try
            {
                var subscribers = await _context.Subscribers
                    .OrderByDescending(s => s.CreatedAt)
                    .ToListAsync();

                return subscribers.Select(s => new SubscriberDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Email = s.Email,
                    Phone = s.Phone,
                    Channel = s.Channel,
                    Status = s.Status,
                    Time = s.CreatedAt.ToString("HH:mm dd/MM/yyyy")
                }).ToList();
            }
            catch (Exception)
            {
                return new List<SubscriberDto>
                {
                    new() { Id = "sub-1", Name = "Công Ty Cơ Khí & Xây Dựng Nam Phát", Email = "namphat.invest@gmail.com", Phone = "0903123456", Channel = "email", Status = "Đang Nhận Tin", Time = DateTime.UtcNow.ToString("HH:mm dd/MM/yyyy") },
                    new() { Id = "sub-2", Name = "Đặng Minh Quân (Nhà Thầu KCN Sóng Thần)", Email = "quan.dang@logistics.vn", Phone = "0918765432", Channel = "hotline", Status = "Đang Nhận Tin", Time = DateTime.UtcNow.ToString("HH:mm dd/MM/yyyy") }
                };
            }
        }

        public async Task<SubscriberDto> CreateAsync(CreateSubscriberRequest request)
        {
            var now = DateTime.UtcNow;
            var entity = new Subscriber
            {
                Id = "sub-" + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                Name = string.IsNullOrWhiteSpace(request.Name) ? "Khách Hàng Quan Tâm" : request.Name,
                Email = request.Email,
                Phone = request.Phone,
                Channel = string.IsNullOrWhiteSpace(request.Channel) ? "email" : request.Channel,
                Status = "Đang Nhận Tin",
                CreatedAt = now
            };

            await _context.Subscribers.AddAsync(entity);
            await _context.SaveChangesAsync();

            return new SubscriberDto
            {
                Id = entity.Id,
                Name = entity.Name,
                Email = entity.Email,
                Phone = entity.Phone,
                Channel = entity.Channel,
                Status = entity.Status,
                Time = entity.CreatedAt.ToString("HH:mm dd/MM/yyyy")
            };
        }
    }

    public interface INoticeService
    {
        Task<List<NoticeDto>> GetAllAsync();
        Task<NoticeDto> CreateAsync(CreateNoticeRequest request);
        Task<bool> DeleteAsync(int id);
        Task<bool> DeleteAsync(string id);
        Task<string> GetActiveTickerAsync();
        Task<string> UpdateActiveTickerAsync(string text);
    }

    public class NoticeService : INoticeService
    {
        private readonly AppDbContext _context;
        private static string _activeTicker = "Tổng kho khung xưởng & sắt thép tại Dĩ An - Bình Dương & Lâm Đồng. Xem mô hình 3D kết cấu 360° trực tuyến!";

        public NoticeService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<NoticeDto>> GetAllAsync()
        {
            try
            {
                var notices = await _context.Notices
                    .OrderByDescending(n => n.Id)
                    .ToListAsync();

                return notices.Select(n => new NoticeDto
                {
                    Id = n.Id,
                    Title = n.Title,
                    Content = n.Content,
                    Badge = n.Badge,
                    Active = n.Active,
                    CreatedAt = n.CreatedAt
                }).ToList();
            }
            catch (Exception)
            {
                return new List<NoticeDto>
                {
                    new()
                    {
                        Id = 1,
                        Title = "Khai trương kho bãi khung xưởng & sắt thép tại Dĩ An - Bình Dương",
                        Content = "Tổng kho 15.000m² tại Dĩ An sẵn sàng phục vụ cẩu tải khung thép Zamil, dầm I và tôn sàn giao ngay.",
                        Badge = "Kho Hàng Mới",
                        Active = true,
                        CreatedAt = DateTime.UtcNow.ToString("yyyy-MM-dd")
                    }
                };
            }
        }

        public async Task<NoticeDto> CreateAsync(CreateNoticeRequest request)
        {
            var entity = new NoticeItem
            {
                Title = request.Title,
                Content = request.Content,
                Badge = string.IsNullOrWhiteSpace(request.Badge) ? "Thông Báo" : request.Badge,
                Active = request.Active,
                CreatedAt = DateTime.UtcNow.ToString("yyyy-MM-dd")
            };

            await _context.Notices.AddAsync(entity);
            await _context.SaveChangesAsync();

            // Set current ticker to the new notice
            _activeTicker = entity.Title;

            return new NoticeDto
            {
                Id = entity.Id,
                Title = entity.Title,
                Content = entity.Content,
                Badge = entity.Badge,
                Active = entity.Active,
                CreatedAt = entity.CreatedAt
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.Notices.FirstOrDefaultAsync(n => n.Id == id);
            if (entity == null) return false;

            _context.Notices.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            if (int.TryParse(id, out var intId))
            {
                return await DeleteAsync(intId);
            }
            return false;
        }

        public Task<string> GetActiveTickerAsync()
        {
            return Task.FromResult(_activeTicker);
        }

        public Task<string> UpdateActiveTickerAsync(string text)
        {
            _activeTicker = text;
            return Task.FromResult(_activeTicker);
        }
    }
}
