using PecaMonitoramentoAPI.DTOs;

namespace PecaMonitoramentoAPI.Services.Interfaces
{
    public interface ISensorService
    {
        Task<IEnumerable<ReadSensorDTO>> GetAllAsync();
        Task<ReadSensorDTO?> GetByIdAsync(int id);
    }
}