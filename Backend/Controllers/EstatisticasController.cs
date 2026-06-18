using Microsoft.AspNetCore.Mvc;
using PecaMonitoramentoAPI.Services.Interfaces;

namespace PecaMonitoramentoAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EstatisticasController : ControllerBase
    {
        private readonly IEstatisticasService _service;

        public EstatisticasController(IEstatisticasService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(await _service.GetAsync());
        }
    }
}
