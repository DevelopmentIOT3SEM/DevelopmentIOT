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

// Configura a string de conex�o com o PostgreSQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Registro da conex�o com Dapper
builder.Services.AddScoped<IDbConnection>(sp => new NpgsqlConnection(connectionString));
builder.Services.AddSingleton<DapperContext>();

// Configura��o do JWT
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

// Reposit�rios
builder.Services.AddScoped<IPecaRepository, PecaRepository>();
builder.Services.AddScoped<IMonitoramentoRepository, MonitoramentoRepository>();
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>(); // Novo reposit�rio
builder.Services.AddScoped<IProducaoRepository, ProducaoRepository>();
builder.Services.AddScoped<ISensorRepository, SensorRepository>();

// Servi�os
builder.Services.AddScoped<IPecaService, PecaService>();
builder.Services.AddScoped<IMonitoramentoService, MonitoramentoService>();
builder.Services.AddScoped<IAuthService, AuthService>(); // Novo servi�o
builder.Services.AddScoped<ISensorService, SensorService>();
builder.Services.AddScoped<IProducaoService, ProducaoService>();

// Controller e API
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// Configura serviços CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5500") 
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});


var app = builder.Build();

// Swagger (ambiente dev)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// IMPORTANTE: UseAuthentication antes de UseAuthorization
app.UseCors(); 
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();