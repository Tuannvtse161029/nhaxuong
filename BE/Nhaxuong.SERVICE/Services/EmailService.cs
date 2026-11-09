using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;
using MimeKit.Text;

namespace Nhaxuong.SERVICE.Services
{
    public interface IEmailService
    {
        Task SendOtpEmailAsync(string toEmail, string otp, string? purposeTitle = null, string? customSubject = null);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendOtpEmailAsync(string toEmail, string otp, string? purposeTitle = null, string? customSubject = null)
        {
            var smtpServer = _configuration["EmailSettings:SmtpServer"] ?? "smtp.gmail.com";
            var smtpPort = int.TryParse(_configuration["EmailSettings:SmtpPort"], out var port) ? port : 587;
            var senderEmail = _configuration["EmailSettings:SenderEmail"] ?? "academicresearchplatform@gmail.com";
            var senderName = _configuration["EmailSettings:SenderName"] ?? "Hệ Thống Nhà Xưởng";
            var senderPassword = _configuration["EmailSettings:SenderPassword"] ?? "tthgbhszgqjqprlh";

            var title = !string.IsNullOrWhiteSpace(purposeTitle) ? purposeTitle : "Xác thực tài khoản";
            var subject = !string.IsNullOrWhiteSpace(customSubject) 
                ? $"[{otp}] {customSubject}" 
                : $"[{otp}] Mã xác thực {title} - Hệ Thống Nhà Xưởng";

            var email = new MimeMessage();
            email.From.Add(new MailboxAddress(senderName, senderEmail));
            email.To.Add(new MailboxAddress(toEmail, toEmail));
            email.Subject = subject;

            var htmlBody = $@"
<!DOCTYPE html>
<html lang=""vi"">
<head>
    <meta charset=""utf-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>{subject}</title>
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px 12px; color: #0f172a; }}
        .wrapper {{ max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01); border: 1px solid #e2e8f0; }}
        .header {{ background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); padding: 32px 24px; text-align: center; color: #ffffff; }}
        .header h1 {{ margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; color: #ffffff; text-transform: uppercase; }}
        .header p {{ margin: 6px 0 0 0; opacity: 0.92; font-size: 13px; color: #e0f2fe; }}
        .content {{ padding: 32px 24px; }}
        .badge {{ display: inline-block; padding: 6px 14px; background-color: #e0f2fe; color: #0369a1; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px; }}
        .title {{ font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 12px; }}
        .desc {{ font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 24px; }}
        .otp-container {{ background-color: #f8fafc; border: 2px dashed #0284c7; border-radius: 14px; padding: 20px; text-align: center; margin: 20px 0; }}
        .otp-label {{ font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; color: #64748b; font-weight: 600; margin-bottom: 6px; }}
        .otp-code {{ font-size: 38px; font-weight: 800; color: #0284c7; letter-spacing: 8px; font-family: 'Courier New', Courier, monospace; margin: 6px 0; }}
        .otp-expire {{ font-size: 12px; color: #64748b; margin-top: 4px; }}
        .warning-box {{ background-color: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 6px; padding: 12px 16px; margin: 24px 0; font-size: 13px; color: #92400e; line-height: 1.5; }}
        .warning-box strong {{ color: #78350f; }}
        .footer {{ background-color: #f8fafc; padding: 20px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; line-height: 1.6; }}
        .footer a {{ color: #0284c7; text-decoration: none; }}
    </style>
</head>
<body>
    <div class=""wrapper"">
        <div class=""header"">
            <h1>HỆ THỐNG NHÀ XƯỞNG</h1>
            <p>Sàn Giao Dịch Nhà Xưởng & Bất Động Sản Công Nghiệp</p>
        </div>
        <div class=""content"">
            <div style=""text-align: center;"">
                <span class=""badge"">{title}</span>
                <div class=""title"">Xác Nhận Yêu Cầu Của Bạn</div>
            </div>
            <div class=""desc"">
                Xin chào Quý khách,<br><br>
                Hệ thống <b>Nhà Xưởng</b> nhận được yêu cầu <b>{title.ToLower()}</b> liên kết với địa chỉ email: <b>{toEmail}</b>. Vui lòng sử dụng mã xác thực OTP 6 số dưới đây để tiếp tục:
            </div>
            
            <div class=""otp-container"">
                <div class=""otp-label"">Mã Xác Thực OTP Của Bạn</div>
                <div class=""otp-code"">{otp}</div>
                <div class=""otp-expire"">⏱️ Có hiệu lực trong vòng <b>5 phút</b></div>
            </div>

            <div class=""warning-box"">
                <strong>⚠️ Lưu ý bảo mật quan trọng:</strong><br>
                • Tuyệt đối <strong>không chia sẻ</strong> mã OTP này cho bất kỳ ai (kể cả nhân viên hỗ trợ hệ thống).<br>
                • Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email hoặc đổi lại mã PIN ngay lập tức.
            </div>
        </div>
        <div class=""footer"">
            Đây là email tự động từ Hệ Thống Nhà Xưởng.<br>
            Hotline: 0901 234 567 | Website: <a href=""https://nhaxuong-fe.vercel.app"">nhaxuong-fe.vercel.app</a><br>
            © 2026 Hệ Thống Nhà Xưởng. All rights reserved.
        </div>
    </div>
</body>
</html>";

            email.Body = new TextPart(TextFormat.Html) { Text = htmlBody };

            // 1. Try Vercel Serverless Email Relay (HTTPS Port 443 - Never blocked on Render Free)
            var emailApiUrl = _configuration["EmailSettings:EmailApiUrl"] ?? "https://nhaxuong-fe.vercel.app/api/send-email";
            if (!string.IsNullOrWhiteSpace(emailApiUrl))
            {
                try
                {
                    using var client = new HttpClient { Timeout = TimeSpan.FromSeconds(10) };
                    var payload = new
                    {
                        to = toEmail,
                        subject = subject,
                        html = htmlBody,
                        text = $"Mã OTP xác thực của bạn là: {otp}"
                    };
                    var content = new StringContent(
                        System.Text.Json.JsonSerializer.Serialize(payload),
                        System.Text.Encoding.UTF8,
                        "application/json");

                    var response = await client.PostAsync(emailApiUrl, content);
                    var respString = await response.Content.ReadAsStringAsync();
                    if (response.IsSuccessStatusCode)
                    {
                        Console.WriteLine($"--> [Vercel Email Relay] Sent OTP email successfully to {toEmail}: {respString}");
                        return;
                    }
                    else
                    {
                        Console.WriteLine($"--> [Vercel Email Relay Warning] HTTP {response.StatusCode}: {respString}");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"--> [Vercel Email Relay Warning] {ex.Message}");
                }
            }

            // 2. If Brevo API Key is configured, use Brevo HTTP REST API (port 443)
            var brevoApiKey = _configuration["EmailSettings:BrevoApiKey"] 
                ?? _configuration["BrevoApiKey"] 
                ?? Environment.GetEnvironmentVariable("BREVO_API_KEY");

            if (!string.IsNullOrWhiteSpace(brevoApiKey))
            {
                try
                {
                    using var client = new HttpClient { Timeout = TimeSpan.FromSeconds(10) };
                    client.DefaultRequestHeaders.Add("api-key", brevoApiKey);
                    client.DefaultRequestHeaders.Add("accept", "application/json");

                    var payload = new
                    {
                        sender = new { name = senderName, email = senderEmail },
                        to = new[] { new { email = toEmail, name = toEmail } },
                        subject = subject,
                        htmlContent = htmlBody
                    };

                    var content = new StringContent(
                        System.Text.Json.JsonSerializer.Serialize(payload),
                        System.Text.Encoding.UTF8,
                        "application/json");

                    var response = await client.PostAsync("https://api.brevo.com/v3/smtp/email", content);
                    var respString = await response.Content.ReadAsStringAsync();
                    if (response.IsSuccessStatusCode)
                    {
                        Console.WriteLine($"--> [Brevo] Sent OTP email successfully to {toEmail}: {respString}");
                        return;
                    }
                    else
                    {
                        Console.WriteLine($"--> [Brevo Error] {respString}");
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"--> [Brevo Warning] {ex.Message}");
                }
            }

            // 3. Standard MailKit SMTP (Works on Local, VPS, or Non-blocked Cloud Hosts)
            if (!string.IsNullOrWhiteSpace(senderPassword) && senderPassword != "your-app-password")
            {
                using var smtp = new SmtpClient();
                smtp.Timeout = 5000;

                try
                {
                    await smtp.ConnectAsync(smtpServer, smtpPort, smtpPort == 465 ? SecureSocketOptions.SslOnConnect : SecureSocketOptions.StartTls);
                    await smtp.AuthenticateAsync(senderEmail, senderPassword);
                    await smtp.SendAsync(email);
                    await smtp.DisconnectAsync(true);
                    Console.WriteLine($"--> [MailKit] Đã gửi email xác thực OTP thành công đến {toEmail}");
                    return;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"--> [MailKit Warning] Gửi SMTP qua {smtpServer}:{smtpPort} không thành công ({ex.Message}).");
                    Console.WriteLine($"--> [MailKit Cloud Fallback] Mã OTP cho {toEmail} là: {otp}");
                }
            }
            else
            {
                Console.WriteLine($"--> [EmailService Simulation] Mã OTP cho {toEmail} là: {otp}");
            }
        }
    }
}
