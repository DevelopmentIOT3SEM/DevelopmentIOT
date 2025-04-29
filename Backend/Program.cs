using System.Data;
using System.Text;
using Npgsql;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using PecaMonitoramentoAPI.Repositories;
using PecaMonitoramentoAPI.Repositories.Interfaces;
using PecaMonitoramentoAPI.Services;
using PecaMonitoramentoAPI.Services.Interfaces;
using PecaMonitoramentoAPI.Data;

var builder = WebApplication.CreateBuilder(args);

// Configura a string de conexão com o PostgreSQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Registro da conexão com Dapper
builder.Services.AddScoped<IDbConnection>(sp => new NpgsqlConnection(connectionString));
builder.Services.AddSingleton<DapperContext>();

// Configuração do JWT
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
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"])),
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

// Repositórios
builder.Services.AddScoped<IPecaRepository, PecaRepository>();
builder.Services.AddScoped<IMonitoramentoRepository, MonitoramentoRepository>();
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>(); // Novo repositório
builder.Services.AddScoped<IProducaoRepository, ProducaoRepository>();
builder.Services.AddScoped<ISensorRepository, SensorRepository>();

// Serviços
builder.Services.AddScoped<IPecaService, PecaService>();
builder.Services.AddScoped<IMonitoramentoService, MonitoramentoService>();
builder.Services.AddScoped<IAuthService, AuthService>(); // Novo serviço
builder.Services.AddScoped<ISensorService, SensorService>();
builder.Services.AddScoped<IProducaoService, ProducaoService>();

// Controller e API
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Swagger (ambiente dev)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// IMPORTANTE: UseAuthentication antes de UseAuthorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();