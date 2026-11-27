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

        private static string GenerateBrightThreeJsHtml(
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

            var craneHtml = hasCrane
                ? $@"<tr><td>Cẩu trục chạy suốt:</td><td><b>{craneCapacity}</b> (Dầm ray & dầm đỡ thép)</td></tr>"
                : "<tr><td>Cẩu trục:</td><td>Không bố trí (Tiết kiệm chi phí khung)</td></tr>";

            return $@"<!DOCTYPE html>
<html lang=""vi"">
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>{title}</title>
    <!-- Three.js + OrbitControls -->
    <script src=""https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js""></script>
    <script src=""https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js""></script>
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
        .action-btns {{ display: flex; gap: 6px; pointer-events: auto; }}
        .icon-btn {{
            background: var(--bg-card); border: 1px solid var(--border);
            color: var(--text-main); width: 34px; height: 34px;
            border-radius: 10px; cursor: pointer; display: flex;
            align-items: center; justify-content: center; font-size: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.06); transition: all 0.2s;
        }}
        .icon-btn:hover {{ border-color: var(--primary-orange); color: var(--primary-orange); transform: translateY(-1px); }}
        .panel-specs {{
            position: absolute; top: 72px; left: 14px; width: 310px; max-height: calc(100vh - 140px);
            overflow-y: auto; z-index: 10; background: var(--bg-card);
            backdrop-filter: blur(14px); border: 1px solid var(--border);
            border-radius: 16px; padding: 14px; box-shadow: 0 8px 25px rgba(0,0,0,0.08);
            transition: all 0.3s ease;
        }}
        .panel-specs.collapsed {{ transform: translateX(-340px); opacity: 0; pointer-events: none; }}
        .spec-title {{ font-size: 11.5px; font-weight: 800; color: var(--primary-orange); margin-bottom: 6px; text-transform: uppercase; }}
        .spec-table {{ width: 100%; border-collapse: collapse; font-size: 11px; }}
        .spec-table td {{ padding: 4.5px 2px; border-bottom: 1px solid rgba(0,0,0,0.05); }}
        .spec-table td:first-child {{ color: var(--text-muted); width: 46%; }}
        .spec-table td:last-child {{ font-weight: 700; text-align: right; }}
        .btn-toggle-panel {{
            position: absolute; top: 72px; left: 14px; z-index: 9;
            background: var(--bg-card); border: 1px solid var(--primary-orange);
            color: var(--primary-orange); padding: 7px 12px; border-radius: 20px;
            font-size: 11px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 12px rgba(234,88,12,0.2);
        }}
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
    </style>
