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
        Task<bool> DeleteAsync(string code);
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
            var categories = await _context.Categories
                .OrderBy(c => c.CreatedAt)
                .ToListAsync();

            return categories.Select(c => new CategoryDto
            {
                Code = c.Code,
                Name = c.Name,
                Icon = c.Icon,
                Desc = c.Desc,
                Active = c.Active
            }).ToList();
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
                Code = entity.Code,
                Name = entity.Name,
                Icon = entity.Icon,
                Desc = entity.Desc,
                Active = entity.Active
            };
        }

        public async Task<bool> DeleteAsync(string code)
        {
            // Core categories protection
            var normalizedCode = code.Trim().ToUpper();
            if (normalizedCode == "SALE" || normalizedCode == "RENT" || normalizedCode == "RECYCLED_STEEL")
            {
                throw new InvalidOperationException("Không thể xóa các danh mục hệ thống cốt lõi!");
            }

            var entity = await _context.Categories.FirstOrDefaultAsync(c => c.Code == normalizedCode);
            if (entity == null) return false;

            _context.Categories.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
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
                Time = s.Time
            }).ToList();
        }

        public async Task<SubscriberDto> CreateAsync(CreateSubscriberRequest request)
        {
            var now = DateTime.UtcNow;
            var timeStr = $"{DateTime.Now:HH:mm} Hôm nay";

            var entity = new Subscriber
            {
                Id = "sub-" + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                Name = string.IsNullOrWhiteSpace(request.Name) ? "Khách Hàng Mới" : request.Name,
                Email = request.Email,
                Phone = request.Phone,
                Channel = string.IsNullOrWhiteSpace(request.Channel) ? "email" : request.Channel,
                Status = "Đang Nhận Tin",
                Time = timeStr,
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
                Time = entity.Time
            };
        }
    }

    public interface INoticeService
    {
        Task<List<NoticeDto>> GetAllAsync();
        Task<NoticeDto> CreateAsync(CreateNoticeRequest request);
        Task<bool> DeleteAsync(string id);
        Task<string> GetActiveTickerAsync();
        Task<string> UpdateActiveTickerAsync(string text);
    }

    public class NoticeService : INoticeService
    {
        private readonly AppDbContext _context;
        private static string _activeTicker = "Ưu đãi thuế quan mở rộng KCN VSIP 1, Long Đức. Hỗ trợ mô hình 3D HTML xoay tương tác 360° và Audio thuyết minh trực quan!";

        public NoticeService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<NoticeDto>> GetAllAsync()
        {
            var notices = await _context.Notices
                .OrderByDescending(n => n.CreatedAt)
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

        public async Task<NoticeDto> CreateAsync(CreateNoticeRequest request)
        {
            var entity = new NoticeItem
            {
                Id = "not-" + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
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

        public async Task<bool> DeleteAsync(string id)
        {
            var entity = await _context.Notices.FirstOrDefaultAsync(n => n.Id == id);
            if (entity == null) return false;

            _context.Notices.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
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
