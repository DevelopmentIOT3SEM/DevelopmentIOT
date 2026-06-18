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
            const string sql = @"SELECT id AS Id, nome AS Nome, email AS Email, senha AS SenhaHash
                                 FROM usuarios WHERE email = @Email";
            using var connection = _context.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<Usuario>(sql, new { Email = email });
        }

        public async Task<int> Create(Usuario usuario)
        {
            const string sql = @"INSERT INTO usuarios (nome, email, senha)
                                 VALUES (@Nome, @Email, @SenhaHash)
                                 RETURNING id";
            using var connection = _context.CreateConnection();
            return await connection.ExecuteScalarAsync<int>(sql, usuario);
        }

        public async Task<Usuario?> GetById(int id)
        {
            const string sql = @"SELECT id AS Id, nome AS Nome, email AS Email, senha AS SenhaHash
                                 FROM usuarios WHERE id = @Id";
            using var connection = _context.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<Usuario>(sql, new { Id = id });
        }
    }
}
