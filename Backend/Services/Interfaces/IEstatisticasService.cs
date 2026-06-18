using PecaMonitoramentoAPI.DTOs;

namespace PecaMonitoramentoAPI.Services.Interfaces
{
    public interface IEstatisticasService
    {
        Task<EstatisticasDTO> GetAsync();
    }
}
