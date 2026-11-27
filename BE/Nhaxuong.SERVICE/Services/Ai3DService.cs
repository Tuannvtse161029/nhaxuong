using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Configuration;

namespace Nhaxuong.SERVICE.Services
{
    public class Generate3DRequest
    {
        public string Prompt { get; set; } = string.Empty;
        public double? Width { get; set; }
        public double? Length { get; set; }
        public double? Height { get; set; }
        public string? StructureType { get; set; }
        public bool? HasCrane { get; set; }
        public string? CraneCapacity { get; set; }
    }

    public class Ai3DResponse
    {
        public bool Success { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string Model3DUrl { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string SpecsSummary { get; set; } = string.Empty;
        public string AiMessage { get; set; } = string.Empty;
        public string HtmlContent { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }

    public interface IAi3DService
    {
        Task<Ai3DResponse> Generate3DModelAsync(Generate3DRequest request);
    }

    public class Ai3DService : IAi3DService
    {
        private readonly IConfiguration _config;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly string _apiKey;
        private readonly string _modelName;

        public Ai3DService(IConfiguration config, IHttpClientFactory httpClientFactory)
        {
            _config = config;
            _httpClientFactory = httpClientFactory;
            _apiKey = Environment.GetEnvironmentVariable("GEMINI_API_KEY")
                ?? _config["Gemini:ApiKey"]
                ?? "";
            _modelName = _config["Gemini:Model"] ?? "gemini-3-flash-preview";
        }

        public async Task<Ai3DResponse> Generate3DModelAsync(Generate3DRequest request)
        {
            var userPrompt = request.Prompt?.Trim() ?? string.Empty;

            // 1. Phân tích thông số cơ bản (Mặc định: 24m x 84m)
            double width = request.Width ?? 24;
            double length = request.Length ?? 84;
            double height = request.Height ?? 9.0;
            string structureType = string.IsNullOrWhiteSpace(request.StructureType) ? "Kèo Zamil Vát Tiết Diện" : request.StructureType.Trim();
            bool hasCrane = request.HasCrane ?? false;
            string craneCapacity = string.IsNullOrWhiteSpace(request.CraneCapacity) ? "10 Tấn" : request.CraneCapacity.Trim();

            // Phân tích văn bản tiếng Việt từ khung Chat
            if (!string.IsNullOrWhiteSpace(userPrompt))
            {
                // Regex tìm kích thước như "30x60", "24 x 84", "40m x 100m"
                var matchDim = Regex.Match(userPrompt, @"(\d{1,3})\s*(?:m|mét)?\s*[xX*]\s*(\d{1,3})");
                if (matchDim.Success)
                {
                    if (double.TryParse(matchDim.Groups[1].Value, out var parsedW)) width = parsedW;
                    if (double.TryParse(matchDim.Groups[2].Value, out var parsedL)) length = parsedL;
                }

                // Chiều cao
                var matchHeight = Regex.Match(userPrompt, @"cao\s*(\d{1,2}(?:\.\d+)?)\s*(?:m|mét)?", RegexOptions.IgnoreCase);
                if (matchHeight.Success)
                {
                    if (double.TryParse(matchHeight.Groups[1].Value, out var parsedH)) height = parsedH;
                }

                // Cẩu trục
                if (userPrompt.Contains("cẩu", StringComparison.OrdinalIgnoreCase) ||
                    userPrompt.Contains("crane", StringComparison.OrdinalIgnoreCase) ||
                    userPrompt.Contains("cầu trục", StringComparison.OrdinalIgnoreCase))
                {
                    hasCrane = true;
                    var matchCrane = Regex.Match(userPrompt, @"(\d{1,2})\s*(?:tấn|tan|t)", RegexOptions.IgnoreCase);
                    if (matchCrane.Success)
                    {
                        craneCapacity = matchCrane.Groups[1].Value + " Tấn";
                    }
                }
                else if (userPrompt.Contains("không cẩu", StringComparison.OrdinalIgnoreCase) ||
                         userPrompt.Contains("ko cẩu", StringComparison.OrdinalIgnoreCase))
                {
                    hasCrane = false;
                }

                // Kết cấu
                if (userPrompt.Contains("thép i", StringComparison.OrdinalIgnoreCase) || userPrompt.Contains("thep i", StringComparison.OrdinalIgnoreCase))
                {
                    structureType = "Thép I Tiêu Chuẩn";
                }
                else if (userPrompt.Contains("kèo tiệp", StringComparison.OrdinalIgnoreCase) || userPrompt.Contains("tiệp", StringComparison.OrdinalIgnoreCase))
                {
                    structureType = "Kèo Tiệp Tam Giác";
                }
                else if (userPrompt.Contains("zamil", StringComparison.OrdinalIgnoreCase))
                {
                    structureType = "Kèo Zamil Vát Tiết Diện";
                }
            }

            // Giới hạn kích thước hợp lý cho đồ họa
            if (width < 10) width = 24;
            if (width > 120) width = 120;
            if (length < 12) length = 84;
            if (length > 300) length = 300;
            if (height < 4) height = 9.0;
            if (height > 25) height = 25.0;

            var area = width * length;
            var baySpacing = 6.0;
            var bayCount = (int)Math.Max(2, Math.Round(length / baySpacing));
            baySpacing = Math.Round(length / bayCount, 2);

            var title = $"Nhà Xưởng {width}m x {length}m ({area:N0} m²) {structureType}" + (hasCrane ? $" - Cẩu Trục {craneCapacity}" : "");
            var specsSummary = $"Khẩu độ: {width}m | Chiều dài: {length}m ({area:N0} m²) | Cao giọt nước: {height}m | {bayCount} bước gian ({baySpacing}m) | Kết cấu: {structureType}" + (hasCrane ? $" | Cẩu trục: {craneCapacity}" : " | Không cẩu");

            // 2. Gọi Gemini AI để nhận phản hồi giải thích kỹ thuật và tư vấn
            string aiExplanation = $"Đã khởi tạo mô hình 3D kết cấu {structureType} kích thước {width}m x {length}m (tổng diện tích sàn {area:N0} m²). Hệ khung bố trí {bayCount} bước gian tiêu chuẩn ({baySpacing}m/gian) với hệ giằng chống xoắn và giằng ống Ø114. " +
                (hasCrane ? $"Đã tích hợp dầm đỡ ray và dầm cẩu trục tải trọng {craneCapacity} chạy suốt chiều dài xưởng." : "Thiết kế tối ưu khẩu độ thông thoáng, tiết kiệm chi phí khung thép.");

            if (!string.IsNullOrWhiteSpace(_apiKey))
            {
                try
                {
                    var geminiPrompt = $"Bạn là kỹ sư trưởng kết cấu nhà xưởng thép Zamil và trợ lý AI thông minh trên website nhaxuong.vn. Người dùng yêu cầu: '{userPrompt}'. Hãy đóng vai kỹ sư trả lời thân thiện, súc tích trong 2-3 câu bằng tiếng Việt về giải pháp kết cấu kích thước {width}m x {length}m ({area}m2), cao {height}m, kết cấu {structureType}, {(hasCrane ? $"cẩu trục {craneCapacity}" : "không cẩu trục")}, xà gồ C/Z và hệ giằng mái. Không dùng ký tự markdown phức tạp.";
                    var aiReply = await CallGeminiAsync(geminiPrompt);
                    if (!string.IsNullOrWhiteSpace(aiReply))
                    {
                        aiExplanation = aiReply.Trim();
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[Ai3DService] Gemini query notice: {ex.Message}");
                }
            }

            // 3. Sinh mã file HTML Three.js độc lập SÁNG RÕ, CHỐNG ĐEN MÀN HÌNH 100%
            var htmlCode = GenerateBrightThreeJsHtml(width, length, height, baySpacing, bayCount, structureType, hasCrane, craneCapacity, title, aiExplanation);

            // 4. Lưu file tĩnh vào thư mục wwwroot/uploads/3d/
            var baseDir = AppContext.BaseDirectory;
            var uploadsDir = Path.Combine(baseDir, "wwwroot", "uploads", "3d");
            if (!Directory.Exists(uploadsDir))
            {
                try { Directory.CreateDirectory(uploadsDir); } catch { }
            }

            var altDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "3d");
            if (!Directory.Exists(altDir))
            {
                try { Directory.CreateDirectory(altDir); } catch { }
            }

            var timeId = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            var fileName = $"nha_xuong_{width}x{length}_{timeId}.html";
            var filePath = Path.Combine(uploadsDir, fileName);

            try
            {
                await File.WriteAllTextAsync(filePath, htmlCode, Encoding.UTF8);
                if (altDir != uploadsDir)
                {
                    try { await File.WriteAllTextAsync(Path.Combine(altDir, fileName), htmlCode, Encoding.UTF8); } catch { }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Ai3DService] Write file error: {ex.Message}");
            }

            return new Ai3DResponse
            {
                Success = true,
                FileName = fileName,
                Model3DUrl = $"/uploads/3d/{fileName}",
                Title = title,
                SpecsSummary = specsSummary,
                AiMessage = aiExplanation,
                HtmlContent = htmlCode,
                Message = "Đã sinh mã mô hình 3D tương tác thành công!"
            };
        }

        private async Task<string> CallGeminiAsync(string prompt)
        {
            var client = _httpClientFactory.CreateClient();
            client.Timeout = TimeSpan.FromSeconds(15);

            var url = $"https://generativelanguage.googleapis.com/v1beta/models/{_modelName}:generateContent?key={_apiKey}";
            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = prompt }
                        }
                    }
                }
            };

