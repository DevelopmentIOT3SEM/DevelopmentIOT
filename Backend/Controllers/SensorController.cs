using Microsoft.AspNetCore.Mvc;
using PecaMonitoramentoAPI.DTOs;
using PecaMonitoramentoAPI.Services.Interfaces;

namespace PecaMonitoramentoAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SensorController : ControllerBase
    {
        private readonly ISensorService _service;

        public SensorController(ISensorService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var sensores = await _service.GetAllAsync();
            return Ok(sensores);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var sensor = await _service.GetByIdAsync(id);
            if (sensor == null)
                return NotFound();
            return Ok(sensor);
        }
    }
}