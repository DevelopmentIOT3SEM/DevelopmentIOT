using PecaMonitoramentoAPI.Models.DTO;
using PecaMonitoramentoAPI.Models;
using PecaMonitoramentoAPI.Repositories.Interfaces;
using PecaMonitoramentoAPI.Services.Interfaces;
using System.Security.Claims;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;

namespace PecaMonitoramentoAPI.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUsuarioRepository _usuarioRepository;
        private readonly IConfiguration _configuration;

        public AuthService(IUsuarioRepository usuarioRepository, IConfiguration configuration)
        {
            _usuarioRepository = usuarioRepository;
            _configuration = configuration;
        }

        public async Task<string> Login(LoginDTO loginDTO)
        {
            var usuario = await _usuarioRepository.GetByEmail(loginDTO.Email);

            if (usuario == null || !BCrypt.Net.BCrypt.Verify(loginDTO.Senha, usuario.SenhaHash))
                throw new UnauthorizedAccessException("Credenciais inválidas");

            return GenerateJwtToken(usuario);
        }

        public async Task<UsuarioDTO> Registrar(UsuarioDTO usuarioDTO)
        {
            if (await _usuarioRepository.GetByEmail(usuarioDTO.Email) != null)
                throw new Exception("Email já está em uso");

            var usuario = new Usuario
            {
                Nome = usuarioDTO.Nome,
                Email = usuarioDTO.Email,
                SenhaHash = BCrypt.Net.BCrypt.HashPassword(usuarioDTO.Senha)
            };

            usuario.Id = await _usuarioRepository.Create(usuario); // O ID é gerado pelo banco

            return new UsuarioDTO
            {
                Nome = usuario.Nome,
                Email = usuario.Email
            };
        }


        private string GenerateJwtToken(Usuario usuario)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Secret"]);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                    new Claim(ClaimTypes.Email, usuario.Email),
                    new Claim(ClaimTypes.Name, usuario.Nome)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
