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

        private const string SelectColumns = @"
            p.id_producao AS IdProducao,
            p.id_peca AS IdPeca,
            p.rampa AS Rampa,
            p.tipo_esperado AS TipoEsperado,
            p.tipo_detectado AS TipoDetectado,
            p.timestamp_producao AS TimestampProducao";

        public async Task<IEnumerable<ReadProducaoDTO>> GetAllAsync()
        {
            var query = $"SELECT {SelectColumns} FROM producao p";
            using var connection = _context.CreateConnection();
            return await connection.QueryAsync<ReadProducaoDTO>(query);
        }

        public async Task<ReadProducaoDTO?> GetByIdAsync(int id)
        {
            var query = $"SELECT {SelectColumns} FROM producao p WHERE p.id_producao = @id";
            using var connection = _context.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<ReadProducaoDTO>(query, new { id });
        }

        public async Task<int> CreateAsync(CreateProducaoDTO dto)
        {
            var query = @"INSERT INTO producao (id_peca, rampa, tipo_esperado, tipo_detectado)
                          VALUES (@IdPeca, @Rampa, @TipoEsperado, @TipoDetectado)
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

        public async Task<IEnumerable<ReadProducaoDTO>> GetRefugosAsync()
        {
            var query = $@"SELECT {SelectColumns}
                          FROM producao p
                          JOIN peca pc ON p.id_peca = pc.id_peca
                          WHERE pc.tipo_material = 'Refugo'";
            using var connection = _context.CreateConnection();
            return await connection.QueryAsync<ReadProducaoDTO>(query);
        }
    }
}
