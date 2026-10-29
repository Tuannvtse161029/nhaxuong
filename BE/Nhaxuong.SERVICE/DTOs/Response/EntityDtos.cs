namespace Nhaxuong.SERVICE.DTOs.Response
{
    public class PropertyDto
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string TypeDisplay { get; set; } = string.Empty;
        public string Province { get; set; } = string.Empty;
        public string? District { get; set; }
        public string Kcn { get; set; } = string.Empty; // Vị trí
        public long Price { get; set; }
        public string PriceDisplay { get; set; } = string.Empty;
        public string? UnitPrice { get; set; }
        public string Area { get; set; } = string.Empty;
        public string? Power { get; set; }
        public string? Pccc { get; set; }
        public string? BrokerPhone { get; set; }
        public string? BrokerName { get; set; }
        public string Image { get; set; } = string.Empty;
        public List<string>? Gallery { get; set; }
        public string? VideoUrl { get; set; }
        public string? AudioUrl { get; set; }
        public string? AudioDuration { get; set; }
        public string Desc { get; set; } = string.Empty;
        public string? CeilingHeight { get; set; }
        public string? FloorLoad { get; set; }
        public string? LegalStatus { get; set; }
        public string? RoadAccess { get; set; }
        public bool Verified { get; set; } = true;
        public bool EmailNotified { get; set; } = false;
        public string Created { get; set; } = string.Empty;
    }

    public class CategoryDto
    {
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Icon { get; set; } = "Warehouse";
        public string Desc { get; set; } = string.Empty;
        public bool Active { get; set; } = true;
    }

    public class SubscriberDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string Channel { get; set; } = "email";
        public string Status { get; set; } = "Đang Nhận Tin";
        public string Time { get; set; } = string.Empty;
    }

    public class NoticeDto
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Badge { get; set; } = "Thông Báo";
        public bool Active { get; set; } = true;
        public string CreatedAt { get; set; } = string.Empty;
    }
}
