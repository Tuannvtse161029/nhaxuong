using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Nhaxuong.MODEL.Configurations;
using Nhaxuong.MODEL.Entities;
using Nhaxuong.SERVICE.DTOs.Request;
using Nhaxuong.SERVICE.DTOs.Response;

namespace Nhaxuong.SERVICE.Services
{
    public interface IPropertyService
    {
        Task<PagedResult<PropertyDto>> GetPropertiesAsync(PropertyFilterQuery query);
        Task<PropertyDto?> GetByIdAsync(int id);
        Task<PropertyDto?> GetByIdAsync(string id);
        Task<PropertyDto> CreateAsync(CreatePropertyRequest request);
        Task<PropertyDto> UpdateAsync(int id, UpdatePropertyRequest request);
        Task<PropertyDto> UpdateAsync(string id, UpdatePropertyRequest request);
        Task<bool> DeleteAsync(int id);
        Task<bool> DeleteAsync(string id);
    }

    public class PropertyService : IPropertyService
    {
        private readonly AppDbContext _context;
        private static readonly object _fileLock = new();
        private static List<PropertyDto>? _memoryStore;
        private static readonly string DataFilePath;

        static PropertyService()
        {
            var baseDir = AppContext.BaseDirectory;
            var dataDir = Path.Combine(baseDir, "App_Data");
            if (!Directory.Exists(dataDir))
            {
                try { Directory.CreateDirectory(dataDir); } catch { }
            }
            DataFilePath = Path.Combine(dataDir, "properties_store.json");
        }

        public PropertyService(AppDbContext context)
        {
            _context = context;
        }

