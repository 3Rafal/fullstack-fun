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

// Use static files middleware first (must be before SPA)
app.UseStaticFiles();

// Use SPA static files middleware
app.UseSpaStaticFiles();

// Use CORS middleware
app.UseCors("DevelopmentCors");

DbInitializer.Seed(app);

if (app.Environment.IsDevelopment())
{
    app.UseOpenApi();
    app.UseSwaggerUi(config =>
    {
        config.DocumentTitle = "TodoAPI";
        config.Path = "/swagger";
        config.DocumentPath = "/swagger/{documentName}/swagger.json";
        config.DocExpansion = "list";
    });
}

app.MapGroup("/todoitems").MapTodoEndpoints();

// Configure SPA fallback routing
app.UseSpa(spa =>
{
    spa.Options.SourcePath = "../frontend";

    if (app.Environment.IsDevelopment())
    {
        // In development, proxy requests to the Vite dev server
        var spaServerUrl = builder.Configuration["Spa:DevelopmentServerUrl"] ?? frontendDevURL;
        spa.UseProxyToSpaDevelopmentServer(spaServerUrl);
    }
});

app.Run();