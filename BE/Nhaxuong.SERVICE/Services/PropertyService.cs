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

                // Filter Type (ALL, SALE, RENT, RECYCLED_STEEL)
                if (!string.IsNullOrWhiteSpace(query.Type) && query.Type.ToUpper() != "ALL")
                {
                    var targetType = query.Type.Trim().ToUpper();
                    dbQuery = dbQuery.Where(p => p.Type.ToUpper() == targetType);
                }

                // Filter CategoryId
                if (query.CategoryId.HasValue && query.CategoryId.Value > 0)
                {
                    dbQuery = dbQuery.Where(p => p.CategoryId == query.CategoryId.Value);
                }

                // Filter Status
                if (!string.IsNullOrWhiteSpace(query.Status) && query.Status.ToUpper() != "ALL")
                {
                    var targetStatus = query.Status.Trim();
                    dbQuery = dbQuery.Where(p => p.Status.ToLower() == targetStatus.ToLower());
                }

                // Keyword filter
                if (!string.IsNullOrWhiteSpace(query.Keyword))
                {
                    var kw = query.Keyword.Trim().ToLower();
                    dbQuery = dbQuery.Where(p =>
                        p.Title.ToLower().Contains(kw) ||
                        p.Desc.ToLower().Contains(kw) ||
                        p.Kcn.ToLower().Contains(kw) ||
                        p.Province.ToLower().Contains(kw));
                }

                // Province filter
                if (!string.IsNullOrWhiteSpace(query.Province) && query.Province != "Toàn Quốc")
                {
                    dbQuery = dbQuery.Where(p => p.Province.ToLower() == query.Province.Trim().ToLower());
                }

                // KCN / Vị trí filter
                if (!string.IsNullOrWhiteSpace(query.Kcn) &&
                    query.Kcn != "Tất cả bãi kho" &&
                    query.Kcn != "Tất cả KCN")
                {
                    var kcnTrimmed = query.Kcn.Trim().ToLower();
                    dbQuery = dbQuery.Where(p => p.Kcn.ToLower() == kcnTrimmed);
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
                    TotalCount = totalItems,
                    PageNumber = page,
                    PageSize = pageSize
                };
            }
            catch (Exception)
            {
                // Fallback seed items if DB is offline/unreachable
                var seed = GetFallbackProperties();
                if (!string.IsNullOrWhiteSpace(query.Type) && query.Type.ToUpper() != "ALL")
                {
                    seed = seed.Where(p => p.Type.Equals(query.Type, StringComparison.OrdinalIgnoreCase)).ToList();
                }
                return new PagedResult<PropertyDto>
                {
                    Items = seed.Skip((page - 1) * pageSize).Take(pageSize).ToList(),
                    TotalCount = seed.Count,
                    PageNumber = page,
                    PageSize = pageSize
                };
            }
        }

        public async Task<PropertyDto?> GetByIdAsync(int id)
        {
            try
            {
                var item = await _context.Properties.Include(p => p.Category).FirstOrDefaultAsync(p => p.Id == id);
                return item == null ? null : MapToDto(item);
            }
            catch (Exception)
            {
                return GetFallbackProperties().FirstOrDefault(p => p.Id == id);
            }
        }

        public async Task<PropertyDto?> GetByIdAsync(string id)
        {
            if (int.TryParse(id, out var intId))
            {
                return await GetByIdAsync(intId);
            }
            return null;
        }

        private static List<PropertyDto> GetFallbackProperties()
        {
            return new List<PropertyDto>
            {
                new()
                {
                    Id = 1,
                    Title = "Bán 12.000m2 Nhà Xưởng Tiêu Chuẩn KCN VSIP 1, Trạm Điện 1.500kVA",
                    Type = "SALE",
                    TypeDisplay = "Bán Nhà Xưởng",
                    Status = "Còn hàng",
                    CategoryId = 3,
                    Province = "Bình Dương",
                    Kcn = "KCN VSIP 1",
                    Price = 48000000000,
                    PriceDisplay = "48 Tỷ VNĐ",
                    UnitPrice = "4.0 Tr/m²",
                    Area = "12.000 m2",
                    BrokerPhone = "0901 234 567",
                    Image = "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
                    VideoUrl = "https://assets.mixkit.co/videos/preview/mixkit-drone-view-of-a-large-factory-or-warehouse-42861-large.mp4",
                    AudioUrl = "https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3",
                    Model3DUrl = null,
                    Desc = "Khuôn viên đất 12.000m2, diện tích xưởng xây dựng 8.000m2, trần cao 11m, sàn bê tông cốt thép chịu tải 5 tấn/m2, trạm biến áp riêng 1.500kVA.",
                    EmailNotified = true,
                    Created = "10:00 29/10/2026"
                },
                new()
                {
                    Id = 2,
                    Title = "Cho Thuê Kho Xưởng Logistics 5.000m2 KCN Sóng Thần 2 Dĩ An",
                    Type = "RENT",
                    TypeDisplay = "Cho Thuê Kho Bãi",
                    Status = "Còn hàng",
                    CategoryId = 2,
                    Province = "Bình Dương",
                    Kcn = "KCN Sóng Thần 2",
                    Price = 350000000,
                    PriceDisplay = "350 Triệu / Tháng",
                    UnitPrice = "70.000 đ/m²/tháng",
                    Area = "5.000 m2",
                    BrokerPhone = "0918 765 432",
                    Image = "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80",
                    VideoUrl = "https://assets.mixkit.co/videos/preview/mixkit-forklift-moving-cargo-in-a-warehouse-42863-large.mp4",
                    AudioUrl = "https://cdn.freesound.org/previews/612/612610_5674468-lq.mp3",
                    Model3DUrl = null,
                    Desc = "Vị trí giáp ranh TP.HCM, đường xe container ra vào 24/7 không cấm tải, có sẵn 6 dock leveler xuất nhập hàng tiêu chuẩn châu Âu.",
                    EmailNotified = true,
                    Created = "10:30 29/10/2026"
                },
                new()
                {
                    Id = 3,
                    Title = "Thanh Lý Khung Nhà Xưởng Thép Tiền Chế Tái Sử Dụng 3.200m2",
                    Type = "RECYCLED_STEEL",
                    TypeDisplay = "Sắt Thép Tái Sử Dụng",
                    Status = "Còn hàng",
                    CategoryId = 1,
                    Province = "Bình Dương",
                    Kcn = "Kho Bãi ICD Tân Cảng",
                    Price = 980000000,
                    PriceDisplay = "980 Triệu VNĐ",
                    UnitPrice = "306.000 đ/m²",
                    Area = "3.200 m2",
                    BrokerPhone = "0912 888 999",
                    Image = "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&q=80",
                    VideoUrl = "https://assets.mixkit.co/videos/preview/mixkit-drone-view-of-a-large-factory-or-warehouse-42861-large.mp4",
                    AudioUrl = null,
                    Model3DUrl = null,
                    Desc = "Khung kèo thép Zamil khẩu độ 30m vượt nhịp không cột giữa, tháo dỡ nguyên vẹn đầy đủ dầm cột H350, giằng xà gồ mạ kẽm C200.",
                    EmailNotified = true,
                    Created = "11:00 29/10/2026"
                },
                new()
                {
                    Id = 4,
                    Title = "Lô Dầm Thép Hình Chữ H, I & Xà Gồ Tháo Dỡ Tái Sử Dụng 85 Tấn",
                    Type = "RECYCLED_STEEL",
                    TypeDisplay = "Sắt Thép Tái Sử Dụng",
                    Status = "Còn hàng",
                    CategoryId = 1,
                    Province = "Đồng Nai",
                    Kcn = "KCN Long Đức",
                    Price = 1250000000,
                    PriceDisplay = "1.25 Tỷ VNĐ",
                    UnitPrice = "14.700 đ/kg",
                    Area = "85 Tấn",
                    BrokerPhone = "0983 777 666",
                    Image = "https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=800&q=80",
                    VideoUrl = "https://assets.mixkit.co/videos/preview/mixkit-forklift-moving-cargo-in-a-warehouse-42863-large.mp4",
                    AudioUrl = null,
                    Model3DUrl = null,
                    Desc = "Lô thép dầm chính H400x200, H300x150, I300 tháo dỡ từ nhà máy công nghiệp nhẹ, cây dài tiêu chuẩn 6m - 12m, không cong vênh.",
                    EmailNotified = true,
                    Created = "11:30 29/10/2026"
                }
            };
        }

        public async Task<PropertyDto> CreateAsync(CreatePropertyRequest request)
        {
            var typeDisplay = ResolveTypeDisplay(request.Type, request.TypeDisplay);
            var priceDisplay = FormatPrice(request.Price, request.Type);
            var status = string.IsNullOrWhiteSpace(request.Status) ? "Còn hàng" : request.Status.Trim();
            var now = DateTime.UtcNow;

            int? categoryId = request.CategoryId;
            if (!categoryId.HasValue && !string.IsNullOrWhiteSpace(request.Type))
            {
                var cat = await _context.Categories.FirstOrDefaultAsync(c => c.Code.ToUpper() == request.Type.ToUpper());
                if (cat != null) categoryId = cat.Id;
            }

            var entity = new PropertyItem
            {
                Title = request.Title,
                Type = request.Type?.ToUpper() ?? "SALE",
                TypeDisplay = typeDisplay,
                Status = status,
                CategoryId = categoryId,
                Province = request.Province,
                Kcn = request.Kcn ?? string.Empty,
                Price = request.Price,
                PriceDisplay = priceDisplay,
                UnitPrice = request.UnitPrice,
                Area = request.Area ?? string.Empty,
                BrokerPhone = request.BrokerPhone,
                Image = string.IsNullOrWhiteSpace(request.Image)
                    ? "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80"
                    : request.Image,
                VideoUrl = request.VideoUrl,
                AudioUrl = request.AudioUrl,
                Model3DUrl = request.Model3DUrl,
                Desc = request.Desc ?? string.Empty,
                EmailNotified = request.TriggerEmail,
                CreatedAt = now
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
            if (request.CategoryId.HasValue)
            {
                entity.CategoryId = request.CategoryId.Value;
            }
            entity.Province = request.Province;
            entity.Kcn = request.Kcn ?? entity.Kcn;
            entity.Price = request.Price;
            entity.PriceDisplay = FormatPrice(request.Price, entity.Type);
            entity.UnitPrice = request.UnitPrice;
            entity.Area = request.Area ?? entity.Area;
            entity.BrokerPhone = request.BrokerPhone;
            if (!string.IsNullOrWhiteSpace(request.Image))
            {
                entity.Image = request.Image;
            }
            entity.VideoUrl = request.VideoUrl;
            entity.AudioUrl = request.AudioUrl;
            entity.Model3DUrl = request.Model3DUrl;
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
                CategoryId = item.CategoryId,
                CategoryName = item.Category?.Name,
                Province = item.Province,
                Kcn = item.Kcn,
                Price = item.Price,
                PriceDisplay = item.PriceDisplay,
                UnitPrice = item.UnitPrice,
                Area = item.Area,
                BrokerPhone = item.BrokerPhone,
                Image = item.Image,
                VideoUrl = item.VideoUrl,
                AudioUrl = item.AudioUrl,
                Model3DUrl = item.Model3DUrl,
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
                "SALE" => "Bán Nhà Xưởng",
                "RENT" => "Cho Thuê Kho Bãi",
                "RECYCLED_STEEL" => "Sắt Thép Tái Sử Dụng",
                _ => "BĐS Công Nghiệp"
            };
        }

        private static string FormatPrice(long price, string? type)
        {
            if (type?.ToUpper() == "RENT")
            {
                if (price >= 1_000_000_000)
                    return $"{(price / 1_000_000_000.0):0.#} Tỷ / Tháng";
                if (price >= 1_000_000)
                    return $"{price / 1_000_000} Triệu / Tháng";
                return $"{price:N0} đ/tháng";
            }
            else
            {
                if (price >= 1_000_000_000)
                    return $"{(price / 1_000_000_000.0):0.#} Tỷ VNĐ";
                if (price >= 1_000_000)
                    return $"{price / 1_000_000} Triệu VNĐ";
                return $"{price:N0} VNĐ";
            }
        }
    }
}
