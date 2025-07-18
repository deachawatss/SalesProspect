using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using ProspectSync.Api.Configuration;
using ProspectSync.Api.Services;
using System.Text;
using DotNetEnv;

// Load environment variables from root .env file for development
var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
if (environment == "Development")
{
    Env.Load("../.env");
}

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Add health checks
builder.Services.AddHealthChecks();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Configure JWT settings
var jwtSection = builder.Configuration.GetSection("Jwt");
builder.Services.Configure<JwtSettings>(jwtSection);

// Configure JWT Authentication
var jwtSettings = jwtSection.Get<JwtSettings>();
var key = Encoding.ASCII.GetBytes(jwtSettings!.Secret);

builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = jwtSettings.Issuer,
        ValidateAudience = true,
        ValidAudience = jwtSettings.Audience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        builder =>
        {
            builder.WithOrigins("http://localhost:5173", "http://localhost:3000", "http://localhost:3001", "http://192.168.0.21:3020", "http://192.168.0.21:5102")
                   .AllowAnyMethod()
                   .AllowAnyHeader()
                   .AllowCredentials();
        });
});


// Register application services
builder.Services.AddScoped<IProspectService, ProspectService>();
builder.Services.AddScoped<IActiveDirectoryService, ActiveDirectoryService>();

var app = builder.Build();

// Add startup logging
var logger = app.Services.GetRequiredService<ILogger<Program>>();
logger.LogInformation("=== Application Starting ===");
logger.LogInformation("Environment: {Environment}", app.Environment.EnvironmentName);

// Verify critical configurations
try
{
    var configuration = app.Services.GetRequiredService<IConfiguration>();
    var tfcliveConn = configuration.GetConnectionString("Tfclive");
    var srConn = configuration.GetConnectionString("Sr");
    var jwtSecret = configuration["Jwt:Secret"];
    
    logger.LogInformation("Configuration check - Tfclive connection configured: {HasTfclive}", !string.IsNullOrEmpty(tfcliveConn));
    logger.LogInformation("Configuration check - Sr connection configured: {HasSr}", !string.IsNullOrEmpty(srConn));
    logger.LogInformation("Configuration check - JWT secret configured: {HasJwt}", !string.IsNullOrEmpty(jwtSecret));
}
catch (Exception ex)
{
    logger.LogError(ex, "Error checking configuration during startup");
}

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
// app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Map health check endpoint
app.MapHealthChecks("/health");

app.Run();
