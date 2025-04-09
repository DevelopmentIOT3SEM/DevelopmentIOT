using Dapper;
using PecaMonitoramentoAPI.Data;
using PecaMonitoramentoAPI.DTOs;
using PecaMonitoramentoAPI.Repositories.Interfaces;

namespace PecaMonitoramentoAPI.Repositories
{
    public class PecaRepository : IPecaRepository
    {
        private readonly DapperContext _context;

        public PecaRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ReadPecaDTO>> GetAllAsync()
        {
            var query = "SELECT id_peca AS IdPeca, tipo_peca AS TipoPeca FROM peca";
            using var connection = _context.CreateConnection();
            return await connection.QueryAsync<ReadPecaDTO>(query);
        }

        public async Task<ReadPecaDTO?> GetByIdAsync(int id)
        {
            var query = "SELECT id_peca AS IdPeca, tipo_peca AS TipoPeca FROM peca WHERE id_peca = @id";
            using var connection = _context.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<ReadPecaDTO>(query, new { id });
        }

        public async Task<int> CreateAsync(CreatePecaDTO peca)
        {
            var query = "INSERT INTO peca (tipo_peca) VALUES (@TipoPeca) RETURNING id_peca";
            using var connection = _context.CreateConnection();
            return await connection.ExecuteScalarAsync<int>(query, peca);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var query = "DELETE FROM peca WHERE id_peca = @id";
            using var connection = _context.CreateConnection();
            var affectedRows = await connection.ExecuteAsync(query, new { id });
            return affectedRows > 0;
        }
    }
}
