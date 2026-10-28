var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "Nhaxuong Industrial Real Estate API", Version = "v1" });
});

// Configure CORS for Vercel Frontend and local development
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
app.UseCors("AllowAll");

// Enable Swagger UI in both Development and Production for easy testing on Render
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Nhaxuong API v1");
    c.RoutePrefix = "swagger";
});

// Root & Healthcheck endpoints for Render deployment monitoring
app.MapGet("/", () => Results.Ok(new
{
    service = "Nhaxuong Industrial Real Estate API",
    status = "Healthy",
    environment = app.Environment.EnvironmentName,
    swagger = "/swagger",
    timestamp = DateTime.UtcNow
}));

app.MapGet("/healthz", () => Results.Ok(new { status = "Healthy", uptime = DateTime.UtcNow }));

app.Run();
