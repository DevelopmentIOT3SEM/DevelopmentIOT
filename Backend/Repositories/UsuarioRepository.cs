using PecaMonitoramentoAPI.Models;
using PecaMonitoramentoAPI.Repositories.Interfaces;
using System.Data;
using Dapper;

namespace PecaMonitoramentoAPI.Repositories
{
    public class UsuarioRepository : IUsuarioRepository
    {
        private readonly IDbConnection _db;

        public UsuarioRepository(IDbConnection db)
        {
            _db = db;
        }

        public async Task<Usuario> GetByEmail(string email)
        {
            const string sql = "SELECT * FROM Usuarios WHERE Email = @Email";
            return await _db.QueryFirstOrDefaultAsync<Usuario>(sql, new { Email = email });
        }

        public async Task<int> Create(Usuario usuario)
        {
            const string sql = @"
            INSERT INTO Usuarios (Nome, Email, SenhaHash) 
            VALUES (@Nome, @Email, @SenhaHash)
            RETURNING Id";

            return await _db.ExecuteScalarAsync<int>(sql, usuario);
        }

        public async Task<Usuario> GetById(int id)
        {
            const string sql = "SELECT * FROM Usuarios WHERE Id = @Id";
            return await _db.QueryFirstOrDefaultAsync<Usuario>(sql, new { Id = id });
        }

    }
}