        private static List<PropertyDto> GetStore()
        {
            lock (_fileLock)
            {
                if (_memoryStore != null) return _memoryStore;

                if (File.Exists(DataFilePath))
                {
                    try
                    {
                        var json = File.ReadAllText(DataFilePath);
                        if (!string.IsNullOrWhiteSpace(json))
                        {
                            var list = JsonSerializer.Deserialize<List<PropertyDto>>(json);
                            if (list != null && list.Count > 0)
                            {
                                _memoryStore = list;
                                return _memoryStore;
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"[PropertyService] Error reading store from {DataFilePath}: {ex.Message}");
                    }
                }

                _memoryStore = GetInitialProperties();
                SaveStoreNoLock(_memoryStore);
                return _memoryStore;
            }
        }

        private static void SaveStore(List<PropertyDto> list)
        {
            lock (_fileLock)
            {
                SaveStoreNoLock(list);
            }
        }

        private static void SaveStoreNoLock(List<PropertyDto> list)
        {
            try
            {
                var dir = Path.GetDirectoryName(DataFilePath);
                if (!string.IsNullOrEmpty(dir) && !Directory.Exists(dir))
                {
                    Directory.CreateDirectory(dir);
                }
                var json = JsonSerializer.Serialize(list, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(DataFilePath, json);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[PropertyService] Error saving store to {DataFilePath}: {ex.Message}");
            }
        }

        public async Task<PagedResult<PropertyDto>> GetPropertiesAsync(PropertyFilterQuery query)
        {
            var page = query.Page <= 0 ? 1 : query.Page;
            var pageSize = query.PageSize <= 0 ? 12 : query.PageSize;

            var store = GetStore();
            IEnumerable<PropertyDto> filtered = new List<PropertyDto>(store);

            // Filter Type / Category
            if (!string.IsNullOrWhiteSpace(query.Type) && query.Type.ToUpper() != "ALL")
            {
                var targetType = query.Type.Trim().ToUpper();
                filtered = filtered.Where(p =>
                    (p.Type?.ToUpper() == targetType) ||
                    (!string.IsNullOrEmpty(p.CategoryName) && p.CategoryName.ToUpper().Contains(targetType)));
            }

            // Filter CategoryId
            if (query.CategoryId.HasValue && query.CategoryId.Value > 0)
            {
                filtered = filtered.Where(p => p.CategoryId == query.CategoryId.Value);
            }

            // Filter StockStatus (IN_STOCK, OUT_OF_STOCK)
            if (!string.IsNullOrWhiteSpace(query.StockStatus) && query.StockStatus.ToUpper() != "ALL")
            {
                var targetStock = query.StockStatus.Trim().ToUpper();
                filtered = filtered.Where(p => (p.StockStatus ?? "IN_STOCK").ToUpper() == targetStock);
            }

            // Filter StorageLocation (AT_YARD, AT_SITE)
            if (!string.IsNullOrWhiteSpace(query.StorageLocation) && query.StorageLocation.ToUpper() != "ALL")
            {
                var targetLoc = query.StorageLocation.Trim().ToUpper();
                filtered = filtered.Where(p => (p.StorageLocation ?? "AT_YARD").ToUpper() == targetLoc);
            }

            // Filter StructureType (Thép I, Zamil, Kèo Tiệp)
            if (!string.IsNullOrWhiteSpace(query.StructureType) && query.StructureType.ToUpper() != "ALL")
            {
                var st = query.StructureType.Trim().ToLower();
                filtered = filtered.Where(p => p.StructureType != null && p.StructureType.ToLower().Contains(st));
            }

            // Filter HasCrane
            if (query.HasCrane.HasValue)
            {
                filtered = filtered.Where(p => p.HasCrane == query.HasCrane.Value);
            }

            // Dimension filters
            if (query.MinLength.HasValue && query.MinLength.Value > 0)
            {
                filtered = filtered.Where(p => p.Length.HasValue && p.Length.Value >= query.MinLength.Value);
            }
            if (query.MaxLength.HasValue && query.MaxLength.Value > 0)
            {
                filtered = filtered.Where(p => p.Length.HasValue && p.Length.Value <= query.MaxLength.Value);
            }
            if (query.MinWidth.HasValue && query.MinWidth.Value > 0)
            {
                filtered = filtered.Where(p => p.Width.HasValue && p.Width.Value >= query.MinWidth.Value);
            }
            if (query.MaxWidth.HasValue && query.MaxWidth.Value > 0)
            {
                filtered = filtered.Where(p => p.Width.HasValue && p.Width.Value <= query.MaxWidth.Value);
            }

            // Keyword search
            if (!string.IsNullOrWhiteSpace(query.Keyword))
            {
                var kw = query.Keyword.Trim().ToLower();
                filtered = filtered.Where(p =>
                    (p.Title != null && p.Title.ToLower().Contains(kw)) ||
                    (p.Desc != null && p.Desc.ToLower().Contains(kw)) ||
                    (p.Kcn != null && p.Kcn.ToLower().Contains(kw)) ||
                    (p.District != null && p.District.ToLower().Contains(kw)) ||
                    (p.City != null && p.City.ToLower().Contains(kw)) ||
                    (p.Province != null && p.Province.ToLower().Contains(kw)));
            }

            // Location filters
            if (!string.IsNullOrWhiteSpace(query.Province) && query.Province != "Toàn Quốc" && query.Province != "ALL")
            {
                var prov = query.Province.Trim().ToLower();
                filtered = filtered.Where(p =>
                    (p.Province != null && p.Province.ToLower().Contains(prov)) ||
                    (p.City != null && p.City.ToLower().Contains(prov)));
            }

            if (!string.IsNullOrWhiteSpace(query.City) && query.City != "ALL")
            {
                var city = query.City.Trim().ToLower();
                filtered = filtered.Where(p =>
                    (p.City != null && p.City.ToLower().Contains(city)) ||
                    (p.Province != null && p.Province.ToLower().Contains(city)));
            }

            if (!string.IsNullOrWhiteSpace(query.District) && query.District != "ALL")
            {
                var dist = query.District.Trim().ToLower();
                filtered = filtered.Where(p =>
                    (p.District != null && p.District.ToLower().Contains(dist)) ||
                    (p.Kcn != null && p.Kcn.ToLower().Contains(dist)));
            }

            // Price range filter
            if (query.MinPrice.HasValue && query.MinPrice > 0)
            {
                filtered = filtered.Where(p => p.Price >= query.MinPrice.Value);
            }
            if (query.MaxPrice.HasValue && query.MaxPrice > 0)
            {
                filtered = filtered.Where(p => p.Price <= query.MaxPrice.Value);
            }

            // Sorting
            switch (query.SortBy?.ToLower())
            {
                case "price-asc":
                    filtered = filtered.OrderBy(p => p.Price);
                    break;
                case "price-desc":
                    filtered = filtered.OrderByDescending(p => p.Price);
                    break;
                case "newest":
                default:
                    filtered = filtered.OrderByDescending(p => p.Id);
                    break;
            }

            var totalItems = filtered.Count();
            var items = filtered.Skip((page - 1) * pageSize).Take(pageSize).ToList();

            await Task.Yield();
            return new PagedResult<PropertyDto>
            {
                Items = items,
                Total = totalItems,
                Page = page,
                PageSize = pageSize
            };
        }

        public async Task<PropertyDto?> GetByIdAsync(int id)
        {
            var store = GetStore();
            var item = store.FirstOrDefault(p => p.Id == id);
            await Task.Yield();
            return item;
        }

        public async Task<PropertyDto?> GetByIdAsync(string id)
        {
            if (int.TryParse(id, out var intId))
            {
                return await GetByIdAsync(intId);
            }

            // Support string id matching like "prop-kx-1"
            var store = GetStore();
            var item = store.FirstOrDefault(p => p.Id.ToString() == id);
            await Task.Yield();
            return item;
        }

        public async Task<PropertyDto> CreateAsync(CreatePropertyRequest request)
        {
            var store = GetStore();
            var nextId = (store.Count > 0 ? store.Max(p => p.Id) : 100) + 1;

            var type = string.IsNullOrWhiteSpace(request.Type) ? "BAN_KHUNG_XUONG" : request.Type.ToUpper();
            var typeDisplay = ResolveTypeDisplay(type, request.TypeDisplay);
            var priceDisplay = FormatPrice(request.Price, type);

            // Images normalization
            var imageList = new List<string>();
            if (request.Images != null && request.Images.Count > 0)
            {
                imageList.AddRange(request.Images.Where(s => !string.IsNullOrWhiteSpace(s)));
            }
            else if (request.Gallery != null && request.Gallery.Count > 0)
            {
                imageList.AddRange(request.Gallery.Where(s => !string.IsNullOrWhiteSpace(s)));
            }

            var primaryImage = !string.IsNullOrWhiteSpace(request.Image)
                ? request.Image
                : (imageList.Count > 0 ? imageList[0] : "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80");

            if (imageList.Count == 0)
            {
                imageList.Add(primaryImage);
            }

            var dto = new PropertyDto
            {
                Id = nextId,
                Title = request.Title,
                Type = type,
                TypeDisplay = typeDisplay,
                Status = request.Status?.Trim() ?? "Còn hàng",
                StockStatus = string.IsNullOrWhiteSpace(request.StockStatus) ? "IN_STOCK" : request.StockStatus.Trim().ToUpper(),
                StorageLocation = string.IsNullOrWhiteSpace(request.StorageLocation) ? "AT_YARD" : request.StorageLocation.Trim().ToUpper(),
                CategoryId = request.CategoryId ?? ResolveDefaultCategoryId(type),
                CategoryName = typeDisplay,
                Province = string.IsNullOrWhiteSpace(request.Province) ? (request.City ?? "Bình Dương") : request.Province,
                City = request.City ?? request.Province,
                District = request.District,
                Kcn = string.IsNullOrWhiteSpace(request.Kcn) ? "Kho bãi miền Nam" : request.Kcn,
                Price = request.Price,
                PriceDisplay = priceDisplay,
                UnitPrice = request.UnitPrice,
                Area = string.IsNullOrWhiteSpace(request.Area) ? "Tiêu chuẩn" : request.Area,
                Length = request.Length,
                Width = request.Width,
                StructureType = request.StructureType ?? "Zamil",
                HasCrane = request.HasCrane ?? false,
                CraneCapacity = request.CraneCapacity,
                BrokerPhone = string.IsNullOrWhiteSpace(request.BrokerPhone) ? "0965 985 468" : request.BrokerPhone,
                Image = primaryImage,
                Images = imageList,
                Gallery = imageList,
                VideoUrl = request.VideoUrl,
                AudioUrl = request.AudioUrl,
                Model3DUrl = request.Model3DUrl,
                Drawing2DUrl = request.Drawing2DUrl,
                Desc = request.Desc ?? string.Empty,
                EmailNotified = request.TriggerEmail,
                Created = DateTime.UtcNow.ToString("HH:mm dd/MM/yyyy")
            };

            // Save to persistent file store
            lock (_fileLock)
            {
                store.Insert(0, dto);
                SaveStoreNoLock(store);
            }

            // Sync with PostgreSQL database if available (non-blocking fallback)
            try
            {
                var entity = new PropertyItem
                {
                    Title = dto.Title,
                    Type = dto.Type,
                    TypeDisplay = dto.TypeDisplay,
                    Status = dto.Status,
                    StockStatus = dto.StockStatus,
                    StorageLocation = dto.StorageLocation,
                    CategoryId = dto.CategoryId,
                    Province = dto.Province,
                    City = dto.City,
                    District = dto.District,
                    Kcn = dto.Kcn,
                    Price = dto.Price,
                    PriceDisplay = dto.PriceDisplay,
                    UnitPrice = dto.UnitPrice,
                    Area = dto.Area,
                    Length = dto.Length,
                    Width = dto.Width,
                    StructureType = dto.StructureType,
                    HasCrane = dto.HasCrane,
                    CraneCapacity = dto.CraneCapacity,
                    BrokerPhone = dto.BrokerPhone,
                    Image = dto.Image,
                    VideoUrl = dto.VideoUrl,
                    AudioUrl = dto.AudioUrl,
                    Model3DUrl = dto.Model3DUrl,
                    Drawing2DUrl = dto.Drawing2DUrl,
                    Desc = dto.Desc,
                    EmailNotified = dto.EmailNotified,
                    CreatedAt = DateTime.UtcNow
                };

                await _context.Properties.AddAsync(entity);
                await _context.SaveChangesAsync();
                
                // If DB generates an identity ID, update DTO
                if (entity.Id > 0 && entity.Id != dto.Id)
                {
                    dto.Id = entity.Id;
                    SaveStore(store);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[PropertyService] Notice: Supabase PostgreSQL sync bypassed (offline/paused): {ex.Message}. Property saved to persistent JSON store with ID={dto.Id}.");
            }

            return dto;
        }

        public async Task<PropertyDto> UpdateAsync(int id, UpdatePropertyRequest request)
        {
            var store = GetStore();
            var existing = store.FirstOrDefault(p => p.Id == id);
            if (existing == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy sản phẩm với mã: {id}");
            }

            existing.Title = request.Title;
            existing.Type = request.Type?.ToUpper() ?? existing.Type;
            existing.TypeDisplay = ResolveTypeDisplay(existing.Type, request.TypeDisplay);
            if (!string.IsNullOrWhiteSpace(request.Status)) existing.Status = request.Status.Trim();
            if (!string.IsNullOrWhiteSpace(request.StockStatus)) existing.StockStatus = request.StockStatus.Trim().ToUpper();
            if (!string.IsNullOrWhiteSpace(request.StorageLocation)) existing.StorageLocation = request.StorageLocation.Trim().ToUpper();
            if (request.CategoryId.HasValue) existing.CategoryId = request.CategoryId.Value;
            existing.Province = request.Province ?? existing.Province;
            existing.City = request.City ?? existing.City;
            existing.District = request.District ?? existing.District;
            existing.Kcn = request.Kcn ?? existing.Kcn;
            existing.Price = request.Price;
            existing.PriceDisplay = FormatPrice(request.Price, existing.Type);
            existing.UnitPrice = request.UnitPrice ?? existing.UnitPrice;
            existing.Area = request.Area ?? existing.Area;
            existing.Length = request.Length ?? existing.Length;
            existing.Width = request.Width ?? existing.Width;
            existing.StructureType = request.StructureType ?? existing.StructureType;
            if (request.HasCrane.HasValue) existing.HasCrane = request.HasCrane.Value;
            existing.CraneCapacity = request.CraneCapacity ?? existing.CraneCapacity;
            existing.BrokerPhone = request.BrokerPhone ?? existing.BrokerPhone;
            if (!string.IsNullOrWhiteSpace(request.Image)) existing.Image = request.Image;
            if (request.Images != null && request.Images.Count > 0)
            {
                existing.Images = request.Images;
                existing.Gallery = request.Images;
            }
            existing.VideoUrl = request.VideoUrl ?? existing.VideoUrl;
            existing.AudioUrl = request.AudioUrl ?? existing.AudioUrl;
            existing.Model3DUrl = request.Model3DUrl ?? existing.Model3DUrl;
            existing.Drawing2DUrl = request.Drawing2DUrl ?? existing.Drawing2DUrl;
            existing.Desc = request.Desc ?? existing.Desc;

            SaveStore(store);

            // Sync with DB
            try
            {
                var dbEntity = await _context.Properties.FirstOrDefaultAsync(p => p.Id == id);
                if (dbEntity != null)
                {
                    dbEntity.Title = existing.Title;
                    dbEntity.Price = existing.Price;
                    dbEntity.PriceDisplay = existing.PriceDisplay;
                    dbEntity.StockStatus = existing.StockStatus;
                    dbEntity.StorageLocation = existing.StorageLocation;
                    dbEntity.Desc = existing.Desc;
                    await _context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[PropertyService] DB sync update warning: {ex.Message}");
            }

            return existing;
        }

        public async Task<PropertyDto> UpdateAsync(string id, UpdatePropertyRequest request)
        {
            if (int.TryParse(id, out var intId))
            {
                return await UpdateAsync(intId, request);
            }
            throw new KeyNotFoundException($"Mã sản phẩm không hợp lệ: {id}");
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var store = GetStore();
            var item = store.FirstOrDefault(p => p.Id == id);
            if (item == null) return false;

            lock (_fileLock)
            {
                store.Remove(item);
                SaveStoreNoLock(store);
            }

            try
            {
                var dbEntity = await _context.Properties.FirstOrDefaultAsync(p => p.Id == id);
                if (dbEntity != null)
                {
                    _context.Properties.Remove(dbEntity);
                    await _context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[PropertyService] DB sync delete warning: {ex.Message}");
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

        private static int ResolveDefaultCategoryId(string type)
        {
            return (type.ToUpper()) switch
            {
                "BAN_KHUNG_XUONG" => 1,
                "COT_KEO" => 2,
                "THEP_HINH_I" => 3,
                "TON_LOP_VACH" => 4,
                "TON_SAN_DECK" => 5,
                "ONG_PCCC" => 6,
                "THANH_LY_XUONG" => 7,
                "THIET_KE_3D" => 8,
                _ => 1
            };
        }

        private static string ResolveTypeDisplay(string? type, string? customDisplay)
        {
            if (!string.IsNullOrWhiteSpace(customDisplay)) return customDisplay;
            return (type?.ToUpper()) switch
            {
                "BAN_KHUNG_XUONG" => "Bán Khung Nhà Xưởng",
                "COT_KEO" => "Cột Kèo & Dầm Thép",
                "THEP_HINH_I" => "Thép Hình I (I 200, I 300, I 500)",
                "TON_LOP_VACH" => "Tôn (Tôn Lợp & Tôn Vách)",
                "TON_SAN_DECK" => "Tôn Sàn (Decking)",
                "ONG_PCCC" => "Ống Phòng Cháy Chữa Cháy (PCCC)",
                "THANH_LY_XUONG" => "Thanh Lý Trọn Gói Nhà Xưởng",
                "THIET_KE_3D" => "Xem Thiết Kế 3D Nhà Xưởng",
                _ => "Khung Xưởng & Sắt Thép"
            };
        }

        private static string FormatPrice(long price, string? type)
        {
            if (price >= 1_000_000_000)
                return $"{(price / 1_000_000_000.0):0.##} Tỷ VNĐ";
            if (price >= 1_000_000)
                return $"{price / 1_000_000} Triệu VNĐ";
            if (price > 0)
                return $"{price:N0} đ";
            return "Liên hệ báo giá";
        }

        private static List<PropertyDto> GetInitialProperties()
        {
            return new List<PropertyDto>
            {
                // 1. BAN_KHUNG_XUONG
                new()
                {
                    Id = 1,
                    Title = "Khung Nhà Xưởng Tiền Chế 24m x 84m (2.016 m²) Kèo Zamil Có Cẩu Trục 10T",
                    Type = "BAN_KHUNG_XUONG",
                    TypeDisplay = "Bán Khung Nhà Xưởng",
                    Status = "Còn hàng",
                    StockStatus = "IN_STOCK",
                    StorageLocation = "AT_YARD",
                    CategoryId = 1,
                    CategoryName = "Bán Khung Nhà Xưởng",
                    Province = "Bình Dương",
                    City = "Bình Dương",
                    District = "Dĩ An",
                    Kcn = "Kho Bãi ICD Tân Cảng, TP. Dĩ An",
                    Price = 1450000000,
                    PriceDisplay = "1.45 Tỷ VNĐ",
                    UnitPrice = "719.000 đ/m²",
                    Area = "2.016 m²",
                    Length = 84,
                    Width = 24,
                    StructureType = "Zamil",
                    HasCrane = true,
                    CraneCapacity = "10 Tấn",
                    BrokerPhone = "0965 985 468",
                    Image = "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
                    Images = new List<string>
                    {
                        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
                        "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80",
                        "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&q=80"
                    },
                    Gallery = new List<string>
                    {
                        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
                        "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80",
                        "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&q=80"
                    },
                    VideoUrl = "https://assets.mixkit.co/videos/preview/mixkit-drone-view-of-a-large-factory-or-warehouse-42861-large.mp4",
                    AudioUrl = "https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3",
                    Model3DUrl = "/models3d/nha_xuong_24x84.html",
                    Drawing2DUrl = "/models3d/mat_bang_24x84.dxf",
                    Desc = "Khung nhà xưởng Zamil chuẩn xuất khẩu kích thước 24m x 84m (14 gian x 6m), chiều cao giọt nước 8.5m, dầm cẩu trục 10 tấn chạy suốt. Đầy đủ giằng, xà gồ mạ kẽm Z200 tập kết sẵn tại bãi Dĩ An.",
                    EmailNotified = true,
                    Created = "10:30 Hôm nay"
                },
                new()
                {
                    Id = 2,
                    Title = "Khung Nhà Xưởng Thép I Đúc 30m x 60m (1.800 m²) Vượt Nhịp Không Cột Giữa",
                    Type = "BAN_KHUNG_XUONG",
                    TypeDisplay = "Bán Khung Nhà Xưởng",
                    Status = "Còn hàng",
                    StockStatus = "IN_STOCK",
                    StorageLocation = "AT_SITE",
                    CategoryId = 1,
                    CategoryName = "Bán Khung Nhà Xưởng",
                    Province = "Bình Dương",
                    City = "Bình Dương",
                    District = "Thuận An",
                    Kcn = "Công Trình KCN VSIP 1, Thuận An",
                    Price = 1260000000,
                    PriceDisplay = "1.26 Tỷ VNĐ",
                    UnitPrice = "700.000 đ/m²",
                    Area = "1.800 m²",
                    Length = 60,
                    Width = 30,
                    StructureType = "Thép I",
                    HasCrane = true,
                    CraneCapacity = "5 Tấn",
                    BrokerPhone = "0965 985 468",
                    Image = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
                    Images = new List<string>
                    {
                        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
                        "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&q=80"
                    },
                    Desc = "Khung nhà xưởng thép I cánh côn vượt nhịp 30m thông suốt, xà gồ Z250 mạ kẽm, dầm cầu trục 5 tấn. Đang tháo dỡ tại KCN VSIP 1.",
                    Created = "08:15 Hôm nay"
                },
                // 2. COT_KEO
                new()
                {
                    Id = 3,
                    Title = "Lô Cột Dầm Thép Tổ Hợp H400 x 200 & Kèo Tiệp Khẩu Độ 20m (65 Tấn)",
                    Type = "COT_KEO",
                    TypeDisplay = "Cột Kèo & Dầm Thép",
                    Status = "Còn hàng",
                    StockStatus = "IN_STOCK",
                    StorageLocation = "AT_YARD",
                    CategoryId = 2,
                    CategoryName = "Cột Kèo & Dầm Thép",
                    Province = "Đồng Nai",
                    City = "Đồng Nai",
                    District = "Biên Hòa",
                    Kcn = "Kho Bãi Cầu Đồng Nai, Biên Hòa",
                    Price = 975000000,
                    PriceDisplay = "975 Triệu VNĐ",
                    UnitPrice = "15.000 đ/kg",
                    Area = "65 Tấn",
                    StructureType = "Kèo Tiệp",
                    HasCrane = false,
                    BrokerPhone = "0965 985 468",
                    Image = "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
                    Images = new List<string> { "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80" },
                    Desc = "Lô cột dầm thép H400x200x8x13mm và kèo tam giác khẩu độ 20m, tổng khối lượng 65 tấn, thép sơn epoxy chống gỉ 2 lớp.",
                    Created = "14:20 Hôm qua"
                },
                // 3. THEP_HINH_I
                new()
                {
                    Id = 4,
                    Title = "Thép Hình I 300 x 150 x 6.5 x 9mm Dài 12m Dùng Làm Cột Dầm Xưởng Nặng",
                    Type = "THEP_HINH_I",
                    TypeDisplay = "Thép Hình I (I 200, I 300, I 500)",
                    Status = "Còn hàng",
                    StockStatus = "IN_STOCK",
                    StorageLocation = "AT_YARD",
                    CategoryId = 3,
                    CategoryName = "Thép Hình I (I 200, I 300, I 500)",
                    Province = "Bình Dương",
                    City = "Bình Dương",
                    District = "Dĩ An",
                    Kcn = "Kho Bãi Tân Bình, Dĩ An",
                    Price = 680000000,
                    PriceDisplay = "680 Triệu VNĐ",
                    UnitPrice = "15.000 đ/kg",
                    Area = "45 Tấn",
                    StructureType = "Thép I",
                    HasCrane = false,
                    BrokerPhone = "0965 985 468",
                    Image = "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&q=80",
                    Images = new List<string> { "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&q=80" },
                    Desc = "Thép I 300 đúc mác thép SS400/Q235B, chứng chỉ CO/CQ đầy đủ. Hỗ trợ xe cẩu 15 tấn giao tận chân công trình Bình Dương, Đồng Nai.",
                    Created = "11:45 Hôm qua"
                },
                // 4. TON_LOP_VACH
                new()
                {
                    Id = 5,
                    Title = "Tôn Lợp Mái 5 Sóng Vuông & Tôn Vách Bao Che Dày 0.45mm (Kèm Xà Gồ Z)",
                    Type = "TON_LOP_VACH",
                    TypeDisplay = "Tôn (Tôn Lợp & Tôn Vách)",
                    Status = "Còn hàng",
                    StockStatus = "IN_STOCK",
                    StorageLocation = "AT_YARD",
                    CategoryId = 4,
                    CategoryName = "Tôn (Tôn Lợp & Tôn Vách)",
                    Province = "Lâm Đồng",
                    City = "Lâm Đồng",
                    District = "Bảo Lộc",
                    Kcn = "Kho Bãi KCN Lộc Sơn, Bảo Lộc",
                    Price = 185000000,
                    PriceDisplay = "185 Triệu VNĐ",
                    UnitPrice = "62.000 đ/m²",
                    Area = "3.000 m²",
                    StructureType = "Tôn Lợp",
                    HasCrane = false,
                    BrokerPhone = "0965 985 468",
                    Image = "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=800&q=80",
                    Images = new List<string> { "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=800&q=80" },
                    Desc = "Lô tôn lợp màu xanh ngọc 5 sóng vuông cán sẵn 6m - 12m, độ dày chuẩn 0.45mm, lớp mạ nhôm kẽm AZ100.",
                    Created = "09:00 25/11/2026"
                },
                // 5. TON_SAN_DECK
                new()
                {
                    Id = 6,
                    Title = "Tôn Sàn Decking H50W1000 Mạ Kẽm Dày 0.95mm Đổ Sàn Bê Tông Nhà Kho",
                    Type = "TON_SAN_DECK",
                    TypeDisplay = "Tôn Sàn (Decking)",
                    Status = "Còn hàng",
                    StockStatus = "IN_STOCK",
                    StorageLocation = "AT_YARD",
                    CategoryId = 5,
                    CategoryName = "Tôn Sàn (Decking)",
                    Province = "Bình Dương",
                    City = "Bình Dương",
                    District = "Thuận An",
                    Kcn = "Kho Bãi KCN Việt Hương 1",
                    Price = 320000000,
                    PriceDisplay = "320 Triệu VNĐ",
                    UnitPrice = "160.000 đ/m²",
                    Area = "2.000 m²",
                    StructureType = "Decking",
                    HasCrane = false,
                    BrokerPhone = "0965 985 468",
                    Image = "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&q=80",
                    Images = new List<string> { "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&q=80" },
                    Desc = "Tôn sàn decking sóng H50, mạ kẽm Z275 chịu tải cao, bề mặt có gân tăng cứng bám dính bê tông cực tốt.",
                    Created = "16:30 24/11/2026"
                },
                // 6. ONG_PCCC
                new()
                {
                    Id = 7,
                    Title = "Hệ Thống Ống Thép PCCC Mạ Kẽm Nhúng Nóng D114, D90, D60 Kèm Van Khóa",
                    Type = "ONG_PCCC",
                    TypeDisplay = "Ống Phòng Cháy Chữa Cháy (PCCC)",
                    Status = "Còn hàng",
                    StockStatus = "IN_STOCK",
                    StorageLocation = "AT_YARD",
                    CategoryId = 6,
                    CategoryName = "Ống Phòng Cháy Chữa Cháy (PCCC)",
                    Province = "Bình Dương",
                    City = "Bình Dương",
                    District = "Bến Cát",
                    Kcn = "Kho Bãi KCN Mỹ Phước 3, Bến Cát",
                    Price = 245000000,
                    PriceDisplay = "245 Triệu VNĐ",
                    UnitPrice = "Trọn gói lô",
                    Area = "1.500 m dài",
                    StructureType = "Ống Thép",
                    HasCrane = false,
                    BrokerPhone = "0965 985 468",
                    Image = "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80",
                    Images = new List<string> { "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80" },
                    Desc = "Lô ống thép đúc mạ kẽm PCCC tiêu chuẩn ASTM A53 Schedule 40 đường kính D114, D90, D60 nguyên cây 6m tháo dỡ kho ngoại quan.",
                    Created = "15:00 23/11/2026"
                },
                // 7. THANH_LY_XUONG
                new()
                {
                    Id = 8,
                    Title = "Thanh Lý Trọn Gói Nhà Xưởng May Mặc 40m x 100m (4.000 m²) Kèm Hệ Thống Điện & PCCC",
                    Type = "THANH_LY_XUONG",
                    TypeDisplay = "Thanh Lý Trọn Gói Nhà Xưởng",
                    Status = "Còn hàng",
                    StockStatus = "IN_STOCK",
                    StorageLocation = "AT_SITE",
                    CategoryId = 7,
                    CategoryName = "Thanh Lý Trọn Gói Nhà Xưởng",
                    Province = "Đồng Nai",
                    City = "Đồng Nai",
                    District = "Long Thành",
                    Kcn = "Công Trình KCN Long Đức, Long Thành",
                    Price = 2800000000,
                    PriceDisplay = "2.8 Tỷ VNĐ",
                    UnitPrice = "700.000 đ/m²",
                    Area = "4.000 m²",
                    Length = 100,
                    Width = 40,
                    StructureType = "Zamil",
                    HasCrane = true,
                    CraneCapacity = "10 Tấn",
                    BrokerPhone = "0965 985 468",
                    Image = "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800&q=80",
                    Images = new List<string> { "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800&q=80" },
                    Desc = "Bàn giao trọn gói khung xưởng 4.000 m2 kết cấu Zamil, mái tôn cách nhiệt, trạm biến áp 560kVA, hệ thống PCCC sprinkler.",
                    Created = "10:00 22/11/2026"
                },
                // 8. THIET_KE_3D
                new()
                {
                    Id = 9,
                    Title = "Bản Vẽ & Mô Hình 3D Nhà Xưởng Thép I 66m x 136m (8.976 m²) 3 Nhịp Cột",
                    Type = "THIET_KE_3D",
                    TypeDisplay = "Xem Thiết Kế 3D Nhà Xưởng",
                    Status = "Còn hàng",
                    StockStatus = "IN_STOCK",
                    StorageLocation = "AT_YARD",
                    CategoryId = 8,
                    CategoryName = "Xem Thiết Kế 3D Nhà Xưởng",
                    Province = "Bình Dương",
                    City = "Bình Dương",
                    District = "Thuận An",
                    Kcn = "Trung Tâm Kỹ Thuật KCN Thuận An",
                    Price = 35000000,
                    PriceDisplay = "35 Triệu VNĐ",
                    UnitPrice = "Trọn gói hồ sơ",
                    Area = "8.976 m²",
                    Length = 136,
                    Width = 66,
                    StructureType = "Thép I",
                    HasCrane = true,
                    CraneCapacity = "15 Tấn",
                    BrokerPhone = "0965 985 468",
                    Image = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
                    Images = new List<string> { "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80" },
                    Model3DUrl = "/models3d/nha_xuong_66x136.html",
                    Drawing2DUrl = "/models3d/khung_keo_FR1_66m.step",
                    Desc = "Bộ hồ sơ bản vẽ kết cấu đầy đủ (AutoCAD DXF + STEP + 3D GLB) cho nhà xưởng khẩu độ lớn 66m chia 3 nhịp 22m, dài 136m.",
                    Created = "12:00 21/11/2026"
                }
            };
        }
    }
}
