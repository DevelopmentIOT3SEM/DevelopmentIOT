using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PecaMonitoramentoAPI.DTOs;
using PecaMonitoramentoAPI.Services.Interfaces;

namespace PecaMonitoramentoAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProducaoController : ControllerBase
    {
        private readonly IProducaoService _service;

        public ProducaoController(IProducaoService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var producoes = await _service.GetAllAsync();
            return Ok(producoes);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var producao = await _service.GetByIdAsync(id);
            if (producao == null)
                return NotFound();
            return Ok(producao);
        }

        [HttpPost]
        [Authorize] // Criação manual de produção é operação administrativa.
        public async Task<IActionResult> Create([FromBody] CreateProducaoDTO dto)
        {
            var id = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id }, dto);
        }

        [HttpDelete("{id}")]
        [Authorize] // Operação destrutiva: exige usuário autenticado.
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteAsync(id);
            if (!deleted)
                return NotFound();
            return NoContent();
        }

        [HttpGet("refugos")]
        public async Task<IActionResult> GetRefugos()
        {
            var refugos = await _service.GetRefugosAsync();
            return Ok(refugos);
        }
    }
}