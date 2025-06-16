using Microsoft.AspNetCore.Mvc;
using PecaMonitoramentoAPI.DTOs;
using PecaMonitoramentoAPI.Services.Interfaces;

namespace PecaMonitoramentoAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PecaController : ControllerBase
    {
        private readonly IPecaService _service;

        public PecaController(IPecaService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var pecas = await _service.GetAllAsync();
            return Ok(pecas);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var peca = await _service.GetByIdAsync(id);
            if (peca == null)
                return NotFound();
            return Ok(peca);
        }
    }
}