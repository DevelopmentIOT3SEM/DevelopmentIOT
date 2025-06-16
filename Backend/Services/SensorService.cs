using PecaMonitoramentoAPI.DTOs;
using PecaMonitoramentoAPI.Repositories.Interfaces;
using PecaMonitoramentoAPI.Services.Interfaces;

namespace PecaMonitoramentoAPI.Services
{
    public class SensorService : ISensorService
    {
        private readonly ISensorRepository _repository;

        public SensorService(ISensorRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<ReadSensorDTO>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<ReadSensorDTO?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }
    }
}