using PecaMonitoramentoAPI.DTOs;

namespace PecaMonitoramentoAPI.Repositories.Interfaces
{
    public interface IPecaRepository
    {
        Task<IEnumerable<ReadPecaDTO>> GetAllAsync();
        Task<ReadPecaDTO?> GetByIdAsync(int id);
        Task<int> CreateAsync(CreatePecaDTO peca);
        Task<bool> DeleteAsync(int id);
    }
}
