using PecaMonitoramentoAPI.DTOs;

namespace PecaMonitoramentoAPI.Services.Interfaces
{
    public interface IMonitoramentoService
    {
        Task<IEnumerable<ReadMonitoramentoDTO>> GetAllAsync();
        Task<ReadMonitoramentoDTO?> GetByIdAsync(int id);
        Task<int> CreateAsync(CreateMonitoramentoDTO dto);
        Task<bool> DeleteAsync(int id);
        Task<ReadMonitoramentoDTO?> GetLatestBySensorIdAsync(int sensorId); 
    }
}