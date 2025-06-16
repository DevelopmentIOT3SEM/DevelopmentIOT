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
                            id_sensor AS IdSensor,
                            estado AS Estado,
                            timestamp_monitoramento AS TimestampMonitoramento
                        FROM monitoramento";

            using var connection = _context.CreateConnection();
            return await connection.QueryAsync<ReadMonitoramentoDTO>(query);
        }

        public async Task<ReadMonitoramentoDTO?> GetByIdAsync(int id)
        {
            var query = @"SELECT 
                            id_monitoramento AS IdMonitoramento,
                            id_sensor AS IdSensor,
                            estado AS Estado,
                            timestamp_monitoramento AS TimestampMonitoramento
                        FROM monitoramento
                        WHERE id_monitoramento = @id";

            using var connection = _context.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<ReadMonitoramentoDTO>(query, new { id });
        }

        public async Task<int> CreateAsync(CreateMonitoramentoDTO dto)
        {
            var query = @"INSERT INTO monitoramento (
                            id_sensor, estado)
                          VALUES (
                            @IdSensor, @Estado)
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

        public async Task<ReadMonitoramentoDTO?> GetLatestBySensorIdAsync(int sensorId)
        {
            var query = @"SELECT 
                            id_monitoramento AS IdMonitoramento,
                            id_sensor AS IdSensor,
                            estado AS Estado,
                            timestamp_monitoramento AS TimestampMonitoramento
                        FROM monitoramento
                        WHERE id_sensor = @sensorId
                        ORDER BY timestamp_monitoramento DESC
                        LIMIT 1";

            using var connection = _context.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<ReadMonitoramentoDTO>(query, new { sensorId });
        }
    }
}