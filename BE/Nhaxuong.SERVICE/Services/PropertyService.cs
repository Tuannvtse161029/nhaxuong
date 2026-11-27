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

        public PropertyService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<PropertyDto>> GetPropertiesAsync(PropertyFilterQuery query)
        {
            var page = query.Page <= 0 ? 1 : query.Page;
            var pageSize = query.PageSize <= 0 ? 12 : query.PageSize;

            try
            {
                var dbQuery = _context.Properties.Include(p => p.Category).AsQueryable();

                // Filter Type / Category
                if (!string.IsNullOrWhiteSpace(query.Type) && query.Type.ToUpper() != "ALL")
                {
                    var targetType = query.Type.Trim().ToUpper();
                    dbQuery = dbQuery.Where(p => p.Type.ToUpper() == targetType || (p.Category != null && p.Category.Code.ToUpper() == targetType));
                }

                // Filter CategoryId
                if (query.CategoryId.HasValue && query.CategoryId.Value > 0)
                {
                    dbQuery = dbQuery.Where(p => p.CategoryId == query.CategoryId.Value);
                }

                // Filter StockStatus (IN_STOCK, OUT_OF_STOCK)
                if (!string.IsNullOrWhiteSpace(query.StockStatus) && query.StockStatus.ToUpper() != "ALL")
                {
                    var targetStock = query.StockStatus.Trim().ToUpper();
                    dbQuery = dbQuery.Where(p => p.StockStatus.ToUpper() == targetStock);
                }

                // Filter StorageLocation (AT_YARD, AT_SITE)
                if (!string.IsNullOrWhiteSpace(query.StorageLocation) && query.StorageLocation.ToUpper() != "ALL")
                {
                    var targetLoc = query.StorageLocation.Trim().ToUpper();
                    dbQuery = dbQuery.Where(p => p.StorageLocation.ToUpper() == targetLoc);
                }

                // Filter StructureType (Thép I, Zamil, Kèo Tiệp)
                if (!string.IsNullOrWhiteSpace(query.StructureType) && query.StructureType.ToUpper() != "ALL")
                {
                    var st = query.StructureType.Trim().ToLower();
                    dbQuery = dbQuery.Where(p => p.StructureType != null && p.StructureType.ToLower().Contains(st));
                }

                // Filter HasCrane
                if (query.HasCrane.HasValue)
                {
                    dbQuery = dbQuery.Where(p => p.HasCrane == query.HasCrane.Value);
                }

                // Dimension filters (Length, Width)
                if (query.MinLength.HasValue && query.MinLength.Value > 0)
                {
                    dbQuery = dbQuery.Where(p => p.Length >= query.MinLength.Value);
                }
                if (query.MaxLength.HasValue && query.MaxLength.Value > 0)
                {
                    dbQuery = dbQuery.Where(p => p.Length <= query.MaxLength.Value);
                }
                if (query.MinWidth.HasValue && query.MinWidth.Value > 0)
                {
                    dbQuery = dbQuery.Where(p => p.Width >= query.MinWidth.Value);
                }
                if (query.MaxWidth.HasValue && query.MaxWidth.Value > 0)
                {
                    dbQuery = dbQuery.Where(p => p.Width <= query.MaxWidth.Value);
                }

                // Keyword search
                if (!string.IsNullOrWhiteSpace(query.Keyword))
                {
                    var kw = query.Keyword.Trim().ToLower();
                    dbQuery = dbQuery.Where(p =>
                        p.Title.ToLower().Contains(kw) ||
                        p.Desc.ToLower().Contains(kw) ||
                        p.Kcn.ToLower().Contains(kw) ||
                        (p.District != null && p.District.ToLower().Contains(kw)) ||
                        (p.City != null && p.City.ToLower().Contains(kw)) ||
                        p.Province.ToLower().Contains(kw));
                }

                // Location filters (Province, City, District)
                if (!string.IsNullOrWhiteSpace(query.Province) && query.Province != "Toàn Quốc" && query.Province != "ALL")
                {
                    var prov = query.Province.Trim().ToLower();
                    dbQuery = dbQuery.Where(p => p.Province.ToLower().Contains(prov) || (p.City != null && p.City.ToLower().Contains(prov)));
                }

                if (!string.IsNullOrWhiteSpace(query.City) && query.City != "ALL")
                {
                    var city = query.City.Trim().ToLower();
                    dbQuery = dbQuery.Where(p => (p.City != null && p.City.ToLower().Contains(city)) || p.Province.ToLower().Contains(city));
                }

                if (!string.IsNullOrWhiteSpace(query.District) && query.District != "ALL")
                {
                    var dist = query.District.Trim().ToLower();
                    dbQuery = dbQuery.Where(p => (p.District != null && p.District.ToLower().Contains(dist)) || p.Kcn.ToLower().Contains(dist));
                }

                // Price range filter
                if (query.MinPrice.HasValue && query.MinPrice > 0)
                {
                    dbQuery = dbQuery.Where(p => p.Price >= query.MinPrice.Value);
                }
                if (query.MaxPrice.HasValue && query.MaxPrice > 0)
                {
                    dbQuery = dbQuery.Where(p => p.Price <= query.MaxPrice.Value);
                }

                // Sorting
                switch (query.SortBy?.ToLower())
                {
                    case "price-asc":
                        dbQuery = dbQuery.OrderBy(p => p.Price);
                        break;
                    case "price-desc":
                        dbQuery = dbQuery.OrderByDescending(p => p.Price);
                        break;
                    case "newest":
                    default:
                        dbQuery = dbQuery.OrderByDescending(p => p.CreatedAt);
                        break;
                }

                var totalItems = await dbQuery.CountAsync();
                var items = await dbQuery
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var dtos = items.Select(MapToDto).ToList();

                return new PagedResult<PropertyDto>
                {
                    Items = dtos,
                    Total = totalItems,
                    Page = page,
                    PageSize = pageSize
                };
            }
            catch (Exception)
            {
                // Fallback demo data
                var fallbackList = GetFallbackProperties();
                return new PagedResult<PropertyDto>
                {
                    Items = fallbackList,
                    Total = fallbackList.Count,
                    Page = 1,
                    PageSize = pageSize
                };
            }
        }

        public async Task<PropertyDto?> GetByIdAsync(int id)
        {
            var entity = await _context.Properties
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == id);

            return entity == null ? null : MapToDto(entity);
        }

        public async Task<PropertyDto?> GetByIdAsync(string id)
        {
            if (int.TryParse(id, out var intId))
            {
                return await GetByIdAsync(intId);
            }
            return null;
        }

        public async Task<PropertyDto> CreateAsync(CreatePropertyRequest request)
        {
            var type = string.IsNullOrWhiteSpace(request.Type) ? "BAN_KHUNG_XUONG" : request.Type.ToUpper();
            var typeDisplay = ResolveTypeDisplay(type, request.TypeDisplay);
            var priceDisplay = FormatPrice(request.Price, type);

            var entity = new PropertyItem
            {
                Title = request.Title,
                Type = type,
                TypeDisplay = typeDisplay,
                Status = request.Status?.Trim() ?? "Còn hàng",
                StockStatus = string.IsNullOrWhiteSpace(request.StockStatus) ? "IN_STOCK" : request.StockStatus.Trim().ToUpper(),
                StorageLocation = string.IsNullOrWhiteSpace(request.StorageLocation) ? "AT_YARD" : request.StorageLocation.Trim().ToUpper(),
                CategoryId = request.CategoryId,
                Province = string.IsNullOrWhiteSpace(request.Province) ? (request.City ?? "Bình Dương") : request.Province,
                City = request.City ?? request.Province,
                District = request.District,
                Kcn = request.Kcn ?? "Vị trí kho bãi",
                Price = request.Price,
                PriceDisplay = priceDisplay,
                UnitPrice = request.UnitPrice,
                Area = request.Area ?? "Tiêu chuẩn",
                Length = request.Length,
                Width = request.Width,
                StructureType = request.StructureType,
                HasCrane = request.HasCrane ?? false,
                CraneCapacity = request.CraneCapacity,
                BrokerPhone = string.IsNullOrWhiteSpace(request.BrokerPhone) ? "0965 985 468" : request.BrokerPhone,
                Image = string.IsNullOrWhiteSpace(request.Image)
                    ? "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80"
                    : request.Image,
                VideoUrl = request.VideoUrl,
                AudioUrl = request.AudioUrl,
                Model3DUrl = request.Model3DUrl,
                Drawing2DUrl = request.Drawing2DUrl,
                Desc = request.Desc ?? string.Empty,
                EmailNotified = request.TriggerEmail,
                CreatedAt = DateTime.UtcNow
            };

            await _context.Properties.AddAsync(entity);
            await _context.SaveChangesAsync();

            return MapToDto(entity);
        }

        public async Task<PropertyDto> UpdateAsync(int id, UpdatePropertyRequest request)
        {
            var entity = await _context.Properties.FirstOrDefaultAsync(p => p.Id == id);
            if (entity == null)
            {
                throw new KeyNotFoundException($"Không tìm thấy sản phẩm với mã: {id}");
            }

            entity.Title = request.Title;
            entity.Type = request.Type?.ToUpper() ?? entity.Type;
            entity.TypeDisplay = ResolveTypeDisplay(entity.Type, request.TypeDisplay);
            if (!string.IsNullOrWhiteSpace(request.Status))
            {
                entity.Status = request.Status.Trim();
            }
            if (!string.IsNullOrWhiteSpace(request.StockStatus))
            {
                entity.StockStatus = request.StockStatus.Trim().ToUpper();
            }
            if (!string.IsNullOrWhiteSpace(request.StorageLocation))
            {
                entity.StorageLocation = request.StorageLocation.Trim().ToUpper();
            }
            if (request.CategoryId.HasValue)
            {
                entity.CategoryId = request.CategoryId.Value;
            }
            entity.Province = request.Province ?? entity.Province;
            entity.City = request.City ?? entity.City;
            entity.District = request.District ?? entity.District;
            entity.Kcn = request.Kcn ?? entity.Kcn;
            entity.Price = request.Price;
            entity.PriceDisplay = FormatPrice(request.Price, entity.Type);
            entity.UnitPrice = request.UnitPrice;
            entity.Area = request.Area ?? entity.Area;
            entity.Length = request.Length ?? entity.Length;
            entity.Width = request.Width ?? entity.Width;
            entity.StructureType = request.StructureType ?? entity.StructureType;
            if (request.HasCrane.HasValue)
            {
                entity.HasCrane = request.HasCrane.Value;
            }
            entity.CraneCapacity = request.CraneCapacity ?? entity.CraneCapacity;
            entity.BrokerPhone = request.BrokerPhone;
            if (!string.IsNullOrWhiteSpace(request.Image))
            {
                entity.Image = request.Image;
            }
            entity.VideoUrl = request.VideoUrl;
            entity.AudioUrl = request.AudioUrl;
            entity.Model3DUrl = request.Model3DUrl;
            entity.Drawing2DUrl = request.Drawing2DUrl;
            entity.Desc = request.Desc ?? entity.Desc;

            await _context.SaveChangesAsync();
            return MapToDto(entity);
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
            var entity = await _context.Properties.FirstOrDefaultAsync(p => p.Id == id);
            if (entity == null) return false;

            _context.Properties.Remove(entity);
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

        private static PropertyDto MapToDto(PropertyItem item)
        {
            return new PropertyDto
            {
                Id = item.Id,
                Title = item.Title,
                Type = item.Type,
                TypeDisplay = item.TypeDisplay,
                Status = item.Status ?? "Còn hàng",
                StockStatus = string.IsNullOrWhiteSpace(item.StockStatus) ? "IN_STOCK" : item.StockStatus,
                StorageLocation = string.IsNullOrWhiteSpace(item.StorageLocation) ? "AT_YARD" : item.StorageLocation,
                CategoryId = item.CategoryId,
                CategoryName = item.Category?.Name,
                Province = item.Province,
                City = item.City,
                District = item.District,
                Kcn = item.Kcn,
                Price = item.Price,
                PriceDisplay = item.PriceDisplay,
                UnitPrice = item.UnitPrice,
                Area = item.Area,
                Length = item.Length,
                Width = item.Width,
                StructureType = item.StructureType,
                HasCrane = item.HasCrane,
                CraneCapacity = item.CraneCapacity,
                BrokerPhone = item.BrokerPhone,
                Image = item.Image,
                VideoUrl = item.VideoUrl,
                AudioUrl = item.AudioUrl,
                Model3DUrl = item.Model3DUrl,
                Drawing2DUrl = item.Drawing2DUrl,
                Desc = item.Desc,
                EmailNotified = item.EmailNotified,
                Created = item.CreatedAt.ToString("HH:mm dd/MM/yyyy")
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
                "TON_LOP_VACH" => "Tôn Lợp & Tôn Vách",
                "TON_SAN_DECK" => "Tôn Sàn (Decking)",
                "ONG_PCCC" => "Ống Phòng Cháy Chữa Cháy (PCCC)",
                "THANH_LY_XUONG" => "Thanh Lý Trọn Gói Nhà Xưởng",
                "THIET_KE_3D" => "Xem Thiết Kế 3D Nhà Xưởng",
                _ => "Vật Tư & Nhà Xưởng"
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

        private static List<PropertyDto> GetFallbackProperties()
        {
            return new List<PropertyDto>
            {
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
                    VideoUrl = "https://assets.mixkit.co/videos/preview/mixkit-drone-view-of-a-large-factory-or-warehouse-42861-large.mp4",
                    AudioUrl = "https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3",
                    Model3DUrl = "/models3d/nha_xuong_24x84.html",
                    Drawing2DUrl = "/models3d/mat_bang_24x84.dxf",
                    Desc = "Khung nhà xưởng Zamil chuẩn xuất khẩu kích thước 24m x 84m, bước cột 6m, chiều cao giọt nước 8.5m, dầm đỡ cẩu trục 10 tấn chạy suốt chiều dài.",
                    Created = DateTime.UtcNow.ToString("HH:mm dd/MM/yyyy")
                },
                new()
                {
                    Id = 2,
                    Title = "Bản Vẽ & Mô Hình 3D Nhà Xưởng Thép I 66m x 136m (8.976 m²) 3 Nhịp Cột",
                    Type = "THIET_KE_3D",
                    TypeDisplay = "Xem Thiết Kế 3D Nhà Xưởng",
                    Status = "Còn hàng",
                    StockStatus = "IN_STOCK",
                    StorageLocation = "AT_YARD",
                    CategoryId = 8,
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
                    BrokerPhone = "0918 765 432",
                    Image = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
                    Model3DUrl = "/models3d/nha_xuong_66x136.html",
                    Drawing2DUrl = "/models3d/khung_keo_FR1_66m.step",
                    Desc = "Bộ hồ sơ bản vẽ kết cấu đầy đủ (AutoCAD DXF + STEP + 3D GLB) cho nhà xưởng khẩu độ lớn 66m chia 3 nhịp 22m, dài 136m.",
                    Created = DateTime.UtcNow.ToString("HH:mm dd/MM/yyyy")
                }
            };
        }
    }
}
