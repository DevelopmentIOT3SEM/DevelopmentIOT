using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using PecaMonitoramentoAPI.Repositories;
using PecaMonitoramentoAPI.Repositories.Interfaces;
using PecaMonitoramentoAPI.Services;
using PecaMonitoramentoAPI.Services.Interfaces;
using PecaMonitoramentoAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// Connection string (vem de env/User Secrets em produção; default local em appsettings).
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException(
        "ConnectionStrings:DefaultConnection não configurada. Defina via appsettings ou variável de ambiente.");

// Segredo do JWT: obrigatório e com tamanho mínimo para HMAC-SHA256 (>= 256 bits / 32 chars).
var jwtSecret = builder.Configuration["Jwt:Secret"];
if (string.IsNullOrWhiteSpace(jwtSecret) || jwtSecret.Length < 32)
{
    throw new InvalidOperationException(
        "Jwt:Secret ausente ou muito curto. Configure uma chave de pelo menos 32 caracteres " +
        "(via variável de ambiente Jwt__Secret ou User Secrets).");
}

// Acesso a dados via Dapper (uma conexão nova por operação — ver DapperContext).
builder.Services.AddSingleton<DapperContext>();

// Autenticação JWT.
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

// Repositórios.
builder.Services.AddScoped<IPecaRepository, PecaRepository>();
builder.Services.AddScoped<IMonitoramentoRepository, MonitoramentoRepository>();
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<IProducaoRepository, ProducaoRepository>();
builder.Services.AddScoped<ISensorRepository, SensorRepository>();

// Serviços.
builder.Services.AddScoped<IPecaService, PecaService>();
builder.Services.AddScoped<IMonitoramentoService, MonitoramentoService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ISensorService, SensorService>();
builder.Services.AddScoped<IProducaoService, ProducaoService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Swagger com suporte a Bearer (permite testar endpoints autenticados pela UI).
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Peça Monitoramento API",
        Version = "v1",
        Description = "API de monitoramento de peças recicláveis (metálico × plástico)."
    });

    var jwtScheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Description = "Informe: Bearer {seu token JWT}",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        Reference = new OpenApiReference
        {
            Type = ReferenceType.SecurityScheme,
            Id = "Bearer"
        }
    };
    options.AddSecurityDefinition("Bearer", jwtScheme);
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { jwtScheme, Array.Empty<string>() }
    });
});

builder.Services.AddHealthChecks();

// CORS configurável: origens vêm de Cors:Origins (env/appsettings).
var corsOrigins = builder.Configuration.GetSection("Cors:Origins").Get<string[]>()
    ?? new[] { "http://localhost:5173", "http://localhost:5500" };
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(corsOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Tratamento global de exceções: responde ProblemDetails sem vazar stack trace.
app.UseExceptionHandler(handler =>
{
    handler.Run(async context =>
    {
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        await Results.Problem(
            title: "Ocorreu um erro inesperado.",
            statusCode: StatusCodes.Status500InternalServerError
        ).ExecuteAsync(context);
    });
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    // HTTPS redirect só fora de Development (no container só há HTTP exposto).
    app.UseHttpsRedirection();
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHealthChecks("/health");

app.Run();