</head>
<body>
    <div id=""webgl-container""></div>

    <div class=""header-bar"">
        <div class=""brand-badge"">
            <h1><i class=""fa-solid fa-cube text-orange-600""></i> {title}</h1>
            <p>Mô hình 3D xoay 360° | Gemini AI Engine</p>
        </div>
        <div class=""action-btns"">
            <button class=""icon-btn"" id=""btn-roof"" title=""Ẩn / Hiện mái tôn""><i class=""fa-solid fa-shield-halved""></i></button>
            <button class=""icon-btn"" id=""btn-reset"" title=""Đặt lại góc nhìn""><i class=""fa-solid fa-arrows-rotate""></i></button>
        </div>
    </div>

    <button class=""btn-toggle-panel"" id=""btn-open-panel"" style=""display:none;""><i class=""fa-solid fa-list""></i> Xem Thông Số</button>

    <div class=""panel-specs"" id=""specs-panel"">
        <div style=""display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;"">
            <div class=""spec-title""><i class=""fa-solid fa-ruler-combined""></i> Thông Số Kết Cấu</div>
            <button id=""btn-close-panel"" style=""background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:13px;"">✕</button>
        </div>
        <table class=""spec-table"">
            <tr><td>Khẩu độ (Rộng):</td><td><b>{width} mét</b></td></tr>
            <tr><td>Chiều dài tổng thể:</td><td><b>{length} mét</b></td></tr>
            <tr><td>Diện tích sàn:</td><td><b>{area:N0} m²</b></td></tr>
            <tr><td>Chiều cao giọt nước:</td><td><b>{height} mét</b></td></tr>
            <tr><td>Chiều cao đỉnh nóc:</td><td><b>{ridgeHeight} mét</b></td></tr>
            <tr><td>Số bước gian:</td><td><b>{bayCount} gian ({baySpacing}m/gian)</b></td></tr>
            <tr><td>Hệ khung kết cấu:</td><td><b>{structureType}</b></td></tr>
            {craneHtml}
            <tr><td>Hệ xà gồ C/Z:</td><td>Mạ kẽm Z275 cường độ cao</td></tr>
            <tr><td>Hệ giằng chống xoắn:</td><td>Giằng chữ X + 2 tầng giằng ống Ø114</td></tr>
        </table>
        <div class=""ai-badge"">
            <b><i class=""fa-solid fa-wand-magic-sparkles text-blue-600""></i> Đánh giá kỹ sư AI:</b><br>
            {aiNote}
        </div>
    </div>

    <div class=""view-controls"">
        <button class=""view-btn active"" id=""btn-view-orbit"">Toàn Cảnh</button>
        <button class=""view-btn"" id=""btn-view-front"">Mặt Trước</button>
        <button class=""view-btn"" id=""btn-view-side"">Bên Hông</button>
        <button class=""view-btn"" id=""btn-view-bird"">Chim Bay</button>
        <button class=""view-btn"" id=""btn-view-inside"">Nội Thất</button>
    </div>

    <script>
        const W = {width};
        const L = {length};
        const H = {height};
        const RIDGE_H = {ridgeHeight};
        const BAYS = {bayCount};
        const BAY_S = {baySpacing};
        const HAS_CRANE = {(hasCrane ? "true" : "false")};

        const container = document.getElementById('webgl-container');
        const scene = new THREE.Scene();
        // NỀN SÁNG BẠC HIỆN ĐẠI (CHỐNG ĐEN MÀN HÌNH)
        scene.background = new THREE.Color(0xf8fafc);
        scene.fog = new THREE.FogExp2(0xf8fafc, 0.0035);

        const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.2, 2000);
        camera.position.set(W * 1.35, H * 1.9, L * 0.95);

        const renderer = new THREE.WebGLRenderer({{ antialias: true, alpha: false, powerPreference: 'high-performance' }});
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.15;
        container.appendChild(renderer.domElement);

        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.maxPolarAngle = Math.PI / 2 - 0.01;
        controls.minDistance = 3;
        controls.maxDistance = 500;
        controls.target.set(0, H * 0.45, 0);

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
        const matPurlin = new THREE.MeshStandardMaterial({{ color: 0x64748b, roughness: 0.45, metalness: 0.7 }});
        const matFooting = new THREE.MeshStandardMaterial({{ color: 0x94a3b8, roughness: 0.85, metalness: 0.1 }});
        const matCrane = new THREE.MeshStandardMaterial({{ color: 0xf59e0b, roughness: 0.35, metalness: 0.8 }});
        const matBrace = new THREE.MeshStandardMaterial({{ color: 0xc2410c, roughness: 0.4, metalness: 0.7 }});
        const matRoofBlue = new THREE.MeshStandardMaterial({{ color: 0x0284c7, roughness: 0.4, metalness: 0.2, side: THREE.DoubleSide, transparent: true, opacity: 0.88 }});

        const factoryGroup = new THREE.Group();
        const roofGroup = new THREE.Group();

        const halfW = W / 2;
        const halfL = L / 2;

        // Dựng các khung Zamil dọc theo bước gian
        for (let i = 0; i <= BAYS; i++) {{
            const z = -halfL + i * BAY_S;

            // Cột bên trái & phải
            const colGeo = new THREE.BoxGeometry(0.42, H, 0.65);
            const colL = new THREE.Mesh(colGeo, matSteelZamil);
            colL.position.set(-halfW + 0.25, H / 2, z);
            colL.castShadow = true;
            factoryGroup.add(colL);

            const colR = new THREE.Mesh(colGeo, matSteelZamil);
            colR.position.set(halfW - 0.25, H / 2, z);
            colR.castShadow = true;
            factoryGroup.add(colR);

            // Móng bê tông cổ cột
            const footGeo = new THREE.BoxGeometry(0.9, 0.6, 0.9);
            const footL = new THREE.Mesh(footGeo, matFooting);
            footL.position.set(-halfW + 0.25, 0.3, z);
            factoryGroup.add(footL);

            const footR = new THREE.Mesh(footGeo, matFooting);
            footR.position.set(halfW - 0.25, 0.3, z);
            factoryGroup.add(footR);

            // Kèo Zamil vát tiết diện
            const rafterLen = Math.sqrt(Math.pow(halfW, 2) + Math.pow(RIDGE_H - H, 2));
            const rafterAngle = Math.atan2(RIDGE_H - H, halfW);

            const rafterGeo = new THREE.BoxGeometry(rafterLen, 0.4, 0.32);

            const rafterL = new THREE.Mesh(rafterGeo, matSteelZamil);
            rafterL.position.set(-halfW / 2, H + (RIDGE_H - H) / 2, z);
            rafterL.rotation.z = rafterAngle;
            rafterL.castShadow = true;
            factoryGroup.add(rafterL);

            const rafterR = new THREE.Mesh(rafterGeo, matSteelZamil);
            rafterR.position.set(halfW / 2, H + (RIDGE_H - H) / 2, z);
            rafterR.rotation.z = -rafterAngle;
            rafterR.castShadow = true;
            factoryGroup.add(rafterR);
        }}

        // Dầm cẩu trục và ray nếu có
        if (HAS_CRANE) {{
            const craneH = H * 0.68;
            const craneBeamGeo = new THREE.BoxGeometry(0.32, 0.5, L);

            const beamL = new THREE.Mesh(craneBeamGeo, matCrane);
            beamL.position.set(-halfW + 0.9, craneH, 0);
            factoryGroup.add(beamL);

            const beamR = new THREE.Mesh(craneBeamGeo, matCrane);
            beamR.position.set(halfW - 0.9, craneH, 0);
            factoryGroup.add(beamR);

            // Dầm cẩu trục ngang màu vàng
            const bridgeGeo = new THREE.BoxGeometry(W - 1.8, 0.55, 1.4);
            const bridge = new THREE.Mesh(bridgeGeo, matCrane);
            bridge.position.set(0, craneH + 0.38, 0);
            bridge.castShadow = true;
            factoryGroup.add(bridge);
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
            factoryGroup.add(b1);

            const b2 = new THREE.Mesh(barGeo, matBrace);
            b2.position.set(xPos, yMid, zMid);
            b2.rotation.x = Math.PI / 2 + angle;
            factoryGroup.add(b2);
        }}

        addXBrace(-halfW + 0.25, -halfL, -halfL + BAY_S, 0.6, H * 0.5);
        addXBrace(halfW - 0.25, -halfL, -halfL + BAY_S, 0.6, H * 0.5);
        addXBrace(-halfW + 0.25, halfL - BAY_S, halfL, 0.6, H * 0.5);
        addXBrace(halfW - 0.25, halfL - BAY_S, halfL, 0.6, H * 0.5);

        // Mái tôn màu xanh công nghiệp
        const rafterLen = Math.sqrt(Math.pow(halfW, 2) + Math.pow(RIDGE_H - H, 2));
        const rafterAngle = Math.atan2(RIDGE_H - H, halfW);

        const roofPlaneGeo = new THREE.PlaneGeometry(rafterLen + 0.8, L + 1.0);
        const roofL = new THREE.Mesh(roofPlaneGeo, matRoofBlue);
        roofL.position.set(-halfW / 2, H + (RIDGE_H - H) / 2 + 0.18, 0);
        roofL.rotation.x = Math.PI / 2;
        roofL.rotation.y = rafterAngle;
        roofGroup.add(roofL);

        const roofR = new THREE.Mesh(roofPlaneGeo, matRoofBlue);
        roofR.position.set(halfW / 2, H + (RIDGE_H - H) / 2 + 0.18, 0);
        roofR.rotation.x = Math.PI / 2;
        roofR.rotation.y = -rafterAngle;
        roofGroup.add(roofR);

        scene.add(factoryGroup);
        scene.add(roofGroup);

        // Ẩn / Hiện mái tôn
        let showRoof = true;
        document.getElementById('btn-roof').addEventListener('click', function() {{
            showRoof = !showRoof;
            roofGroup.visible = showRoof;
        }});

        // Đặt lại góc nhìn
        document.getElementById('btn-reset').addEventListener('click', function() {{
            changeView('orbit');
        }});

        // Ẩn / hiện bảng thông số
        const panel = document.getElementById('specs-panel');
        const openBtn = document.getElementById('btn-open-panel');
        document.getElementById('btn-close-panel').addEventListener('click', function() {{
            panel.classList.add('collapsed');
            openBtn.style.display = 'block';
        }});
        openBtn.addEventListener('click', function() {{
            panel.classList.remove('collapsed');
            openBtn.style.display = 'none';
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
                controls.target.set(0, 3.2, -halfL + 8);
            }}
            controls.update();
        }}

        document.getElementById('btn-view-orbit').addEventListener('click', function() {{ changeView('orbit'); }});
        document.getElementById('btn-view-front').addEventListener('click', function() {{ changeView('front'); }});
        document.getElementById('btn-view-side').addEventListener('click', function() {{ changeView('side'); }});
        document.getElementById('btn-view-bird').addEventListener('click', function() {{ changeView('bird'); }});
        document.getElementById('btn-view-inside').addEventListener('click', function() {{ changeView('inside'); }});

        window.addEventListener('resize', function() {{
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }});

        function animate() {{
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }}
        animate();
    </script>
</body>
</html>";
        }
    }
}
