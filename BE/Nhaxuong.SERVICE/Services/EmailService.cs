using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;
using MimeKit.Text;

namespace Nhaxuong.SERVICE.Services
{
    public interface IEmailService
    {
        Task SendOtpEmailAsync(string toEmail, string otp);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendOtpEmailAsync(string toEmail, string otp)
        {
            var smtpServer = _configuration["EmailSettings:SmtpServer"] ?? "smtp.gmail.com";
            var smtpPort = int.TryParse(_configuration["EmailSettings:SmtpPort"], out var port) ? port : 587;
            var senderEmail = _configuration["EmailSettings:SenderEmail"] ?? "nhaxuong.contact@gmail.com";
            var senderName = _configuration["EmailSettings:SenderName"] ?? "Hệ Thống Nhà Xưởng";
            var senderPassword = _configuration["EmailSettings:SenderPassword"] ?? "";

            var email = new MimeMessage();
            email.From.Add(new MailboxAddress(senderName, senderEmail));
            email.To.Add(new MailboxAddress(toEmail, toEmail));
            email.Subject = $"[{otp}] Mã xác thực tài khoản - Nhà Xưởng";

            var htmlBody = $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset=""utf-8"">
    <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }}
        .container {{ max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }}
        .header {{ background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); padding: 32px 24px; text-align: center; color: #ffffff; }}
        .header h1 {{ margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px; color: #ffffff; }}
        .content {{ padding: 32px 24px; }}
        .greeting {{ font-size: 16px; margin-bottom: 16px; font-weight: 600; }}
        .otp-box {{ background-color: #f0f9ff; border: 2px dashed #0284c7; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }}
        .otp-label {{ font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; color: #0369a1; font-weight: 600; margin-bottom: 8px; }}
        .otp-code {{ font-size: 36px; font-weight: 800; color: #0284c7; letter-spacing: 8px; font-family: monospace; }}
        .note {{ font-size: 13px; color: #64748b; line-height: 1.6; margin-top: 20px; }}
        .footer {{ background-color: #f1f5f9; padding: 20px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }}
    </style>
</head>
<body>
    <div class=""container"">
        <div class=""header"">
            <h1>HỆ THỐNG NHÀ XƯỞNG</h1>
            <p style=""margin: 6px 0 0 0; opacity: 0.9; font-size: 14px; color: #ffffff;"">Sàn Giao Dịch Nhà Xưởng & BĐS Công Nghiệp</p>
        </div>
        <div class=""content"">
            <div class=""greeting"">Xin chào Quý khách,</div>
            <p>Bạn đang thực hiện thao tác xác thực tài khoản email trên hệ thống <b>Nhà Xưởng</b>. Dưới đây là mã xác thực OTP của bạn:</p>
            <div class=""otp-box"">
                <div class=""otp-label"">Mã Xác Thực (OTP)</div>
                <div class=""otp-code"">{otp}</div>
            </div>
            <div class=""note"">
                • Mã xác thực này có hiệu lực trong vòng <b>5 phút</b>.<br>
                • Vì lý do an toàn bảo mật, vui lòng <b>tuyệt đối không chia sẻ</b> mã này cho bất kỳ ai.<br>
                • Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email hoặc liên hệ bộ phận hỗ trợ.
            </div>
        </div>
        <div class=""footer"">
            Đây là email tự động từ Hệ Thống Nhà Xưởng. Vui lòng không phản hồi email này.
        </div>
    </div>
</body>
</html>";

            email.Body = new TextPart(TextFormat.Html) { Text = htmlBody };

            if (!string.IsNullOrWhiteSpace(senderPassword) && senderPassword != "your-app-password")
            {
                using var smtp = new SmtpClient();
                try
                {
                    await smtp.ConnectAsync(smtpServer, smtpPort, SecureSocketOptions.StartTls);
                    await smtp.AuthenticateAsync(senderEmail, senderPassword);
                    await smtp.SendAsync(email);
                    await smtp.DisconnectAsync(true);
                    Console.WriteLine($"--> [EmailService] Sent OTP email successfully to {toEmail}");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"--> [EmailService Error] Failed to send email to {toEmail}: {ex.Message}");
                    throw new Exception($"Không thể gửi email xác thực đến {toEmail}. Chi tiết: {ex.Message}");
                }
            }
            else
            {
                Console.WriteLine($"--> [EmailService Note] Smtp Password is placeholder. Simulated OTP for {toEmail} is: {otp}");
            }
        }
    }
}
