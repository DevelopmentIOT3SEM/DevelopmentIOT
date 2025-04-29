using PecaMonitoramentoAPI.DTOs;
using PecaMonitoramentoAPI.Repositories.Interfaces;
using PecaMonitoramentoAPI.Services.Interfaces;

namespace PecaMonitoramentoAPI.Services
{
    public class ProducaoService : IProducaoService
    {
        private readonly IProducaoRepository _repository;

        public ProducaoService(IProducaoRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<ReadProducaoDTO>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<ReadProducaoDTO?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<int> CreateAsync(CreateProducaoDTO dto)
        {
            return await _repository.CreateAsync(dto);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _repository.DeleteAsync(id);
        }
    }
}