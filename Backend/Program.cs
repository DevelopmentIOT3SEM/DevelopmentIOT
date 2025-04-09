using System.Data;
using Npgsql;
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

// Repositórios
builder.Services.AddScoped<IPecaRepository, PecaRepository>();
builder.Services.AddScoped<IMonitoramentoRepository, MonitoramentoRepository>();

// Serviços
builder.Services.AddScoped<IPecaService, PecaService>();
builder.Services.AddScoped<IMonitoramentoService, MonitoramentoService>();

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

app.UseAuthorization();

app.MapControllers();

app.Run();