            var jsonContent = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            var response = await client.PostAsync(url, jsonContent);
            if (response.IsSuccessStatusCode)
            {
                var respStr = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(respStr);
                var root = doc.RootElement;
                if (root.TryGetProperty("candidates", out var candidates) && candidates.GetArrayLength() > 0)
                {
                    var first = candidates[0];
                    if (first.TryGetProperty("content", out var content) &&
                        content.TryGetProperty("parts", out var parts) && parts.GetArrayLength() > 0)
                    {
                        return parts[0].GetProperty("text").GetString() ?? "";
                    }
                }
            }
            return "";
        }

        public static string GenerateFallbackThreeJsHtml(double width, double length)
        {
            var h = 9.0;
            var baySpacing = 6.0;
            var bayCount = (int)Math.Max(2, Math.Round(length / baySpacing));
            baySpacing = Math.Round(length / bayCount, 2);
            return GenerateBrightThreeJsHtml(width, length, h, baySpacing, bayCount, "Kèo Zamil Vát Tiết Diện", false, "", $"Nhà Xưởng {width}m x {length}m", "Mô hình 3D kết cấu nhà xưởng thép chuẩn.");
        }

        public static string GenerateBrightThreeJsHtml(
            double width,
            double length,
            double height,
            double baySpacing,
            int bayCount,
            string structureType,
            bool hasCrane,
            string craneCapacity,
            string title,
            string aiNote)
        {
            var area = width * length;
            var ridgeHeight = Math.Round(height + (width * 0.1), 1); // Độ dốc mái 10%
            var halfW = width / 2.0;
            var halfL = length / 2.0;

            var invW = width.ToString(System.Globalization.CultureInfo.InvariantCulture);
            var invL = length.ToString(System.Globalization.CultureInfo.InvariantCulture);
            var invH = height.ToString(System.Globalization.CultureInfo.InvariantCulture);
            var invRidgeH = ridgeHeight.ToString(System.Globalization.CultureInfo.InvariantCulture);
            var invBayS = baySpacing.ToString(System.Globalization.CultureInfo.InvariantCulture);

            var craneHtml = hasCrane
                ? $@"<tr><td>Cẩu trục chạy suốt:</td><td><b>{craneCapacity}</b> (Dầm ray & dầm đỡ thép)</td></tr>"
                : "<tr><td>Cẩu trục:</td><td>Không bố trí (Tiết kiệm chi phí khung)</td></tr>";

            return $@"<!DOCTYPE html>
<html lang=""vi"">
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>{title}</title>
    <!-- Three.js + OrbitControls with multi-CDN fallback -->
    <script src=""https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js""></script>
    <script>
      if (typeof THREE === 'undefined') {{
        document.write('<script src=""https://unpkg.com/three@0.128.0/build/three.min.js""><\/script>');
      }}
    </script>
    <script src=""https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js""></script>
    <script>
      if (typeof THREE !== 'undefined' && !THREE.OrbitControls) {{
        document.write('<script src=""https://unpkg.com/three@0.128.0/examples/js/controls/OrbitControls.js""><\/script>');
      }}
    </script>
    <link rel=""stylesheet"" href=""https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"">
    <style>
        :root {{
            --bg-canvas: #f8fafc;
            --bg-card: rgba(255, 255, 255, 0.95);
            --border: #cbd5e1;
            --text-main: #0f172a;
            --text-muted: #475569;
            --primary-orange: #ea580c;
            --accent-blue: #0284c7;
            --accent-green: #16a34a;
        }}
        * {{ box-sizing: border-box; margin: 0; padding: 0; user-select: none; }}
        body {{
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
            background-color: var(--bg-canvas);
            color: var(--text-main);
            overflow: hidden;
            width: 100vw;
            height: 100vh;
        }}
        #webgl-container {{ position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; }}
        .header-bar {{
            position: absolute; top: 12px; left: 14px; right: 14px; z-index: 10;
            display: flex; align-items: center; justify-content: space-between;
            pointer-events: none;
        }}
        .brand-badge {{
            background: var(--bg-card); backdrop-filter: blur(12px);
            border: 1px solid var(--border); padding: 8px 14px;
            border-radius: 14px; pointer-events: auto;
            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        }}
        .brand-badge h1 {{ font-size: 13px; font-weight: 800; color: var(--primary-orange); display: flex; align-items: center; gap: 6px; }}
        .brand-badge p {{ font-size: 10.5px; color: var(--text-muted); font-weight: 600; margin-top: 1px; }}

        .btn-head-quick {{
            background: var(--bg-card); border: 1px solid var(--border);
            color: var(--text-main); height: 34px; padding: 0 10px;
            border-radius: 10px; cursor: pointer; display: flex;
            align-items: center; justify-content: center; gap: 5px; font-size: 11px;
            font-weight: 700; box-shadow: 0 4px 12px rgba(0,0,0,0.06); transition: all 0.2s;
        }}
        .btn-head-quick:hover {{ border-color: var(--primary-orange); color: var(--primary-orange); transform: translateY(-1px); }}

        /* BẢNG CHÚ THÍCH KẾT CẤU BÊN TRÁI */
        .panel-specs {{
            position: absolute; top: 68px; left: 14px; width: 310px; max-height: calc(100vh - 130px);
            overflow-y: auto; z-index: 20; background: var(--bg-card);
            backdrop-filter: blur(14px); border: 1px solid var(--border);
            border-radius: 16px; padding: 14px; box-shadow: 0 8px 25px rgba(0,0,0,0.08);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }}
        .panel-specs.collapsed {{ transform: translateX(-350px); opacity: 0; pointer-events: none; }}
        .spec-title {{ font-size: 11.5px; font-weight: 800; color: var(--primary-orange); text-transform: uppercase; }}
        .spec-table {{ width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 4px; }}
        .spec-table td {{ padding: 4.5px 2px; border-bottom: 1px solid rgba(0,0,0,0.05); }}
        .spec-table td:first-child {{ color: var(--text-muted); width: 44%; }}
        .spec-table td:last-child {{ font-weight: 700; text-align: right; }}

        .btn-toggle-specs {{
            position: absolute; top: 68px; left: 14px; z-index: 15;
            background: var(--bg-card); border: 1px solid var(--primary-orange);
            color: var(--primary-orange); padding: 7px 14px; border-radius: 20px;
            font-size: 11.5px; font-weight: 700; cursor: pointer;
            box-shadow: 0 4px 14px rgba(234,88,12,0.22); backdrop-filter: blur(10px);
            display: flex; align-items: center; gap: 6px;
        }}

        /* BẢNG ĐIỀU KHIỂN BẬT / TẮT KẾT CẤU BÊN PHẢI */
        .panel-layers {{
            position: absolute; top: 68px; right: 14px; width: 235px; max-height: calc(100vh - 130px);
            overflow-y: auto; z-index: 20; background: var(--bg-card);
            backdrop-filter: blur(14px); border: 1px solid var(--border);
            border-radius: 16px; padding: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.08);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }}
        .panel-layers.collapsed {{ transform: translateX(270px); opacity: 0; pointer-events: none; }}
        .layers-title {{ font-size: 11.5px; font-weight: 800; color: var(--primary-orange); text-transform: uppercase; }}

        .btn-toggle-layers {{
            position: absolute; top: 68px; right: 14px; z-index: 15;
            background: var(--bg-card); border: 1px solid var(--primary-orange);
            color: var(--primary-orange); padding: 7px 14px; border-radius: 20px;
            font-size: 11.5px; font-weight: 700; cursor: pointer;
            box-shadow: 0 4px 14px rgba(234,88,12,0.22); backdrop-filter: blur(10px);
            display: flex; align-items: center; gap: 6px;
        }}

        .layer-btn {{
            display: flex; align-items: center; justify-content: space-between;
            width: 100%; padding: 7.5px 10px; margin-bottom: 5px;
            background: #ffffff; border: 1px solid var(--border);
            border-radius: 10px; font-size: 11.5px; font-weight: 700;
            color: var(--text-main); cursor: pointer; transition: all 0.2s;
            text-align: left;
        }}
        .layer-btn:hover {{ border-color: var(--primary-orange); background: #fff7ed; transform: translateY(-1px); }}
        .layer-btn.active {{ border-color: var(--primary-orange); background: rgba(234,88,12,0.06); }}
        .layer-btn-title {{ display: flex; align-items: center; gap: 6px; }}
        .layer-badge {{
            padding: 2px 7px; border-radius: 8px; font-size: 9.5px; font-weight: 800;
        }}
        .layer-badge.on {{ background: #16a34a; color: #ffffff; }}
        .layer-badge.off {{ background: #64748b; color: #ffffff; }}

        .btn-close-panel {{
            background: none; border: none; color: var(--text-muted);
            cursor: pointer; font-size: 13px; font-weight: 700; padding: 2px 6px;
        }}
        .btn-close-panel:hover {{ color: var(--primary-orange); }}

        .view-controls {{
            position: absolute; bottom: 14px; left: 50%; transform: translateX(-50%);
            z-index: 10; display: flex; gap: 5px; background: var(--bg-card);
            backdrop-filter: blur(14px); border: 1px solid var(--border);
            padding: 5px 10px; border-radius: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            max-width: 95vw; overflow-x: auto;
        }}
        .view-btn {{
            background: transparent; border: none; padding: 5px 9px;
            font-size: 10.5px; font-weight: 700; color: var(--text-muted);
            border-radius: 20px; cursor: pointer; white-space: nowrap; transition: all 0.2s;
        }}
        .view-btn.active, .view-btn:hover {{ background: var(--primary-orange); color: white; }}
        .ai-badge {{
            margin-top: 8px; padding: 8px; border-radius: 8px;
            background: rgba(2, 132, 199, 0.08); border-left: 3px solid var(--accent-blue);
            font-size: 10px; line-height: 1.4; color: var(--text-main);
        }}

        @media (max-width: 640px) {{
            .panel-specs {{ width: calc(100vw - 28px); max-height: 58vh; }}
            .panel-layers {{ width: calc(100vw - 28px); max-height: 58vh; }}
            .brand-badge h1 {{ font-size: 11px; }}
            .brand-badge p {{ font-size: 9px; }}
            .hide-mob {{ display: none; }}
        }}
    </style>
</head>
<body>
    <div id=""webgl-container""></div>

    <div class=""header-bar"">
        <div class=""brand-badge"">
            <h1><i class=""fa-solid fa-cube text-orange-600""></i> {title}</h1>
            <p>Mô hình 3D xoay 360° | Kết Cấu Thép Chuẩn Tiền Chế</p>
        </div>
        <div style=""pointer-events:auto; display:flex; gap:6px;"">
            <button class=""btn-head-quick"" id=""btn-head-specs"" title=""Mở bảng chú thích kết cấu""><i class=""fa-solid fa-list-check""></i> <span class=""hide-mob"">Chú Thích</span></button>
            <button class=""btn-head-quick"" id=""btn-head-layers"" title=""Mở bảng bật tắt kết cấu""><i class=""fa-solid fa-layer-group""></i> <span class=""hide-mob"">Bật/Tắt</span></button>
            <button class=""btn-head-quick"" id=""btn-head-reset"" title=""Đặt lại góc nhìn""><i class=""fa-solid fa-arrows-rotate""></i></button>
        </div>
    </div>

    <!-- BÊN TRÁI: NÚT MỞ & BẢNG CHÚ THÍCH KẾT CẤU -->
    <button class=""btn-toggle-specs"" id=""btn-open-specs"" style=""display:none;"">
        <i class=""fa-solid fa-ruler-combined""></i> <span>Xem Chú Thích Kết Cấu</span>
    </button>

    <div class=""panel-specs"" id=""specs-panel"">
        <div style=""display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; padding-bottom:4px; border-bottom:1px solid rgba(0,0,0,0.06);"">
            <div class=""spec-title""><i class=""fa-solid fa-ruler-combined""></i> Chú Thích Kết Cấu</div>
            <button id=""btn-close-specs"" class=""btn-close-panel"" title=""Thu gọn"">✕</button>
        </div>
        <table class=""spec-table"">
            <tr><td>Khẩu độ (Rộng):</td><td><b>{width} mét</b></td></tr>
            <tr><td>Chiều dài tổng thể:</td><td><b>{length} mét</b></td></tr>
            <tr><td>Diện tích sàn:</td><td><b>{area:N0} m²</b></td></tr>
            <tr><td>Bước gian (Bay):</td><td><b>{bayCount} gian ({baySpacing}m/gian)</b></td></tr>
            <tr><td>Chiều cao giọt nước:</td><td><b>{height} mét</b></td></tr>
            <tr><td>Chiều cao đỉnh nóc:</td><td><b>{ridgeHeight} mét</b></td></tr>
            <tr><td>Hệ khung kết cấu:</td><td><b>{structureType}</b></td></tr>
            {craneHtml}
            <tr><td>Hệ xà gồ mái:</td><td>Thép Z200 mạ kẽm Z275 (~1.3m/thanh)</td></tr>
            <tr><td>Hệ xà gồ vách:</td><td>Thép C150 mạ kẽm Z275 (~1.3m/thanh)</td></tr>
            <tr><td>Mái tôn:</td><td>Tôn sóng vuông 0.45mm cao cấp</td></tr>
            <tr><td>Tôn vách bao che:</td><td>Tôn mạ màu chống nóng 0.45mm</td></tr>
            <tr><td>Tường gạch chân cột:</td><td>Xây gạch cao 1.2m chống ẩm</td></tr>
            <tr><td>Cửa chính xưởng:</td><td>Cửa cuốn CN + Mái đón Canopy</td></tr>
            <tr><td>Hệ giằng chống xoắn:</td><td>Giằng chữ X + giằng ống Ø114</td></tr>
        </table>
        <div class=""ai-badge"">
            <b><i class=""fa-solid fa-calculator text-blue-600""></i> Tư vấn giải pháp kỹ thuật:</b><br>
            {aiNote}
        </div>
    </div>

    <!-- BÊN PHẢI: NÚT MỞ & BẢNG ĐIỀU KHIỂN BẬT / TẮT KẾT CẤU -->
    <button class=""btn-toggle-layers"" id=""btn-open-layers"" style=""display:none;"">
        <i class=""fa-solid fa-layer-group""></i> <span>Bật / Tắt Kết Cấu</span>
    </button>

    <div class=""panel-layers"" id=""layers-panel"">
        <div style=""display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; padding-bottom:4px; border-bottom:1px solid rgba(0,0,0,0.06);"">
            <div class=""layers-title""><i class=""fa-solid fa-layer-group""></i> Bật / Tắt Kết Cấu 3D</div>
            <button id=""btn-close-layers"" class=""btn-close-panel"" title=""Thu gọn"">✕</button>
        </div>

        <button class=""layer-btn active"" id=""btn-layer-roof"">
            <span class=""layer-btn-title""><i class=""fa-solid fa-shield-halved text-blue-600""></i> Mái Tôn</span>
            <span class=""layer-badge on"" id=""badge-roof"">BẬT</span>
        </button>

        <button class=""layer-btn active"" id=""btn-layer-wall"">
            <span class=""layer-btn-title""><i class=""fa-solid fa-building text-slate-600""></i> Tôn Vách</span>
            <span class=""layer-badge on"" id=""badge-wall"">BẬT</span>
        </button>

        <button class=""layer-btn active"" id=""btn-layer-roof-purlin"">
            <span class=""layer-btn-title""><i class=""fa-solid fa-bars text-amber-600""></i> Xà Gồ Mái</span>
            <span class=""layer-badge on"" id=""badge-roof-purlin"">BẬT</span>
        </button>

        <button class=""layer-btn active"" id=""btn-layer-wall-girt"">
            <span class=""layer-btn-title""><i class=""fa-solid fa-grip-lines-vertical text-amber-600""></i> Xà Gồ Vách</span>
            <span class=""layer-badge on"" id=""badge-wall-girt"">BẬT</span>
        </button>

        <button class=""layer-btn active"" id=""btn-layer-frame"">
            <span class=""layer-btn-title""><i class=""fa-solid fa-archway text-orange-600""></i> Cột & Kèo Zamil</span>
            <span class=""layer-badge on"" id=""badge-frame"">BẬT</span>
        </button>

        <button class=""layer-btn active"" id=""btn-layer-brick"">
            <span class=""layer-btn-title""><i class=""fa-solid fa-cubes-stacked text-slate-500""></i> Tường Gạch 1.2m</span>
            <span class=""layer-badge on"" id=""badge-brick"">BẬT</span>
        </button>

        <button class=""layer-btn active"" id=""btn-layer-door"">
            <span class=""layer-btn-title""><i class=""fa-solid fa-door-closed text-indigo-600""></i> Cửa & Mái Đón</span>
            <span class=""layer-badge on"" id=""badge-door"">BẬT</span>
        </button>

        <button class=""layer-btn active"" id=""btn-layer-dim"">
            <span class=""layer-btn-title""><i class=""fa-solid fa-ruler-vertical text-teal-600""></i> Thước Đo 3D</span>
            <span class=""layer-badge on"" id=""badge-dim"">BẬT</span>
        </button>

        <button class=""layer-btn"" id=""btn-layer-reset"" style=""margin-top:3px; border-color:var(--primary-orange); color:var(--primary-orange);"">
            <span class=""layer-btn-title""><i class=""fa-solid fa-arrows-rotate""></i> Đặt Lại Góc Nhìn</span>
            <span style=""font-size:10px;"">Toàn cảnh</span>
        </button>
    </div>

    <div class=""view-controls"">
        <button class=""view-btn active"" id=""btn-view-orbit"">Toàn Cảnh</button>
        <button class=""view-btn"" id=""btn-view-front"">Mặt Trước</button>
        <button class=""view-btn"" id=""btn-view-side"">Bên Hông</button>
        <button class=""view-btn"" id=""btn-view-bird"">Chim Bay</button>
        <button class=""view-btn"" id=""btn-view-inside"">Nội Thất</button>
    </div>

    <script>
        const W = {invW};
        const L = {invL};
        const H = {invH};
        const RIDGE_H = {invRidgeH};
        const BAYS = {bayCount};
        const BAY_S = {invBayS};
        const HAS_CRANE = {(hasCrane ? "true" : "false")};

        const container = document.getElementById('webgl-container');
        const getW = () => (container && container.clientWidth > 0 ? container.clientWidth : window.innerWidth) || 360;
        const getH = () => (container && container.clientHeight > 0 ? container.clientHeight : window.innerHeight) || 240;

        const scene = new THREE.Scene();
        // NỀN SÁNG BẠC HIỆN ĐẠI (CHỐNG ĐEN MÀN HÌNH)
        scene.background = new THREE.Color(0xf8fafc);
        scene.fog = new THREE.FogExp2(0xf8fafc, 0.0035);

        const camera = new THREE.PerspectiveCamera(40, getW() / getH(), 0.2, 2000);
        camera.position.set(W * 1.35, H * 1.9, L * 0.95);

        const renderer = new THREE.WebGLRenderer({{ antialias: true, alpha: false, powerPreference: 'high-performance' }});
        renderer.setSize(getW(), getH());
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.15;
        container.appendChild(renderer.domElement);

        let controls = null;
        if (typeof THREE.OrbitControls !== 'undefined') {{
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.maxPolarAngle = Math.PI / 2 - 0.01;
            controls.minDistance = 3;
            controls.maxDistance = 500;
            controls.target.set(0, H * 0.45, 0);
        }}

        // HỆ THỐNG ÁNH SÁNG SÁNG RỰC RỠ
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
        scene.add(ambientLight);

        const sunLight = new THREE.DirectionalLight(0xfffaed, 1.35);
        sunLight.position.set(W * 1.5, H * 3.5, L * 1.2);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.bias = -0.0004;
        scene.add(sunLight);

        const fillLight = new THREE.DirectionalLight(0xdbeafe, 0.55);
        fillLight.position.set(-W * 1.2, H * 2.0, -L * 1.0);
        scene.add(fillLight);

        // Nền khuôn viên xung quanh
        const groundGeo = new THREE.PlaneGeometry(W * 3.5, L * 3.0);
        const groundMat = new THREE.MeshStandardMaterial({{ color: 0xe2e8f0, roughness: 0.9, metalness: 0.05 }});
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);

        // Sàn bê tông nhà xưởng
        const floorGeo = new THREE.PlaneGeometry(W, L);
        const floorMat = new THREE.MeshStandardMaterial({{ color: 0xcfd8dc, roughness: 0.7, metalness: 0.1 }});
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = 0.05;
        floor.receiveShadow = true;
        scene.add(floor);

        // Vật liệu kết cấu
        const matSteelZamil = new THREE.MeshStandardMaterial({{ color: 0xea580c, roughness: 0.35, metalness: 0.65 }});
        const matPurlin = new THREE.MeshStandardMaterial({{ color: 0x94a3b8, roughness: 0.4, metalness: 0.8 }});
        const matFooting = new THREE.MeshStandardMaterial({{ color: 0x94a3b8, roughness: 0.85, metalness: 0.1 }});
        const matCrane = new THREE.MeshStandardMaterial({{ color: 0xf59e0b, roughness: 0.35, metalness: 0.8 }});
        const matBrace = new THREE.MeshStandardMaterial({{ color: 0xc2410c, roughness: 0.4, metalness: 0.7 }});
        const matRoofBlue = new THREE.MeshStandardMaterial({{ color: 0x0284c7, roughness: 0.4, metalness: 0.2, side: THREE.DoubleSide, transparent: true, opacity: 0.88 }});
        const matWallSheet = new THREE.MeshStandardMaterial({{ color: 0x64748b, roughness: 0.5, metalness: 0.3, side: THREE.DoubleSide, transparent: true, opacity: 0.82 }});
        const matBrick = new THREE.MeshStandardMaterial({{ color: 0x475569, roughness: 0.85, metalness: 0.1 }});
        const matDoor = new THREE.MeshStandardMaterial({{ color: 0x1e293b, roughness: 0.4, metalness: 0.7, side: THREE.DoubleSide }});
        const matCanopy = new THREE.MeshStandardMaterial({{ color: 0xea580c, roughness: 0.35, metalness: 0.65 }});

        const frameGroup = new THREE.Group();
        const roofPurlinGroup = new THREE.Group();
        const wallGirtGroup = new THREE.Group();
        const wallSheetGroup = new THREE.Group();
        const brickGroup = new THREE.Group();
        const doorGroup = new THREE.Group();
        const roofGroup = new THREE.Group();
        const dimGroup = new THREE.Group();

        const halfW = W / 2;
        const halfL = L / 2;
        const rafterLen = Math.sqrt(Math.pow(halfW, 2) + Math.pow(RIDGE_H - H, 2));
        const rafterAngle = Math.atan2(RIDGE_H - H, halfW);

        // 1. DỰNG CÁC KHUNG ZAMIL CHÍNH (Cột, Kèo, Móng, Giằng)
        for (let i = 0; i <= BAYS; i++) {{
            const z = -halfL + i * BAY_S;

            // Cột bên trái & phải
            const colGeo = new THREE.BoxGeometry(0.42, H, 0.65);
            const colL = new THREE.Mesh(colGeo, matSteelZamil);
            colL.position.set(-halfW + 0.25, H / 2, z);
            colL.castShadow = true;
            frameGroup.add(colL);

            const colR = new THREE.Mesh(colGeo, matSteelZamil);
            colR.position.set(halfW - 0.25, H / 2, z);
            colR.castShadow = true;
            frameGroup.add(colR);

            // Móng bê tông cổ cột
            const footGeo = new THREE.BoxGeometry(0.9, 0.6, 0.9);
            const footL = new THREE.Mesh(footGeo, matFooting);
            footL.position.set(-halfW + 0.25, 0.3, z);
            frameGroup.add(footL);

            const footR = new THREE.Mesh(footGeo, matFooting);
            footR.position.set(halfW - 0.25, 0.3, z);
            frameGroup.add(footR);

            // Kèo Zamil vát tiết diện
            const rafterGeo = new THREE.BoxGeometry(rafterLen, 0.4, 0.32);

            const rafterL = new THREE.Mesh(rafterGeo, matSteelZamil);
            rafterL.position.set(-halfW / 2, H + (RIDGE_H - H) / 2, z);
            rafterL.rotation.z = rafterAngle;
            rafterL.castShadow = true;
            frameGroup.add(rafterL);

            const rafterR = new THREE.Mesh(rafterGeo, matSteelZamil);
            rafterR.position.set(halfW / 2, H + (RIDGE_H - H) / 2, z);
            rafterR.rotation.z = -rafterAngle;
            rafterR.castShadow = true;
            frameGroup.add(rafterR);
        }}

        // Cột chống gió đầu hồi sau
        if (W >= 18) {{
            const gablePostGeo = new THREE.BoxGeometry(0.35, H, 0.35);
            const pBackL = new THREE.Mesh(gablePostGeo, matSteelZamil);
            pBackL.position.set(-halfW / 2, H / 2, -halfL);
            frameGroup.add(pBackL);

            const pBackR = new THREE.Mesh(gablePostGeo, matSteelZamil);
            pBackR.position.set(halfW / 2, H / 2, -halfL);
            frameGroup.add(pBackR);
        }}

        // Dầm cẩu trục và ray nếu có
        if (HAS_CRANE) {{
            const craneH = H * 0.68;
            const craneBeamGeo = new THREE.BoxGeometry(0.32, 0.5, L);

            const beamL = new THREE.Mesh(craneBeamGeo, matCrane);
            beamL.position.set(-halfW + 0.9, craneH, 0);
            frameGroup.add(beamL);

            const beamR = new THREE.Mesh(craneBeamGeo, matCrane);
            beamR.position.set(halfW - 0.9, craneH, 0);
            frameGroup.add(beamR);

            // Dầm cẩu trục ngang màu vàng
            const bridgeGeo = new THREE.BoxGeometry(W - 1.8, 0.55, 1.4);
            const bridge = new THREE.Mesh(bridgeGeo, matCrane);
            bridge.position.set(0, craneH + 0.38, 0);
            bridge.castShadow = true;
            frameGroup.add(bridge);
        }}

        // Hệ giằng chữ X ở gian đầu và cuối
        function addXBrace(xPos, zStart, zEnd, yLow, yHigh) {{
            const zMid = (zStart + zEnd) / 2;
            const yMid = (yLow + yHigh) / 2;
            const dz = zEnd - zStart;
            const dy = yHigh - yLow;
            const len = Math.sqrt(dz * dz + dy * dy);
            const angle = Math.atan2(dy, dz);

            const barGeo = new THREE.CylinderGeometry(0.045, 0.045, len, 8);

            const b1 = new THREE.Mesh(barGeo, matBrace);
            b1.position.set(xPos, yMid, zMid);
            b1.rotation.x = Math.PI / 2 - angle;
            frameGroup.add(b1);

            const b2 = new THREE.Mesh(barGeo, matBrace);
            b2.position.set(xPos, yMid, zMid);
            b2.rotation.x = Math.PI / 2 + angle;
            frameGroup.add(b2);
        }}

        addXBrace(-halfW + 0.25, -halfL, -halfL + BAY_S, 0.6, H * 0.5);
        addXBrace(halfW - 0.25, -halfL, -halfL + BAY_S, 0.6, H * 0.5);
        addXBrace(-halfW + 0.25, halfL - BAY_S, halfL, 0.6, H * 0.5);
        addXBrace(halfW - 0.25, halfL - BAY_S, halfL, 0.6, H * 0.5);

        // 2. HỆ XÀ GỒ MÁI RIÊNG BIỆT (Roof Purlins C/Z)
        const numRoofPurlins = Math.max(3, Math.round(rafterLen / 1.35));
        const roofPurlinGeo = new THREE.BoxGeometry(0.12, 0.18, L + 0.4);

        for (let p = 0; p <= numRoofPurlins; p++) {{
            const d = (p / numRoofPurlins) * rafterLen;

            // Xà gồ mái trái
            const purlinL = new THREE.Mesh(roofPurlinGeo, matPurlin);
            const xL = -halfW + d * Math.cos(rafterAngle);
            const yL = H + d * Math.sin(rafterAngle) + 0.12;
            purlinL.position.set(xL, yL, 0);
            purlinL.rotation.z = rafterAngle;
            purlinL.castShadow = true;
            roofPurlinGroup.add(purlinL);

            // Xà gồ mái phải
            const purlinR = new THREE.Mesh(roofPurlinGeo, matPurlin);
            const xR = halfW - d * Math.cos(rafterAngle);
            const yR = H + d * Math.sin(rafterAngle) + 0.12;
            purlinR.position.set(xR, yR, 0);
            purlinR.rotation.z = -rafterAngle;
            purlinR.castShadow = true;
            roofPurlinGroup.add(purlinR);
        }}

        // 3. HỆ XÀ GỒ VÁCH RIÊNG BIỆT (Wall Girts C/Z)
        const numWallGirts = Math.max(2, Math.round((H - 1.4) / 1.3));
        const sideGirtGeo = new THREE.BoxGeometry(0.12, 0.16, L + 0.4);

        for (let g = 0; g <= numWallGirts; g++) {{
            const yG = 1.3 + (g / numWallGirts) * (H - 1.5);

            // Xà gồ vách trái
            const girtL = new THREE.Mesh(sideGirtGeo, matPurlin);
            girtL.position.set(-halfW - 0.08, yG, 0);
            wallGirtGroup.add(girtL);

            // Xà gồ vách phải
            const girtR = new THREE.Mesh(sideGirtGeo, matPurlin);
            girtR.position.set(halfW + 0.08, yG, 0);
            wallGirtGroup.add(girtR);

            // Xà gồ vách đầu hồi sau
            const backGirtGeo = new THREE.BoxGeometry(W + 0.3, 0.16, 0.12);
            const girtBack = new THREE.Mesh(backGirtGeo, matPurlin);
            girtBack.position.set(0, yG, -halfL - 0.08);
            wallGirtGroup.add(girtBack);
        }}

        // 4. TƯỜNG GẠCH CHÂN CỘT (Brick Skirting 1.2m)
        const brickH = 1.2;
        const brickSideGeo = new THREE.BoxGeometry(0.24, brickH, L);
        const brickL = new THREE.Mesh(brickSideGeo, matBrick);
        brickL.position.set(-halfW, brickH / 2, 0);
        brickGroup.add(brickL);

        const brickR = new THREE.Mesh(brickSideGeo, matBrick);
        brickR.position.set(halfW, brickH / 2, 0);
        brickGroup.add(brickR);

        const brickBackGeo = new THREE.BoxGeometry(W, brickH, 0.24);
        const brickBack = new THREE.Mesh(brickBackGeo, matBrick);
        brickBack.position.set(0, brickH / 2, -halfL);
        brickGroup.add(brickBack);

        // Kích thước cửa chính xưởng
        const doorW = Math.min(W * 0.32, 6.0);
        const doorH = Math.min(H * 0.52, 4.6);
        const frontBrickSegW = (W - doorW) / 2;

        const brickFrontSegGeo = new THREE.BoxGeometry(frontBrickSegW, brickH, 0.24);
        const brickFrontL = new THREE.Mesh(brickFrontSegGeo, matBrick);
        brickFrontL.position.set(-halfW + frontBrickSegW / 2, brickH / 2, halfL);
        brickGroup.add(brickFrontL);

        const brickFrontR = new THREE.Mesh(brickFrontSegGeo, matBrick);
        brickFrontR.position.set(halfW - frontBrickSegW / 2, brickH / 2, halfL);
        brickGroup.add(brickFrontR);

        // 5. TÔN VÁCH BAO CHE (Wall Cladding Sheets)
        const wallH = H - brickH;
        const wallSidePlaneGeo = new THREE.PlaneGeometry(L, wallH);

        const wallL = new THREE.Mesh(wallSidePlaneGeo, matWallSheet);
        wallL.position.set(-halfW - 0.15, brickH + wallH / 2, 0);
        wallL.rotation.y = Math.PI / 2;
        wallSheetGroup.add(wallL);

        const wallR = new THREE.Mesh(wallSidePlaneGeo, matWallSheet);
        wallR.position.set(halfW + 0.15, brickH + wallH / 2, 0);
        wallR.rotation.y = -Math.PI / 2;
        wallSheetGroup.add(wallR);

        // Tôn đầu hồi sau
        const wallBackPlaneGeo = new THREE.PlaneGeometry(W, wallH);
        const wallBack = new THREE.Mesh(wallBackPlaneGeo, matWallSheet);
        wallBack.position.set(0, brickH + wallH / 2, -halfL - 0.15);
        wallSheetGroup.add(wallBack);

        // Tam giác tôn đầu hồi đỉnh nóc
        const gableShape = new THREE.Shape();
        gableShape.moveTo(-halfW, H);
        gableShape.lineTo(0, RIDGE_H);
        gableShape.lineTo(halfW, H);
        gableShape.closePath();

        const gableGeo = new THREE.ShapeGeometry(gableShape);
        const gableBack = new THREE.Mesh(gableGeo, matWallSheet);
        gableBack.position.set(0, 0, -halfL - 0.15);
        wallSheetGroup.add(gableBack);

        const gableFront = new THREE.Mesh(gableGeo, matWallSheet);
        gableFront.position.set(0, 0, halfL + 0.15);
        wallSheetGroup.add(gableFront);

        // Tôn đầu hồi trước
        const frontWallSegGeo = new THREE.PlaneGeometry(frontBrickSegW, wallH);
        const frontWallL = new THREE.Mesh(frontWallSegGeo, matWallSheet);
        frontWallL.position.set(-halfW + frontBrickSegW / 2, brickH + wallH / 2, halfL + 0.15);
        wallSheetGroup.add(frontWallL);

        const frontWallR = new THREE.Mesh(frontWallSegGeo, matWallSheet);
        frontWallR.position.set(halfW - frontBrickSegW / 2, brickH + wallH / 2, halfL + 0.15);
        wallSheetGroup.add(frontWallR);

        if (H > doorH) {{
            const aboveDoorH = H - doorH;
            const frontWallTopGeo = new THREE.PlaneGeometry(doorW, aboveDoorH);
            const frontWallTop = new THREE.Mesh(frontWallTopGeo, matWallSheet);
            frontWallTop.position.set(0, doorH + aboveDoorH / 2, halfL + 0.15);
            wallSheetGroup.add(frontWallTop);
        }}

        // 6. CỬA CUỐN CÔNG NGHIỆP & MÁI ĐÓN CANOPY
        const doorGeo = new THREE.PlaneGeometry(doorW, doorH);
        const doorMesh = new THREE.Mesh(doorGeo, matDoor);
        doorMesh.position.set(0, doorH / 2, halfL + 0.16);
        doorGroup.add(doorMesh);

        // Mái đón canopy
        const canopyGeo = new THREE.BoxGeometry(doorW + 1.2, 0.12, 1.8);
        const canopy = new THREE.Mesh(canopyGeo, matCanopy);
        canopy.position.set(0, doorH + 0.25, halfL + 0.9);
        doorGroup.add(canopy);

        // 7. MÁI TÔN & DIỀM NÓC GIÓ
        const roofPlaneGeo = new THREE.PlaneGeometry(rafterLen + 0.8, L + 1.0);
        const roofL = new THREE.Mesh(roofPlaneGeo, matRoofBlue);
        roofL.position.set(-halfW / 2, H + (RIDGE_H - H) / 2 + 0.22, 0);
        roofL.rotation.x = Math.PI / 2;
        roofL.rotation.y = rafterAngle;
        roofGroup.add(roofL);

        const roofR = new THREE.Mesh(roofPlaneGeo, matRoofBlue);
        roofR.position.set(halfW / 2, H + (RIDGE_H - H) / 2 + 0.22, 0);
        roofR.rotation.x = Math.PI / 2;
        roofR.rotation.y = -rafterAngle;
        roofGroup.add(roofR);

        // Nóc gió / diềm nóc
        const ridgeCapGeo = new THREE.BoxGeometry(1.2, 0.25, L + 1.2);
        const ridgeCap = new THREE.Mesh(ridgeCapGeo, matCanopy);
        ridgeCap.position.set(0, RIDGE_H + 0.25, 0);
        roofGroup.add(ridgeCap);

        // 8. THƯỚC ĐO KÍCH THƯỚC 3D TRỰC QUAN BÊN TRÁI XƯỞNG
        const dimX = -halfW - 2.2;
        const dimMat = new THREE.MeshBasicMaterial({{ color: 0x0284c7 }});

        const poleGeo = new THREE.CylinderGeometry(0.04, 0.04, RIDGE_H + 0.6, 8);
        const pole = new THREE.Mesh(poleGeo, dimMat);
        pole.position.set(dimX, (RIDGE_H + 0.6) / 2, 0);
        dimGroup.add(pole);

        const tick0 = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.04, 0.04), dimMat);
        tick0.position.set(dimX + 0.4, 0.05, 0);
        dimGroup.add(tick0);

        const tickH = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.05), dimMat);
        tickH.position.set(dimX + 0.6, H, 0);
        dimGroup.add(tickH);

        const tickRidge = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.05), dimMat);
        tickRidge.position.set(dimX + 0.6, RIDGE_H, 0);
        dimGroup.add(tickRidge);

        function makeLabelSprite(text, bgCol, borderCol) {{
            const canvas = document.createElement('canvas');
            canvas.width = 320;
            canvas.height = 72;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = bgCol || 'rgba(15, 23, 42, 0.9)';
            if (ctx.roundRect) {{
                ctx.roundRect(4, 4, 312, 64, 12);
            }} else {{
                ctx.rect(4, 4, 312, 64);
            }}
            ctx.fill();
            ctx.strokeStyle = borderCol || '#ea580c';
            ctx.lineWidth = 4;
            ctx.stroke();
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 22px Segoe UI, -apple-system, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, 160, 36);

            const tex = new THREE.CanvasTexture(canvas);
            const sMat = new THREE.SpriteMaterial({{ map: tex, depthTest: false }});
            const sprite = new THREE.Sprite(sMat);
            sprite.scale.set(4.4, 1.05, 1);
            return sprite;
        }}

        const spH = makeLabelSprite('H Giọt nước: ' + H + 'm', 'rgba(2, 132, 199, 0.92)', '#38bdf8');
        spH.position.set(dimX - 2.5, H, 0);
        dimGroup.add(spH);

        const spRidge = makeLabelSprite('Đỉnh nóc: ' + RIDGE_H + 'm', 'rgba(234, 88, 12, 0.92)', '#fb923c');
        spRidge.position.set(dimX - 2.5, RIDGE_H, 0);
        dimGroup.add(spRidge);

        const spBay = makeLabelSprite('Bước gian: ' + BAY_S + 'm', 'rgba(15, 23, 42, 0.9)', '#ea580c');
        spBay.position.set(dimX - 2.2, 0.6, -halfL + BAY_S / 2);
        dimGroup.add(spBay);

        // THÊM TẤT CẢ VÀO SCENE
        scene.add(frameGroup);
        scene.add(roofPurlinGroup);
        scene.add(wallGirtGroup);
        scene.add(wallSheetGroup);
        scene.add(brickGroup);
        scene.add(doorGroup);
        scene.add(roofGroup);
        scene.add(dimGroup);

        // CẤU HÌNH BẬT / TẮT TỪNG LỚP KẾT CẤU BÊN PHẢI
        function setupToggle(btnId, badgeId, group) {{
            const btn = document.getElementById(btnId);
            const badge = document.getElementById(badgeId);
            if (!btn || !group) return;
            let isVisible = true;
            btn.addEventListener('click', function() {{
                isVisible = !isVisible;
                group.visible = isVisible;
                btn.classList.toggle('active', isVisible);
                if (badge) {{
                    badge.innerText = isVisible ? 'BẬT' : 'TẮT';
                    badge.className = isVisible ? 'layer-badge on' : 'layer-badge off';
                }}
            }});
        }}

        setupToggle('btn-layer-roof', 'badge-roof', roofGroup);
        setupToggle('btn-layer-wall', 'badge-wall', wallSheetGroup);
        setupToggle('btn-layer-roof-purlin', 'badge-roof-purlin', roofPurlinGroup);
        setupToggle('btn-layer-wall-girt', 'badge-wall-girt', wallGirtGroup);
        setupToggle('btn-layer-frame', 'badge-frame', frameGroup);
        setupToggle('btn-layer-brick', 'badge-brick', brickGroup);
        setupToggle('btn-layer-door', 'badge-door', doorGroup);
        setupToggle('btn-layer-dim', 'badge-dim', dimGroup);

        const resetBtn = document.getElementById('btn-layer-reset');
        if (resetBtn) resetBtn.addEventListener('click', function() {{ changeView('orbit'); }});
        const headReset = document.getElementById('btn-head-reset');
        if (headReset) headReset.addEventListener('click', function() {{ changeView('orbit'); }});

        // ĐÓNG / MỞ BẢNG CHÚ THÍCH BÊN TRÁI
        const specsPanel = document.getElementById('specs-panel');
        const openSpecsBtn = document.getElementById('btn-open-specs');
        const closeSpecsBtn = document.getElementById('btn-close-specs');
        const headSpecsBtn = document.getElementById('btn-head-specs');

        function toggleSpecs(open) {{
            if (open) {{
                specsPanel.classList.remove('collapsed');
                openSpecsBtn.style.display = 'none';
            }} else {{
                specsPanel.classList.add('collapsed');
                openSpecsBtn.style.display = 'flex';
            }}
        }}
        if (closeSpecsBtn) closeSpecsBtn.addEventListener('click', function() {{ toggleSpecs(false); }});
        if (openSpecsBtn) openSpecsBtn.addEventListener('click', function() {{ toggleSpecs(true); }});
        if (headSpecsBtn) headSpecsBtn.addEventListener('click', function() {{
            toggleSpecs(specsPanel.classList.contains('collapsed'));
        }});

        // ĐÓNG / MỞ BẢNG ĐIỀU KHIỂN BẬT / TẮT BÊN PHẢI
        const layersPanel = document.getElementById('layers-panel');
        const openLayersBtn = document.getElementById('btn-open-layers');
        const closeLayersBtn = document.getElementById('btn-close-layers');
        const headLayersBtn = document.getElementById('btn-head-layers');

        function toggleLayers(open) {{
            if (open) {{
                layersPanel.classList.remove('collapsed');
                openLayersBtn.style.display = 'none';
            }} else {{
                layersPanel.classList.add('collapsed');
                openLayersBtn.style.display = 'flex';
            }}
        }}
        if (closeLayersBtn) closeLayersBtn.addEventListener('click', function() {{ toggleLayers(false); }});
        if (openLayersBtn) openLayersBtn.addEventListener('click', function() {{ toggleLayers(true); }});
        if (headLayersBtn) headLayersBtn.addEventListener('click', function() {{
            toggleLayers(layersPanel.classList.contains('collapsed'));
        }});

        // Chuyển đổi các góc nhìn an toàn không phụ thuộc biến toàn cục event
        function changeView(name) {{
            document.querySelectorAll('.view-btn').forEach(function(b) {{ b.classList.remove('active'); }});
            var activeBtn = document.getElementById('btn-view-' + name);
            if (activeBtn) activeBtn.classList.add('active');

            if (name === 'orbit') {{
                camera.position.set(W * 1.35, H * 1.9, L * 0.95);
                controls.target.set(0, H * 0.45, 0);
            }} else if (name === 'front') {{
                camera.position.set(0, H * 0.9, L * 0.95);
                controls.target.set(0, H * 0.5, 0);
            }} else if (name === 'side') {{
                camera.position.set(W * 1.6, H * 0.85, 0);
                controls.target.set(0, H * 0.45, 0);
            }} else if (name === 'bird') {{
                camera.position.set(0, H * 4.2, 1);
                controls.target.set(0, 0, 0);
            }} else if (name === 'inside') {{
                camera.position.set(0, 2.2, halfL - 4);
                if (controls) controls.target.set(0, 3.2, -halfL + 8);
            }}
            if (controls) controls.update();
        }}

        document.getElementById('btn-view-orbit').addEventListener('click', function() {{ changeView('orbit'); }});
        document.getElementById('btn-view-front').addEventListener('click', function() {{ changeView('front'); }});
        document.getElementById('btn-view-side').addEventListener('click', function() {{ changeView('side'); }});
        document.getElementById('btn-view-bird').addEventListener('click', function() {{ changeView('bird'); }});
        document.getElementById('btn-view-inside').addEventListener('click', function() {{ changeView('inside'); }});

        function onResize() {{
            const w = getW();
            const h = getH();
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        }}
        window.addEventListener('resize', onResize);
        setTimeout(onResize, 250);
        setTimeout(onResize, 1000);

        function animate() {{
            requestAnimationFrame(animate);
            if (controls) controls.update();
            renderer.render(scene, camera);
        }}
        animate();
    </script>
</body>
</html>";
        }
    }
}
