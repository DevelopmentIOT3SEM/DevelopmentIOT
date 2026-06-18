using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PecaMonitoramentoAPI.DTOs;
using PecaMonitoramentoAPI.Services.Interfaces;

namespace PecaMonitoramentoAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MonitoramentoController : ControllerBase
    {
        private readonly IMonitoramentoService _service;

        public MonitoramentoController(IMonitoramentoService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var monitoramentos = await _service.GetAllAsync();
            return Ok(monitoramentos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var monitoramento = await _service.GetByIdAsync(id);
            if (monitoramento == null)
                return NotFound();
            return Ok(monitoramento);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateMonitoramentoDTO dto)
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
    }
}