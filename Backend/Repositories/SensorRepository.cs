using Dapper;
using PecaMonitoramentoAPI.Data;
using PecaMonitoramentoAPI.DTOs;
using PecaMonitoramentoAPI.Repositories.Interfaces;

namespace PecaMonitoramentoAPI.Repositories
{
    public class SensorRepository : ISensorRepository
    {
        private readonly DapperContext _context;

        public SensorRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ReadSensorDTO>> GetAllAsync()
        {
            var query = @"SELECT 
                            id_sensor AS IdSensor,
                            nome AS Nome
                        FROM sensor";

            using var connection = _context.CreateConnection();
            return await connection.QueryAsync<ReadSensorDTO>(query);
        }

        public async Task<ReadSensorDTO?> GetByIdAsync(int id)
        {
            var query = @"SELECT 
                            id_sensor AS IdSensor,
                            nome AS Nome
                        FROM sensor
                        WHERE id_sensor = @id";

            using var connection = _context.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<ReadSensorDTO>(query, new { id });
        }
    }
}