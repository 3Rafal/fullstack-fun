using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<TodoDb>(opt => opt.UseInMemoryDatabase("TodoList"));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

var frontendDevURL = "http://localhost:3000";

// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevelopmentCors", policy =>
    {
        var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
            ?? [frontendDevURL];
        policy.WithOrigins(allowedOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApiDocument(config =>
{
    config.DocumentName = "FullstackFun";
    config.Title = "FullstackFunAPI v1";
    config.Version = "v1";
});

// Add SPA static files serving
builder.Services.AddSpaStaticFiles(options =>
{
    options.RootPath = Environment.GetEnvironmentVariable("SPA_STATIC_PATH") ??
                      builder.Configuration["Spa:StaticPath"] ??
                      "../frontend/dist";
});

var app = builder.Build();

// Serve static files first
app.UseStaticFiles();
app.UseSpaStaticFiles();

// CORS middleware
app.UseCors("DevelopmentCors");

DbInitializer.Seed(app);

// Swagger (dev only)
if (app.Environment.IsDevelopment())
{
    app.UseOpenApi();
    app.UseSwaggerUi();
}

// API endpoints
app.MapGroup("/todoitems").MapTodoEndpoints();

// SPA fallback
app.UseSpa(spa =>
{
    spa.Options.SourcePath = "../frontend";
});

app.Run();