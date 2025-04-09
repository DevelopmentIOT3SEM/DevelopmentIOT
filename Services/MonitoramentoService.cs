using PecaMonitoramentoAPI.DTOs;
using PecaMonitoramentoAPI.Repositories.Interfaces;
using PecaMonitoramentoAPI.Services.Interfaces;

namespace PecaMonitoramentoAPI.Services
{
    public class MonitoramentoService : IMonitoramentoService
    {
        private readonly IMonitoramentoRepository _repository;

        public MonitoramentoService(IMonitoramentoRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<ReadMonitoramentoDTO>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<ReadMonitoramentoDTO?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<int> CreateAsync(CreateMonitoramentoDTO dto)
        {
            return await _repository.CreateAsync(dto);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _repository.DeleteAsync(id);
        }
    }
}
