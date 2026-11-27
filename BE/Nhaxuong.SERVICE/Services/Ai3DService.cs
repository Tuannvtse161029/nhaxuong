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
            // 1. Phân tích tham số từ prompt hoặc form input
            double width = request.Width ?? 24;
            double length = request.Length ?? 84;
            double height = request.Height ?? 9.0;
            string structureType = string.IsNullOrWhiteSpace(request.StructureType) ? "Kèo Zamil" : request.StructureType.Trim();
            bool hasCrane = request.HasCrane ?? false;
            string craneCapacity = string.IsNullOrWhiteSpace(request.CraneCapacity) ? "10 Tấn" : request.CraneCapacity.Trim();

            // Phân tích prompt người dùng nếu có chuỗi kích thước (VD: 30x60, 24x84, 18x45)
            if (!string.IsNullOrWhiteSpace(request.Prompt))
            {
                var matchDim = Regex.Match(request.Prompt, @"(\d{1,3})\s*(?:m|mét)?\s*[xX*]\s*(\d{1,3})");
                if (matchDim.Success)
                {
                    if (double.TryParse(matchDim.Groups[1].Value, out var parsedW)) width = parsedW;
                    if (double.TryParse(matchDim.Groups[2].Value, out var parsedL)) length = parsedL;
                }

                if (request.Prompt.ToLower().Contains("cẩu") || request.Prompt.ToLower().Contains("crane") || request.Prompt.ToLower().Contains("cầu trục"))
                {
                    hasCrane = true;
                    var matchCrane = Regex.Match(request.Prompt, @"(\d{1,2})\s*(?:tấn|tan|t)", RegexOptions.IgnoreCase);
                    if (matchCrane.Success)
                    {
                        craneCapacity = matchCrane.Groups[1].Value + " Tấn";
                    }
                }

                if (request.Prompt.ToLower().Contains("thép i") || request.Prompt.ToLower().Contains("thep i"))
                {
                    structureType = "Thép I Tiêu Chuẩn";
                }
                else if (request.Prompt.ToLower().Contains("kèo tiệp") || request.Prompt.ToLower().Contains("keo tiep"))
                {
                    structureType = "Kèo Tiệp Tam Giác";
                }
            }

            // Đảm bảo kích thước hợp lý
            if (width < 10) width = 24;
            if (length < 12) length = 84;
            if (height < 5) height = 9.0;

            var area = width * length;
            var baySpacing = 6.0;
            var bayCount = (int)Math.Max(2, Math.Round(length / baySpacing));
            baySpacing = Math.Round(length / bayCount, 2);

            var title = $"Mô Hình 3D Nhà Xưởng {width}m x {length}m ({area:N0} m²) {structureType}" + (hasCrane ? $" - Cẩu Trục {craneCapacity}" : "");
            var specsSummary = $"Kích thước: {width}m x {length}m ({area:N0} m²), Cao giọt nước: {height}m, {bayCount} bước gian ({baySpacing}m/gian), Kết cấu: {structureType}" + (hasCrane ? $", Cẩu trục: {craneCapacity}" : "");

            // 2. Hỏi Gemini AI để bổ sung nhận xét chuyên môn & giải pháp kỹ thuật
            string aiNote = "Mô hình kết cấu Zamil khẩu độ lớn chuẩn xuất khẩu với hệ giằng chống xoắn và xà gồ mạ kẽm cường độ cao.";
            try
            {
                var geminiPrompt = $"Bạn là kỹ sư kết cấu nhà xưởng thép hàng đầu. Cho nhà xưởng kích thước {width}m x {length}m ({area} m2), cao {height}m, kết cấu {structureType}, {(hasCrane ? $"có cẩu trục {craneCapacity}" : "không cẩu trục")}. Hãy viết 2 câu nhận xét súc tích về ưu điểm kết cấu, giải pháp thoát nước mái và bước cột {baySpacing}m.";
                var aiSummary = await CallGeminiAsync(geminiPrompt);
                if (!string.IsNullOrWhiteSpace(aiSummary))
                {
                    aiNote = aiSummary.Trim().Replace("\"", "'");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Ai3DService] Gemini query notice: {ex.Message}");
            }

            // 3. Sinh mã file HTML Three.js độc lập chuyên nghiệp
            var htmlCode = GenerateThreeJsHtml(width, length, height, baySpacing, bayCount, structureType, hasCrane, craneCapacity, title, aiNote);

            // 4. Lưu file tĩnh vào thư mục wwwroot/uploads/3d/
            var baseDir = AppContext.BaseDirectory;
            var uploadsDir = Path.Combine(baseDir, "wwwroot", "uploads", "3d");
            if (!Directory.Exists(uploadsDir))
            {
                try { Directory.CreateDirectory(uploadsDir); } catch { }
            }

            // Fallback lưu thêm vào ContentRoot
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
                Message = "Đã sinh mã mô hình 3D tương tác thành công qua Gemini AI!"
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

        private static string GenerateThreeJsHtml(
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
            var ridgeHeight = Math.Round(height + (width * 0.1), 1); // Độ dốc 10%
            var halfW = width / 2.0;

            var craneHtml = hasCrane
                ? $@"<tr><td>Cẩu trục chạy suốt:</td><td>{craneCapacity} (Dầm đỡ dầm ray tiêu chuẩn)</td></tr>"
                : "<tr><td>Cẩu trục:</td><td>Không bố trí (Tiết kiệm chi phí khung)</td></tr>";

            return $@"<!DOCTYPE html>
<html lang=""vi"">
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>{title}</title>
    <!-- Three.js + OrbitControls + FontAwesome -->
    <script src=""https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js""></script>
    <script src=""https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js""></script>
    <link rel=""stylesheet"" href=""https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"">
    <style>
        :root {{
            --bg-canvas: #f8fafc;
            --bg-card: rgba(255, 255, 255, 0.94);
            --border: #cbd5e1;
            --text-main: #0f172a;
            --text-muted: #475569;
            --primary-orange: #ea580c;
            --accent-blue: #0284c7;
            --accent-green: #16a34a;
        }}
        body.dark-mode {{
            --bg-canvas: #090d16;
            --bg-card: rgba(15, 23, 42, 0.94);
            --border: #334155;
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
            --primary-orange: #f97316;
            --accent-blue: #38bdf8;
            --accent-green: #22c55e;
        }}
        * {{ box-sizing: border-box; margin: 0; padding: 0; user-select: none; }}
        body {{
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
            background-color: var(--bg-canvas);
            color: var(--text-main);
            overflow: hidden;
            width: 100vw;
            height: 100vh;
            transition: background-color 0.3s;
        }}
        #webgl-container {{ position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; }}
        .header-bar {{
            position: absolute; top: 12px; left: 16px; right: 16px; z-index: 10;
            display: flex; align-items: center; justify-content: space-between;
            pointer-events: none;
        }}
        .brand-badge {{
            background: var(--bg-card); backdrop-filter: blur(14px);
            border: 1px solid var(--border); padding: 8px 14px;
            border-radius: 14px; pointer-events: auto;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }}
        .brand-badge h1 {{ font-size: 13px; font-weight: 800; color: var(--primary-orange); }}
        .brand-badge p {{ font-size: 11px; color: var(--text-muted); font-weight: 600; }}
        .action-btns {{ display: flex; gap: 8px; pointer-events: auto; }}
        .icon-btn {{
            background: var(--bg-card); border: 1px solid var(--border);
            color: var(--text-main); width: 36px; height: 36px;
            border-radius: 10px; cursor: pointer; display: flex;
            align-items: center; justify-content: center; font-size: 13px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08); transition: all 0.2s;
        }}
        .icon-btn:hover {{ border-color: var(--primary-orange); color: var(--primary-orange); transform: translateY(-2px); }}
        .panel-specs {{
            position: absolute; top: 70px; left: 16px; width: 320px; max-height: calc(100vh - 90px);
            overflow-y: auto; z-index: 10; background: var(--bg-card);
            backdrop-filter: blur(14px); border: 1px solid var(--border);
            border-radius: 16px; padding: 14px; box-shadow: 0 8px 30px rgba(0,0,0,0.12);
            transition: all 0.3s;
        }}
        .panel-specs.collapsed {{ transform: translateX(-350px); opacity: 0; pointer-events: none; }}
        .spec-title {{ font-size: 12px; font-weight: 800; color: var(--primary-orange); margin-bottom: 8px; text-transform: uppercase; }}
        .spec-table {{ width: 100%; border-collapse: collapse; font-size: 11px; }}
        .spec-table td {{ padding: 5px 2px; border-bottom: 1px solid rgba(120,120,120,0.1); }}
        .spec-table td:first-child {{ color: var(--text-muted); width: 45%; }}
        .spec-table td:last-child {{ font-weight: 700; text-align: right; }}
        .btn-toggle-panel {{
            position: absolute; top: 70px; left: 16px; z-index: 9;
            background: var(--bg-card); border: 1px solid var(--primary-orange);
            color: var(--primary-orange); padding: 8px 14px; border-radius: 20px;
            font-size: 11.5px; font-weight: 700; cursor: pointer; box-shadow: 0 4px 15px rgba(234,88,12,0.25);
        }}
        .view-controls {{
            position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%);
            z-index: 10; display: flex; gap: 6px; background: var(--bg-card);
            backdrop-filter: blur(14px); border: 1px solid var(--border);
            padding: 6px 12px; border-radius: 30px; box-shadow: 0 6px 20px rgba(0,0,0,0.15);
            max-width: 95vw; overflow-x: auto;
        }}
        .view-btn {{
            background: transparent; border: none; padding: 6px 10px;
            font-size: 11px; font-weight: 700; color: var(--text-muted);
            border-radius: 20px; cursor: pointer; white-space: nowrap; transition: all 0.2s;
        }}
        .view-btn.active, .view-btn:hover {{ background: var(--primary-orange); color: white; }}
        .ai-badge {{
            margin-top: 10px; padding: 8px; border-radius: 8px;
            background: rgba(2, 132, 199, 0.1); border-left: 3px solid var(--accent-blue);
            font-size: 10.5px; line-height: 1.4; color: var(--text-main);
        }}
    </style>
