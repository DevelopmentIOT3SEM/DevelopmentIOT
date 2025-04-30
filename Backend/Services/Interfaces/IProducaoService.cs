using PecaMonitoramentoAPI.DTOs;

namespace PecaMonitoramentoAPI.Services.Interfaces
{
    public interface IProducaoService
    {
        Task<IEnumerable<ReadProducaoDTO>> GetAllAsync();
        Task<ReadProducaoDTO?> GetByIdAsync(int id);
        Task<int> CreateAsync(CreateProducaoDTO dto);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<ReadProducaoDTO>> GetRefugosAsync(); 
    }
}