using PecaMonitoramentoAPI.DTOs;

namespace PecaMonitoramentoAPI.Services.Interfaces
{
    public interface IPecaService
    {
        Task<IEnumerable<ReadPecaDTO>> GetAllAsync();
        Task<ReadPecaDTO?> GetByIdAsync(int id);
        
    }
}