</head>
<body class=""dark-mode"">
    <div id=""webgl-container""></div>

    <div class=""header-bar"">
        <div class=""brand-badge"">
            <h1><i class=""fa-solid fa-cube text-orange-500""></i> {title}</h1>
            <p>Mô hình 3D tương tác 360° | Sinh bởi Gemini AI</p>
        </div>
        <div class=""action-btns"">
            <button class=""icon-btn"" id=""btn-theme"" title=""Đổi giao diện Sáng / Tối""><i class=""fa-solid fa-moon""></i></button>
            <button class=""icon-btn"" id=""btn-roof"" title=""Ẩn / Hiện mái tôn""><i class=""fa-solid fa-shield-halved""></i></button>
            <button class=""icon-btn"" id=""btn-reset"" title=""Đặt lại góc nhìn""><i class=""fa-solid fa-arrows-rotate""></i></button>
        </div>
    </div>

    <button class=""btn-toggle-panel"" id=""btn-open-panel"" style=""display:none;""><i class=""fa-solid fa-list""></i> Xem Thông Số</button>

    <div class=""panel-specs"" id=""specs-panel"">
        <div style=""display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;"">
            <div class=""spec-title""><i class=""fa-solid fa-ruler-combined""></i> Thông Số Kỹ Thuật</div>
            <button id=""btn-close-panel"" style=""background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:14px;"">✕</button>
        </div>
        <table class=""spec-table"">
            <tr><td>Khẩu độ (Chiều rộng):</td><td>{width} mét</td></tr>
            <tr><td>Chiều dài tổng thể:</td><td>{length} mét</td></tr>
            <tr><td>Diện tích sàn:</td><td>{area:N0} m²</td></tr>
            <tr><td>Chiều cao giọt nước:</td><td>{height} mét</td></tr>
            <tr><td>Chiều cao đỉnh nóc:</td><td>{ridgeHeight} mét</td></tr>
            <tr><td>Số bước gian:</td><td>{bayCount} gian ({baySpacing}m/gian)</td></tr>
            <tr><td>Kết cấu khung kèo:</td><td>{structureType}</td></tr>
            {craneHtml}
            <tr><td>Hệ xà gồ mái/vách:</td><td>Thép C/Z mạ kẽm cường độ cao</td></tr>
            <tr><td>Hệ giằng chống xoắn:</td><td>Giằng chữ X + 2 tầng giằng ống Ø114</td></tr>
        </table>
        <div class=""ai-badge"">
            <b><i class=""fa-solid fa-wand-magic-sparkles text-blue-500""></i> Đánh giá kỹ sư AI:</b><br>
            {aiNote}
        </div>
    </div>

    <div class=""view-controls"">
        <button class=""view-btn active"" onclick=""setView('orbit')"">Toàn Cảnh</button>
        <button class=""view-btn"" onclick=""setView('front')"">Mặt Trước</button>
        <button class=""view-btn"" onclick=""setView('side')"">Bên Hông</button>
        <button class=""view-btn"" onclick=""setView('bird')"">Góc Chim Bay</button>
        <button class=""view-btn"" onclick=""setView('inside')"">Nội Thất</button>
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
        scene.background = new THREE.Color(0x090d16);

        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.5, 1000);
        camera.position.set(W * 1.5, H * 2.2, L * 1.1);

        const renderer = new THREE.WebGLRenderer({{ antialias: true, alpha: true, powerPreference: 'high-performance' }});
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);

        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.maxPolarAngle = Math.PI / 2 - 0.02;
        controls.target.set(0, H * 0.45, 0);

        // Ánh sáng
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444455, 0.9);
        scene.add(hemiLight);

        const sunLight = new THREE.DirectionalLight(0xfff5e6, 1.4);
        sunLight.position.set(W * 1.2, H * 3.5, L * 0.8);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.bias = -0.0005;
        scene.add(sunLight);

        // Nền bê tông
        const groundGeo = new THREE.PlaneGeometry(W * 2.5, L * 2.0);
        const groundMat = new THREE.MeshStandardMaterial({{ color: 0x1e293b, roughness: 0.85, metalness: 0.1 }});
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);

        // Sàn nhà xưởng
        const floorGeo = new THREE.PlaneGeometry(W, L);
        const floorMat = new THREE.MeshStandardMaterial({{ color: 0x334155, roughness: 0.6, metalness: 0.15 }});
        const floor = new THREE.Mesh(floorGeo, floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = 0.05;
        floor.receiveShadow = true;
        scene.add(floor);

        // Vật liệu kết cấu
        const steelMat = new THREE.MeshStandardMaterial({{ color: 0x94a3b8, roughness: 0.4, metalness: 0.7 }});
        const roofMat = new THREE.MeshStandardMaterial({{ color: 0x0284c7, roughness: 0.5, metalness: 0.3, side: THREE.DoubleSide }});
        const craneMat = new THREE.MeshStandardMaterial({{ color: 0xf59e0b, roughness: 0.4, metalness: 0.6 }});
        const braceMat = new THREE.MeshStandardMaterial({{ color: 0x64748b, roughness: 0.5, metalness: 0.5 }});

        const factoryGroup = new THREE.Group();
        const roofGroup = new THREE.Group();

        const halfW = W / 2;
        const halfL = L / 2;

        // Dựng các khung kèo theo bước gian
        for (let i = 0; i <= BAYS; i++) {{
            const z = -halfL + i * BAY_S;

            // Cột trái & phải
            const colGeo = new THREE.BoxGeometry(0.4, H, 0.6);
            const colL = new THREE.Mesh(colGeo, steelMat);
            colL.position.set(-halfW + 0.2, H / 2, z);
            colL.castShadow = true;
            factoryGroup.add(colL);

            const colR = new THREE.Mesh(colGeo, steelMat);
            colR.position.set(halfW - 0.2, H / 2, z);
            colR.castShadow = true;
            factoryGroup.add(colR);

            // Móng cột
            const footGeo = new THREE.BoxGeometry(0.9, 0.6, 0.9);
            const footMat = new THREE.MeshStandardMaterial({{ color: 0x475569 }});
            const footL = new THREE.Mesh(footGeo, footMat);
            footL.position.set(-halfW + 0.2, 0.3, z);
            factoryGroup.add(footL);

            const footR = new THREE.Mesh(footGeo, footMat);
            footR.position.set(halfW - 0.2, 0.3, z);
            factoryGroup.add(footR);

            // Kèo Zamil trái & phải
            const rafterLen = Math.sqrt(Math.pow(halfW, 2) + Math.pow(RIDGE_H - H, 2));
            const rafterAngle = Math.atan2(RIDGE_H - H, halfW);

            const rafterGeo = new THREE.BoxGeometry(rafterLen, 0.35, 0.3);

            const rafterL = new THREE.Mesh(rafterGeo, steelMat);
            rafterL.position.set(-halfW / 2, H + (RIDGE_H - H) / 2, z);
            rafterL.rotation.z = rafterAngle;
            rafterL.castShadow = true;
            factoryGroup.add(rafterL);

            const rafterR = new THREE.Mesh(rafterGeo, steelMat);
            rafterR.position.set(halfW / 2, H + (RIDGE_H - H) / 2, z);
            rafterR.rotation.z = -rafterAngle;
            rafterR.castShadow = true;
            factoryGroup.add(rafterR);
        }}

        // Dầm cẩu trục chạy suốt nếu có
        if (HAS_CRANE) {{
            const craneBeamGeo = new THREE.BoxGeometry(0.3, 0.45, L);
            const craneH = H * 0.68;

            const craneBeamL = new THREE.Mesh(craneBeamGeo, craneMat);
            craneBeamL.position.set(-halfW + 0.8, craneH, 0);
            factoryGroup.add(craneBeamL);

            const craneBeamR = new THREE.Mesh(craneBeamGeo, craneMat);
            craneBeamR.position.set(halfW - 0.8, craneH, 0);
            factoryGroup.add(craneBeamR);

            // Cẩu trục ngang màu vàng
            const craneBridgeGeo = new THREE.BoxGeometry(W - 1.6, 0.5, 1.2);
            const craneBridge = new THREE.Mesh(craneBridgeGeo, craneMat);
            craneBridge.position.set(0, craneH + 0.35, 0);
            factoryGroup.add(craneBridge);
        }}

        // Hệ giằng chữ X ở gian đầu và cuối
        function addXBrace(xPos, zStart, zEnd, yLow, yHigh) {{
            const zMid = (zStart + zEnd) / 2;
            const yMid = (yLow + yHigh) / 2;
            const dz = zEnd - zStart;
            const dy = yHigh - yLow;
            const len = Math.sqrt(dz * dz + dy * dy);
            const angle = Math.atan2(dy, dz);

            const barGeo = new THREE.CylinderGeometry(0.04, 0.04, len, 8);

            const bar1 = new THREE.Mesh(barGeo, braceMat);
            bar1.position.set(xPos, yMid, zMid);
            bar1.rotation.x = Math.PI / 2 - angle;
            factoryGroup.add(bar1);

            const bar2 = new THREE.Mesh(barGeo, braceMat);
            bar2.position.set(xPos, yMid, zMid);
            bar2.rotation.x = Math.PI / 2 + angle;
            factoryGroup.add(bar2);
        }}

        addXBrace(-halfW + 0.2, -halfL, -halfL + BAY_S, 0.6, H * 0.5);
        addXBrace(halfW - 0.2, -halfL, -halfL + BAY_S, 0.6, H * 0.5);
        addXBrace(-halfW + 0.2, halfL - BAY_S, halfL, 0.6, H * 0.5);
        addXBrace(halfW - 0.2, halfL - BAY_S, halfL, 0.6, H * 0.5);

        // Mái tôn 2 cánh
        const rafterLen = Math.sqrt(Math.pow(halfW, 2) + Math.pow(RIDGE_H - H, 2));
        const rafterAngle = Math.atan2(RIDGE_H - H, halfW);

        const roofPlaneGeo = new THREE.PlaneGeometry(rafterLen + 0.6, L + 0.8);
        const roofL = new THREE.Mesh(roofPlaneGeo, roofMat);
        roofL.position.set(-halfW / 2, H + (RIDGE_H - H) / 2 + 0.15, 0);
        roofL.rotation.x = Math.PI / 2;
        roofL.rotation.y = rafterAngle;
        roofGroup.add(roofL);

        const roofR = new THREE.Mesh(roofPlaneGeo, roofMat);
        roofR.position.set(halfW / 2, H + (RIDGE_H - H) / 2 + 0.15, 0);
        roofR.rotation.x = Math.PI / 2;
        roofR.rotation.y = -rafterAngle;
        roofGroup.add(roofR);

        scene.add(factoryGroup);
        scene.add(roofGroup);

        // Controls & Views
        let showRoof = true;
        document.getElementById('btn-roof').onclick = () => {{
            showRoof = !showRoof;
            roofGroup.visible = showRoof;
        }};

        document.getElementById('btn-reset').onclick = () => {{
            setView('orbit');
        }};

        let darkMode = true;
        document.getElementById('btn-theme').onclick = () => {{
            darkMode = !darkMode;
            document.body.classList.toggle('dark-mode', darkMode);
            scene.background = new THREE.Color(darkMode ? 0x090d16 : 0xf8fafc);
        }};

        const panel = document.getElementById('specs-panel');
        const openBtn = document.getElementById('btn-open-panel');
        document.getElementById('btn-close-panel').onclick = () => {{
            panel.classList.add('collapsed');
            openBtn.style.display = 'block';
        }};
        openBtn.onclick = () => {{
            panel.classList.remove('collapsed');
            openBtn.style.display = 'none';
        }};

        function setView(name) {{
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            if (event && event.target) event.target.classList.add('active');

            if (name === 'orbit') {{
                camera.position.set(W * 1.3, H * 2.0, L * 0.9);
                controls.target.set(0, H * 0.45, 0);
            }} else if (name === 'front') {{
                camera.position.set(0, H * 0.9, L * 0.85);
                controls.target.set(0, H * 0.5, 0);
            }} else if (name === 'side') {{
                camera.position.set(W * 1.5, H * 0.8, 0);
                controls.target.set(0, H * 0.45, 0);
            }} else if (name === 'bird') {{
                camera.position.set(0, H * 4.5, 1);
                controls.target.set(0, 0, 0);
            }} else if (name === 'inside') {{
                camera.position.set(0, 2.2, halfL - 4);
                controls.target.set(0, 3.5, -halfL + 8);
            }}
            controls.update();
        }}

        window.addEventListener('resize', () => {{
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
