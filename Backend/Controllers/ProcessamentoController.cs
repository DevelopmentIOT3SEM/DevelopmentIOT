using Microsoft.AspNetCore.Mvc;
using PecaMonitoramentoAPI.DTOs;
using PecaMonitoramentoAPI.Services.Interfaces;

namespace PecaMonitoramentoAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProcessamentoController : ControllerBase
    {
        private readonly IMonitoramentoService _monitoramentoService;
        private readonly IProducaoService _producaoService;
        private readonly IPecaService _pecaService;

        public ProcessamentoController(
            IMonitoramentoService monitoramentoService,
            IProducaoService producaoService,
            IPecaService pecaService)
        {
            _monitoramentoService = monitoramentoService;
            _producaoService = producaoService;
            _pecaService = pecaService;
        }

        [HttpPost("processar-peca")]
        public async Task<IActionResult> ProcessarPeca([FromBody] ProcessarPecaDTO dto)
        {
            // IDs fixos dos sensores
            const int SensorMetalId = 1; // Atuador 1 (detecta metal)
            const int SensorPlasticoId = 2; // Atuador 2 (detecta plástico)

            // Obter os últimos estados dos sensores
            var sensorMetal = await _monitoramentoService.GetLatestBySensorIdAsync(SensorMetalId);
            var sensorPlastico = await _monitoramentoService.GetLatestBySensorIdAsync(SensorPlasticoId);

            // Validar se há dados dos sensores
            if (sensorMetal == null && sensorPlastico == null)
            {
                return BadRequest("Nenhum dado recente encontrado para os sensores de metal e plástico.");
            }
            if (sensorMetal == null)
            {
                return BadRequest("Nenhum dado recente encontrado para o sensor de metal (Atuador 1).");
            }
            if (sensorPlastico == null)
            {
                return BadRequest("Nenhum dado recente encontrado para o sensor de plástico (Atuador 2).");
            }

            // Determinar o tipo detectado com base nos sensores
            // (comparação tolerante a caixa/espaços: "ON", " on ", etc.)
            bool metalOn = string.Equals(sensorMetal.Estado?.Trim(), "on", StringComparison.OrdinalIgnoreCase);
            bool plasticoOn = string.Equals(sensorPlastico.Estado?.Trim(), "on", StringComparison.OrdinalIgnoreCase);

            string tipoDetectado;
            if (metalOn && !plasticoOn)
                tipoDetectado = "Metálica";
            else if (!metalOn && plasticoOn)
                tipoDetectado = "Plástica";
            else
                tipoDetectado = "Refugo";

            // Buscar os IDs das peças dinamicamente
            var pecas = await _pecaService.GetAllAsync();
            var pecaMetalica = pecas.FirstOrDefault(p => p.TipoMaterial == "Metálica");
            var pecaPlastica = pecas.FirstOrDefault(p => p.TipoMaterial == "Plástica");
            var pecaRefugo = pecas.FirstOrDefault(p => p.TipoMaterial == "Refugo");

            if (pecaMetalica == null || pecaPlastica == null || pecaRefugo == null)
            {
                return StatusCode(500, "Erro interno: Tipos de peças (Metálica, Plástica ou Refugo) não encontrados no banco de dados.");
            }

            // Decidir peça e rampa
            int idPeca;
            int rampa;

            if (tipoDetectado == "Refugo" || tipoDetectado != dto.TipoMaterialEsperado)
            {
                idPeca = pecaRefugo.IdPeca; // Refugo
                rampa = 3; // Rampa de descarte
            }
            else
            {
                // Rampa 1 = Metálica, Rampa 2 = Plástica (independente do id da peça no banco).
                idPeca = tipoDetectado == "Metálica" ? pecaMetalica.IdPeca : pecaPlastica.IdPeca;
                rampa = tipoDetectado == "Metálica" ? 1 : 2;
            }

            // Criar evento de produção (guarda esperado x detectado para análise de erros)
            var producaoDto = new CreateProducaoDTO
            {
                IdPeca = idPeca,
                Rampa = rampa,
                TipoEsperado = dto.TipoMaterialEsperado,
                TipoDetectado = tipoDetectado
            };

            var idProducao = await _producaoService.CreateAsync(producaoDto);

            // Criar resposta usando o DTO
            var response = new ProcessarPecaResponseDTO
            {
                IdProducao = idProducao,
                IdPeca = idPeca,
                Rampa = rampa,
                TipoDetectado = tipoDetectado,
                TipoEsperado = dto.TipoMaterialEsperado
            };

            return Created($"/api/producao/{idProducao}", response);
        }
    }
}