using Dapper;
using PecaMonitoramentoAPI.Data;
using PecaMonitoramentoAPI.DTOs;
using PecaMonitoramentoAPI.Repositories.Interfaces;

namespace PecaMonitoramentoAPI.Repositories
{
    public class MonitoramentoRepository : IMonitoramentoRepository
    {
        private readonly DapperContext _context;

        public MonitoramentoRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ReadMonitoramentoDTO>> GetAllAsync()
        {
            var query = @"SELECT 
                            id_monitoramento AS IdMonitoramento,
                            id_peca AS IdPeca,
                            esteira_on_off AS EsteiraOnOff,
                            atuador_on_off AS AtuadorOnOff,
                            qtde_r1 AS QtdeR1,
                            qtde_r2 AS QtdeR2,
                            qtde_descartada AS QtdeDescartada,
                            data_hora_monitoramento AS DataHoraMonitoramento,
                            erros AS Erros
                        FROM monitoramento";
            using var connection = _context.CreateConnection();
            return await connection.QueryAsync<ReadMonitoramentoDTO>(query);
        }

        public async Task<ReadMonitoramentoDTO?> GetByIdAsync(int id)
        {
            var query = @"SELECT 
                            id_monitoramento AS IdMonitoramento,
                            id_peca AS IdPeca,
                            esteira_on_off AS EsteiraOnOff,
                            atuador_on_off AS AtuadorOnOff,
                            qtde_r1 AS QtdeR1,
                            qtde_r2 AS QtdeR2,
                            qtde_descartada AS QtdeDescartada,
                            data_hora_monitoramento AS DataHoraMonitoramento,
                            erros AS Erros
                        FROM monitoramento
                        WHERE id_monitoramento = @id";
            using var connection = _context.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<ReadMonitoramentoDTO>(query, new { id });
        }

        public async Task<int> CreateAsync(CreateMonitoramentoDTO dto)
        {
            var query = @"INSERT INTO monitoramento (
                            id_peca, esteira_on_off, atuador_on_off, 
                            qtde_r1, qtde_r2, qtde_descartada, erros)
                          VALUES (
                            @IdPeca, @EsteiraOnOff, @AtuadorOnOff,
                            @QtdeR1, @QtdeR2, @QtdeDescartada, @Erros)
                          RETURNING id_monitoramento";
            using var connection = _context.CreateConnection();
            return await connection.ExecuteScalarAsync<int>(query, dto);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var query = "DELETE FROM monitoramento WHERE id_monitoramento = @id";
            using var connection = _context.CreateConnection();
            var affectedRows = await connection.ExecuteAsync(query, new { id });
            return affectedRows > 0;
        }
    }
}
