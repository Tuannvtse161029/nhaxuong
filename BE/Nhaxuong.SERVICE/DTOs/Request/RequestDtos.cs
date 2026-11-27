namespace Nhaxuong.SERVICE.DTOs.Request
{
    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? Pin { get; set; }
        public string? Otp { get; set; }
    }

    public class RegisterRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? Pin { get; set; }
        public string? Phone { get; set; }
        public string? Otp { get; set; }
    }

    public class ForgotPinSendOtpRequest
    {
        public string Method { get; set; } = "email"; // "email" or "phone"
        public string Target { get; set; } = string.Empty; // Email or Phone number
    }

    public class ForgotPinResetRequest
    {
        public string Method { get; set; } = "email"; // "email" or "phone"
        public string Target { get; set; } = string.Empty; // Email or Phone number
        public string Otp { get; set; } = string.Empty;
        public string NewPin { get; set; } = string.Empty; // 6-digit PIN
        public string ConfirmPin { get; set; } = string.Empty;
    }

    public class SendEmailOtpRequest
    {
        public string Email { get; set; } = string.Empty;
        public string? Type { get; set; } // "login", "register", or "forgot-pin"
    }

    public class PhoneAuthRequest
    {
        public string Phone { get; set; } = string.Empty;
        public string? Name { get; set; }
        public string? Otp { get; set; }
        public string? Pin { get; set; }
    }

    public class SendOtpRequest
    {
        public string Phone { get; set; } = string.Empty;
        public string? Type { get; set; } // "login" or "register" or "forgot-pin"
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
        public string Type { get; set; } = "BAN_KHUNG_XUONG"; // BAN_KHUNG_XUONG, COT_KEO, THEP_HINH_I, TON_LOP_VACH, TON_SAN_DECK, ONG_PCCC, THANH_LY_XUONG, THIET_KE_3D
        public string? TypeDisplay { get; set; }
        public string? Status { get; set; } = "Còn hàng"; // Còn hàng, Đã bán, Hết hàng
        public string? StockStatus { get; set; } = "IN_STOCK"; // IN_STOCK (Còn hàng), OUT_OF_STOCK (Hết hàng / Đã bán)
        public string? StorageLocation { get; set; } = "AT_YARD"; // AT_YARD (Ở bãi), AT_SITE (Ở công trình)
        public int? CategoryId { get; set; }
        public string Province { get; set; } = string.Empty;
        public string? City { get; set; } // Lâm Đồng, Bình Dương, Đồng Nai, TP.HCM
        public string? District { get; set; } // Dĩ An, Thuận An, Bảo Lộc, Đà Lạt
        public string Kcn { get; set; } = string.Empty; // Vị trí kho bãi cụ thể
        public long Price { get; set; }
        public string? UnitPrice { get; set; }
        public string Area { get; set; } = string.Empty; // m² hoặc Tấn hoặc Mét dài
        public double? Length { get; set; } // Chiều dài (m)
        public double? Width { get; set; } // Chiều rộng (m)
        public string? StructureType { get; set; } // Thép I, Zamil, Kèo Tiệp, Khác
        public bool? HasCrane { get; set; } = false;
        public string? CraneCapacity { get; set; } // 5 Tấn, 10 Tấn...
        public string? BrokerPhone { get; set; }
        public string? VideoUrl { get; set; }
        public string? AudioUrl { get; set; }
        public string? Model3DUrl { get; set; } // File HTML 3D hoặc GLB
        public string? Drawing2DUrl { get; set; } // Bản vẽ 2D DXF / STEP / PDF
        public string? Image { get; set; }
        public string? Desc { get; set; }
        public bool TriggerEmail { get; set; } = true;
    }

    public class UpdatePropertyRequest : CreatePropertyRequest
    {
    }

    public class PropertyFilterQuery
    {
        public string? Type { get; set; } // ALL, hoặc Code danh mục
        public string? Status { get; set; }
        public string? StockStatus { get; set; } // IN_STOCK, OUT_OF_STOCK
        public string? StorageLocation { get; set; } // AT_YARD, AT_SITE
        public int? CategoryId { get; set; }
        public string? Keyword { get; set; }
        public string? Province { get; set; }
        public string? City { get; set; }
        public string? District { get; set; }
        public string? Kcn { get; set; }
        public string? StructureType { get; set; } // Thép I, Zamil, Kèo Tiệp
        public bool? HasCrane { get; set; }
        public double? MinLength { get; set; }
        public double? MaxLength { get; set; }
        public double? MinWidth { get; set; }
        public double? MaxWidth { get; set; }
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
