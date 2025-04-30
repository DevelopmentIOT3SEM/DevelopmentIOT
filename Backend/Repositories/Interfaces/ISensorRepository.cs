using PecaMonitoramentoAPI.DTOs;

namespace PecaMonitoramentoAPI.Repositories.Interfaces
{
    public interface ISensorRepository
    {
        Task<IEnumerable<ReadSensorDTO>> GetAllAsync();
        Task<ReadSensorDTO?> GetByIdAsync(int id);
    }
}