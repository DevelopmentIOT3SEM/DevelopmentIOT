using Dapper;
using PecaMonitoramentoAPI.Data;
using PecaMonitoramentoAPI.DTOs;
using PecaMonitoramentoAPI.Repositories.Interfaces;

namespace PecaMonitoramentoAPI.Repositories
{
    public class ProducaoRepository : IProducaoRepository
    {
        private readonly DapperContext _context;

        public ProducaoRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ReadProducaoDTO>> GetAllAsync()
        {
            var query = @"SELECT 
                            id_producao AS IdProducao,
                            id_peca AS IdPeca,
                            rampa AS Rampa,
                            timestamp_producao AS TimestampProducao
                        FROM producao";

            using var connection = _context.CreateConnection();
            return await connection.QueryAsync<ReadProducaoDTO>(query);
        }

        public async Task<ReadProducaoDTO?> GetByIdAsync(int id)
        {
            var query = @"SELECT 
                            id_producao AS IdProducao,
                            id_peca AS IdPeca,
                            rampa AS Rampa,
                            timestamp_producao AS TimestampProducao
                        FROM producao
                        WHERE id_producao = @id";

            using var connection = _context.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<ReadProducaoDTO>(query, new { id });
        }

        public async Task<int> CreateAsync(CreateProducaoDTO dto)
        {
            var query = @"INSERT INTO producao (
                            id_peca, rampa)
                          VALUES (
                            @IdPeca, @Rampa)
                          RETURNING id_producao";

            using var connection = _context.CreateConnection();
            return await connection.ExecuteScalarAsync<int>(query, dto);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var query = "DELETE FROM producao WHERE id_producao = @id";

            using var connection = _context.CreateConnection();
            var affectedRows = await connection.ExecuteAsync(query, new { id });

            return affectedRows > 0;
        }
    }
}