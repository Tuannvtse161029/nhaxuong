using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Nhaxuong.MODEL.Configurations;
using Nhaxuong.SERVICE.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Controllers
builder.Services.AddControllers();

// 2. Configure SQL Server Database Context (NhaxuongDb on 35.240.181.166)
var connString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Server=tcp:35.240.181.166,1433;Database=NhaxuongDb;User Id=sa;Password=baopro2147!;Encrypt=False;TrustServerCertificate=True;MultipleActiveResultSets=true";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connString, sqlOptions =>
    {
        sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(5),
            errorNumbersToAdd: null);
    }));
Console.WriteLine("--> [Database] Connected to SQL Server (NhaxuongDb)");

// 3. Register Application Services (DI)
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IPropertyService, PropertyService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<ISubscriberService, SubscriberService>();
builder.Services.AddScoped<INoticeService, NoticeService>();

// 4. Configure JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? "Nhaxuong_DevOnly_LocalJwtSecretKey_ChangeInProduction_AtLeast32Bytes";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "Nhaxuong";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "NhaxuongUsers";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// 5. Configure CORS for Vercel Frontend and local development
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// 6. Configure Swagger with JWT Support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Nhà Xưởng & Sắt Thép Tái Sử Dụng API",
        Version = "v1",
        Description = "Hệ thống API RESTful quản lý Nhà Xưởng, Cho Thuê Kho Bãi, Sắt Thép Tái Sử Dụng và Xác Thực Người Dùng."
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Nhập mã JWT Bearer token theo định dạng: Bearer {token}"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// 7. Apply Database Migrations on Startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var db = services.GetRequiredService<AppDbContext>();
        db.Database.Migrate();
        Console.WriteLine("--> [Database] Migrations verified and applied to NhaxuongDb.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"--> [Database Warning] Migration: {ex.Message}");
    }
}

// 8. Configure HTTP Request Pipeline
app.UseCors("AllowAll");

// Static files for uploaded images / documents
app.UseStaticFiles();

// Enable Swagger UI in both Development and Production for Render
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Nhaxuong API v1");
    c.RoutePrefix = "swagger";
});

// Normalize routes: Auto-prefix requests missing /api (e.g. /properties, /categories, /notices, /auth)
app.Use(async (context, next) =>
{
    var path = context.Request.Path.Value ?? "";
    if (!string.IsNullOrEmpty(path) 
        && path != "/"
        && !path.StartsWith("/api", StringComparison.OrdinalIgnoreCase)
        && !path.StartsWith("/swagger", StringComparison.OrdinalIgnoreCase)
        && !path.StartsWith("/healthz", StringComparison.OrdinalIgnoreCase)
        && !path.StartsWith("/uploads", StringComparison.OrdinalIgnoreCase))
    {
        context.Request.Path = "/api" + path;
    }
    await next();
});

app.UseAuthentication();
app.UseAuthorization();

// 9. Map API Controllers
app.MapControllers();

// 10. Root & Healthcheck endpoints for Render deployment monitoring
app.MapGet("/", () => Results.Ok(new
{
    service = "Nhà Xưởng & Sắt Thép Tái Sử Dụng API",
    status = "Healthy",
    environment = app.Environment.EnvironmentName,
    swagger = "/swagger",
    endpoints = new
    {
        auth = "/api/v1/auth",
        properties = "/api/v1/properties",
        categories = "/api/v1/categories",
        subscribers = "/api/v1/subscribers",
        notices = "/api/v1/notices",
        uploads = "/api/v1/uploads"
    },
    timestamp = DateTime.UtcNow
}));

app.MapGet("/healthz", () => Results.Ok(new { status = "Healthy", uptime = DateTime.UtcNow }));

app.Run();
