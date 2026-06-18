using PecaMonitoramentoAPI.Data;
using PecaMonitoramentoAPI.Models;
using PecaMonitoramentoAPI.Repositories.Interfaces;
using Dapper;

namespace PecaMonitoramentoAPI.Repositories
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly DapperContext _context;

        public UsuarioRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<Usuario?> GetByEmail(string email)
        {
            const string sql = "SELECT Id, Nome, Email, SenhaHash FROM Usuarios WHERE Email = @Email";
            using var connection = _context.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<Usuario>(sql, new { Email = email });
        }

        public async Task<int> Create(Usuario usuario)
        {
            const string sql = @"
            INSERT INTO Usuarios (Nome, Email, SenhaHash)
            VALUES (@Nome, @Email, @SenhaHash)
            RETURNING Id";

            using var connection = _context.CreateConnection();
            return await connection.ExecuteScalarAsync<int>(sql, usuario);
        }

        public async Task<Usuario?> GetById(int id)
        {
            const string sql = "SELECT Id, Nome, Email, SenhaHash FROM Usuarios WHERE Id = @Id";
            using var connection = _context.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<Usuario>(sql, new { Id = id });
        }
    }
}
