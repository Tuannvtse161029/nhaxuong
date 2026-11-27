using System.Text.Json;
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
        private static readonly object _catLock = new();
        private static List<CategoryDto>? _categoryStore;
        private static readonly string DataFilePath;

        static CategoryService()
        {
            var dataDir = Path.Combine(AppContext.BaseDirectory, "App_Data");
            if (!Directory.Exists(dataDir))
            {
                try { Directory.CreateDirectory(dataDir); } catch { }
            }
            DataFilePath = Path.Combine(dataDir, "categories_store.json");
        }

        public CategoryService(AppDbContext context)
        {
            _context = context;
        }

        private static List<CategoryDto> GetStore()
        {
            lock (_catLock)
            {
                if (_categoryStore != null) return _categoryStore;

                if (File.Exists(DataFilePath))
                {
                    try
                    {
                        var json = File.ReadAllText(DataFilePath);
                        if (!string.IsNullOrWhiteSpace(json))
                        {
                            var list = JsonSerializer.Deserialize<List<CategoryDto>>(json);
                            if (list != null && list.Count > 0)
                            {
                                _categoryStore = list;
                                return _categoryStore;
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"[CategoryService] Read error: {ex.Message}");
                    }
                }

                _categoryStore = GetDefaultCategories();
                SaveStoreNoLock(_categoryStore);
                return _categoryStore;
            }
        }

        private static void SaveStoreNoLock(List<CategoryDto> list)
        {
            try
            {
                var json = JsonSerializer.Serialize(list, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(DataFilePath, json);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[CategoryService] Save error: {ex.Message}");
            }
        }

        public async Task<List<CategoryDto>> GetAllAsync()
        {
            var store = GetStore();
            await Task.Yield();
            return new List<CategoryDto>(store);
        }

        public async Task<CategoryDto> CreateAsync(CreateCategoryRequest request)
        {
            var store = GetStore();
            var code = string.IsNullOrWhiteSpace(request.Code)
                ? "CAT_" + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
                : request.Code.Trim().ToUpper();

            var exists = store.Any(c => c.Code.Equals(code, StringComparison.OrdinalIgnoreCase));
            if (exists)
            {
                throw new InvalidOperationException($"Danh mục với mã '{code}' đã tồn tại.");
            }

            var nextId = (store.Count > 0 ? store.Max(c => c.Id) : 8) + 1;
            var dto = new CategoryDto
            {
                Id = nextId,
                Code = code,
                Name = request.Name,
                Icon = string.IsNullOrWhiteSpace(request.Icon) ? "Warehouse" : request.Icon,
                Desc = request.Desc ?? string.Empty,
                Active = request.Active
            };

            lock (_catLock)
            {
                store.Add(dto);
                SaveStoreNoLock(store);
            }

            // Sync with DB if possible
            try
            {
                var entity = new Category
                {
                    Code = dto.Code,
                    Name = dto.Name,
                    Icon = dto.Icon,
                    Desc = dto.Desc,
                    Active = dto.Active,
                    CreatedAt = DateTime.UtcNow
                };
                await _context.Categories.AddAsync(entity);
                await _context.SaveChangesAsync();
                if (entity.Id > 0 && entity.Id != dto.Id)
                {
                    dto.Id = entity.Id;
                    lock (_catLock) { SaveStoreNoLock(store); }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[CategoryService] DB sync warning: {ex.Message}");
            }

            return dto;
        }

        public async Task<CategoryDto> UpdateAsync(int id, CreateCategoryRequest request)
        {
            var store = GetStore();
            var item = store.FirstOrDefault(c => c.Id == id);
            if (item == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy danh mục với mã id {id}");
            }

            item.Name = request.Name;
            if (!string.IsNullOrWhiteSpace(request.Icon)) item.Icon = request.Icon;
            if (request.Desc != null) item.Desc = request.Desc;
            item.Active = request.Active;

            lock (_catLock)
            {
                SaveStoreNoLock(store);
            }

            try
            {
                var entity = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);
                if (entity != null)
                {
                    entity.Name = item.Name;
                    entity.Icon = item.Icon;
                    entity.Desc = item.Desc;
                    entity.Active = item.Active;
                    await _context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[CategoryService] DB sync warning: {ex.Message}");
            }

            return item;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var store = GetStore();
            var item = store.FirstOrDefault(c => c.Id == id);
            if (item == null) return false;

            lock (_catLock)
            {
                store.Remove(item);
                SaveStoreNoLock(store);
            }

            try
            {
                var entity = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);
                if (entity != null)
                {
                    _context.Categories.Remove(entity);
                    await _context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[CategoryService] DB sync warning: {ex.Message}");
            }

            return true;
        }

        public async Task<bool> DeleteAsync(string codeOrId)
        {
            if (int.TryParse(codeOrId, out var id))
            {
                return await DeleteAsync(id);
            }

            var store = GetStore();
            var normalizedCode = codeOrId.Trim().ToUpper();
            var item = store.FirstOrDefault(c => c.Code.ToUpper() == normalizedCode);
            if (item == null) return false;

            lock (_catLock)
            {
                store.Remove(item);
                SaveStoreNoLock(store);
            }

            try
            {
                var entity = await _context.Categories.FirstOrDefaultAsync(c => c.Code == normalizedCode);
                if (entity != null)
                {
                    _context.Categories.Remove(entity);
                    await _context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[CategoryService] DB sync warning: {ex.Message}");
            }

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
        private static readonly object _subLock = new();
        private static List<SubscriberDto>? _subStore;
        private static readonly string DataFilePath;

        static SubscriberService()
        {
            var dataDir = Path.Combine(AppContext.BaseDirectory, "App_Data");
            DataFilePath = Path.Combine(dataDir, "subscribers_store.json");
        }

        public SubscriberService(AppDbContext context)
        {
            _context = context;
        }

        private static List<SubscriberDto> GetStore()
        {
            lock (_subLock)
            {
                if (_subStore != null) return _subStore;

                if (File.Exists(DataFilePath))
                {
                    try
                    {
                        var json = File.ReadAllText(DataFilePath);
                        if (!string.IsNullOrWhiteSpace(json))
                        {
                            var list = JsonSerializer.Deserialize<List<SubscriberDto>>(json);
                            if (list != null && list.Count > 0)
                            {
                                _subStore = list;
                                return _subStore;
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"[SubscriberService] Read error: {ex.Message}");
                    }
                }

                _subStore = new List<SubscriberDto>
                {
                    new() { Id = "sub-1", Name = "Công Ty Cơ Khí & Xây Dựng Nam Phát", Email = "namphat.invest@gmail.com", Phone = "0903123456", Channel = "email", Status = "Đang Nhận Tin", Time = DateTime.UtcNow.ToString("HH:mm dd/MM/yyyy") },
                    new() { Id = "sub-2", Name = "Đặng Minh Quân (Nhà Thầu KCN Sóng Thần)", Email = "quan.dang@logistics.vn", Phone = "0918765432", Channel = "hotline", Status = "Đang Nhận Tin", Time = DateTime.UtcNow.ToString("HH:mm dd/MM/yyyy") }
                };
                return _subStore;
            }
        }

        private static void SaveStoreNoLock(List<SubscriberDto> list)
        {
            try
            {
                var json = JsonSerializer.Serialize(list, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(DataFilePath, json);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[SubscriberService] Save error: {ex.Message}");
            }
        }

        public async Task<List<SubscriberDto>> GetAllAsync()
        {
            var store = GetStore();
            await Task.Yield();
            return new List<SubscriberDto>(store);
        }

        public async Task<SubscriberDto> CreateAsync(CreateSubscriberRequest request)
        {
            var store = GetStore();
            var dto = new SubscriberDto
            {
                Id = "sub-" + DateTimeOffset.UtcNow.ToUnixTimeMilliseconds(),
                Name = string.IsNullOrWhiteSpace(request.Name) ? "Khách Hàng Quan Tâm" : request.Name,
                Email = request.Email,
                Phone = request.Phone,
                Channel = string.IsNullOrWhiteSpace(request.Channel) ? "email" : request.Channel,
                Status = "Đang Nhận Tin",
                Time = DateTime.UtcNow.ToString("HH:mm dd/MM/yyyy")
            };

            lock (_subLock)
            {
                store.Insert(0, dto);
                SaveStoreNoLock(store);
            }

            try
            {
                var entity = new Subscriber
                {
                    Id = dto.Id,
                    Name = dto.Name,
                    Email = dto.Email,
                    Phone = dto.Phone,
                    Channel = dto.Channel,
                    Status = dto.Status,
                    CreatedAt = DateTime.UtcNow
                };
                await _context.Subscribers.AddAsync(entity);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[SubscriberService] DB sync warning: {ex.Message}");
            }

            return dto;
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
        private static readonly object _noticeLock = new();
        private static List<NoticeDto>? _noticeStore;
        private static string _activeTicker = "Tổng kho khung xưởng & sắt thép tại Dĩ An - Bình Dương & Lâm Đồng. Xem mô hình 3D kết cấu 360° trực tuyến!";
        private static readonly string DataFilePath;

        static NoticeService()
        {
            var dataDir = Path.Combine(AppContext.BaseDirectory, "App_Data");
            DataFilePath = Path.Combine(dataDir, "notices_store.json");
        }

        public NoticeService(AppDbContext context)
        {
            _context = context;
        }

        private static List<NoticeDto> GetStore()
        {
            lock (_noticeLock)
            {
                if (_noticeStore != null) return _noticeStore;

                if (File.Exists(DataFilePath))
                {
                    try
                    {
                        var json = File.ReadAllText(DataFilePath);
                        if (!string.IsNullOrWhiteSpace(json))
                        {
                            var list = JsonSerializer.Deserialize<List<NoticeDto>>(json);
                            if (list != null && list.Count > 0)
                            {
                                _noticeStore = list;
                                return _noticeStore;
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"[NoticeService] Read error: {ex.Message}");
                    }
                }

                _noticeStore = new List<NoticeDto>
                {
                    new() { Id = 1, Title = "Hạ thủy lô thép I300 và I500 tại ICD Tân Cảng Dĩ An", Content = "Tổng kho vừa nhập về 150 tấn thép hình đúc chuẩn Posco sẵn sàng cấp dự án.", Badge = "Mới Về", Active = true, CreatedAt = "10:00 Hôm nay" },
                    new() { Id = 2, Title = "Cập nhật bản vẽ 3D tương tác xưởng Zamil 24x84m", Content = "Khách hàng có thể quét mã hoặc xem mô hình kết cấu 3D trực tiếp trên di động.", Badge = "Công Nghệ", Active = true, CreatedAt = "14:30 Hôm qua" }
                };
                return _noticeStore;
            }
        }

        private static void SaveStoreNoLock(List<NoticeDto> list)
        {
            try
            {
                var json = JsonSerializer.Serialize(list, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(DataFilePath, json);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[NoticeService] Save error: {ex.Message}");
            }
        }

        public async Task<List<NoticeDto>> GetAllAsync()
        {
            var store = GetStore();
            await Task.Yield();
            return new List<NoticeDto>(store);
        }

        public async Task<NoticeDto> CreateAsync(CreateNoticeRequest request)
        {
            var store = GetStore();
            var nextId = (store.Count > 0 ? store.Max(n => n.Id) : 10) + 1;
            var dto = new NoticeDto
            {
                Id = nextId,
                Title = request.Title,
                Content = request.Content,
                Badge = string.IsNullOrWhiteSpace(request.Badge) ? "Thông Báo" : request.Badge,
                Active = request.Active,
                CreatedAt = DateTime.UtcNow.ToString("HH:mm dd/MM/yyyy")
            };

            lock (_noticeLock)
            {
                store.Insert(0, dto);
                SaveStoreNoLock(store);
            }

            try
            {
                var entity = new NoticeItem
                {
                    Title = dto.Title,
                    Content = dto.Content,
                    Badge = dto.Badge,
                    Active = dto.Active,
                    CreatedAt = DateTime.UtcNow.ToString("yyyy-MM-dd")
                };
                await _context.Notices.AddAsync(entity);
                await _context.SaveChangesAsync();
                if (entity.Id > 0 && entity.Id != dto.Id)
                {
                    dto.Id = entity.Id;
                    lock (_noticeLock) { SaveStoreNoLock(store); }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[NoticeService] DB sync warning: {ex.Message}");
            }

            return dto;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var store = GetStore();
            var item = store.FirstOrDefault(n => n.Id == id);
            if (item == null) return false;

            lock (_noticeLock)
            {
                store.Remove(item);
                SaveStoreNoLock(store);
            }

            try
            {
                var entity = await _context.Notices.FirstOrDefaultAsync(n => n.Id == id);
                if (entity != null)
                {
                    _context.Notices.Remove(entity);
                    await _context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[NoticeService] DB sync warning: {ex.Message}");
            }

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

        public async Task<string> GetActiveTickerAsync()
        {
            await Task.Yield();
            return _activeTicker;
        }

        public async Task<string> UpdateActiveTickerAsync(string text)
        {
            if (!string.IsNullOrWhiteSpace(text))
            {
                _activeTicker = text.Trim();
            }
            await Task.Yield();
            return _activeTicker;
        }
    }
}
