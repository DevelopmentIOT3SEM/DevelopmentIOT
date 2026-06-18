using PecaMonitoramentoAPI.Models.DTO;

namespace PecaMonitoramentoAPI.Services.Interfaces
{
    public interface IAuthService
    {
        Task<string> Login(LoginDTO loginDTO);
        Task<UsuarioDTO> Registrar(UsuarioDTO usuarioDTO);
    }
}
