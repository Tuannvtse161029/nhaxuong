namespace Nhaxuong.SERVICE.DTOs.Request
{
    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? Phone { get; set; }
    }

    public class PhoneAuthRequest
    {
        public string Phone { get; set; } = string.Empty;
        public string? Name { get; set; }
        public string? Otp { get; set; }
    }

    public class SendOtpRequest
    {
        public string Phone { get; set; } = string.Empty;
    }

    public class GoogleAuthRequest
    {
        public string? IdToken { get; set; }
        public string? Email { get; set; }
        public string? Name { get; set; }
        public string? Avatar { get; set; }
    }

    public class CreatePropertyRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Type { get; set; } = "SALE"; // SALE, RENT, RECYCLED_STEEL
        public string? TypeDisplay { get; set; }
        public string Province { get; set; } = string.Empty;
        public string Kcn { get; set; } = string.Empty; // Vị trí kho bãi / KCN
        public long Price { get; set; }
        public string? UnitPrice { get; set; }
        public string Area { get; set; } = string.Empty;
        public string? BrokerPhone { get; set; }
        public string? VideoUrl { get; set; }
        public string? AudioUrl { get; set; }
        public string? Image { get; set; }
        public string? Desc { get; set; }
        public bool TriggerEmail { get; set; } = true;
    }

    public class UpdatePropertyRequest : CreatePropertyRequest
    {
    }

    public class PropertyFilterQuery
    {
        public string? Type { get; set; } // ALL, SALE, RENT, RECYCLED_STEEL
        public string? Keyword { get; set; }
        public string? Province { get; set; }
        public string? Kcn { get; set; }
        public long? MinPrice { get; set; }
        public long? MaxPrice { get; set; }
        public string? SortBy { get; set; } = "newest";
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 12;
    }

    public class CreateSubscriberRequest
    {
        public string Name { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string Channel { get; set; } = "email";
    }

    public class CreateNoticeRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Badge { get; set; } = "Thông Báo";
        public bool Active { get; set; } = true;
    }

    public class CreateCategoryRequest
    {
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Icon { get; set; } = "Warehouse";
        public string Desc { get; set; } = string.Empty;
        public bool Active { get; set; } = true;
    }

    public class UpdateTickerRequest
    {
        public string Text { get; set; } = string.Empty;
    }
}
