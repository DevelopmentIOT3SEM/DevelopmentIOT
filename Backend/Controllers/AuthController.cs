using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PecaMonitoramentoAPI.Models.DTO;
using PecaMonitoramentoAPI.Repositories.Interfaces;
using PecaMonitoramentoAPI.Services.Interfaces;
using System.Security.Claims;

namespace PecaMonitoramentoAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IUsuarioRepository _usuarioRepository;

        public AuthController(IAuthService authService, IUsuarioRepository usuarioRepository)
        {
            _authService = authService;
            _usuarioRepository = usuarioRepository;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDTO)
        {
            try
            {
                var token = await _authService.Login(loginDTO);
                return Ok(new { Token = token });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
        }

        [HttpPost("registrar")]
        public async Task<IActionResult> Registrar([FromBody] UsuarioDTO usuarioDTO)
        {
            try
            {
                var result = await _authService.Registrar(usuarioDTO);
                return CreatedAtAction(nameof(GetMe), result);
            }
            catch (InvalidOperationException ex)
            {
                // E-mail já cadastrado: conflito de recurso.
                return Conflict(new { mensagem = ex.Message });
            }
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetMe()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
                return Unauthorized("Token inválido.");

            var usuario = await _usuarioRepository.GetById(userId);

            if (usuario == null)
                return NotFound("Usuário não encontrado.");

            var usuarioDTO = new UsuarioDTO
            {
                
                Nome = usuario.Nome,
                Email = usuario.Email
            };

            return Ok(usuarioDTO);
        }

    }
}
