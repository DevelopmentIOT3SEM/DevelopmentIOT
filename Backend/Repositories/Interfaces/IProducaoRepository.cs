using PecaMonitoramentoAPI.DTOs;

namespace PecaMonitoramentoAPI.Repositories.Interfaces
{
    public interface IProducaoRepository
    {
        Task<IEnumerable<ReadProducaoDTO>> GetAllAsync();
        Task<ReadProducaoDTO?> GetByIdAsync(int id);
        Task<int> CreateAsync(CreateProducaoDTO dto);
        Task<bool> DeleteAsync(int id);
    }
}