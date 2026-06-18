using PecaMonitoramentoAPI.Models;

namespace PecaMonitoramentoAPI.Repositories.Interfaces
{
    public interface IUsuarioRepository
    {
        Task<Usuario?> GetByEmail(string email);
        Task<int> Create(Usuario usuario);
        Task<Usuario?> GetById(int id);

    }
}
