using PecaMonitoramentoAPI.DTOs;
using PecaMonitoramentoAPI.Repositories.Interfaces;
using PecaMonitoramentoAPI.Services.Interfaces;

namespace PecaMonitoramentoAPI.Services
{
    public class PecaService : IPecaService
    {
        private readonly IPecaRepository _repository;

        public PecaService(IPecaRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<ReadPecaDTO>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<ReadPecaDTO?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<int> CreateAsync(CreatePecaDTO dto)
        {
            return await _repository.CreateAsync(dto);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _repository.DeleteAsync(id);
        }
    }
}
