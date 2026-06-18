using PecaMonitoramentoAPI.DTOs;

namespace PecaMonitoramentoAPI.Repositories.Interfaces
{
    public interface IMonitoramentoRepository
    {
        Task<IEnumerable<ReadMonitoramentoDTO>> GetAllAsync();
        Task<ReadMonitoramentoDTO?> GetByIdAsync(int id);
        Task<int> CreateAsync(CreateMonitoramentoDTO dto);
        Task<bool> DeleteAsync(int id);
        Task<ReadMonitoramentoDTO?> GetLatestBySensorIdAsync(int sensorId); 
    }
}