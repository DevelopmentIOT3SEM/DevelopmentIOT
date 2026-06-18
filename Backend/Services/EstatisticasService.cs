using PecaMonitoramentoAPI.DTOs;
using PecaMonitoramentoAPI.Services.Interfaces;

namespace PecaMonitoramentoAPI.Services
{
    public class EstatisticasService : IEstatisticasService
    {
        private const int IdPecaMetalica = 1;
        private const int IdPecaPlastica = 2;
        private const int RampaRefugo = 3;

        private readonly IProducaoService _producaoService;

        public EstatisticasService(IProducaoService producaoService)
        {
            _producaoService = producaoService;
        }

        // Timestamps são gravados em UTC; aproximamos o horário de Brasília (UTC-3).
        private static string Turno(DateTime timestampUtc)
        {
            var hora = timestampUtc.AddHours(-3).Hour;
            if (hora < 12) return "Manhã";
            if (hora < 18) return "Tarde";
            return "Noite";
        }

        public async Task<EstatisticasDTO> GetAsync()
        {
            var producoes = (await _producaoService.GetAllAsync()).ToList();
            var total = producoes.Count;

            var metal = producoes.Count(p => p.IdPeca == IdPecaMetalica);
            var plast = producoes.Count(p => p.IdPeca == IdPecaPlastica);
            var refugo = producoes.Count(p => p.Rampa == RampaRefugo);
            var taxa = total > 0 ? (double)refugo / total * 100 : 0;

            var porTurno = producoes
                .GroupBy(p => Turno(p.TimestampProducao))
                .Select(g => new TurnoStatDTO
                {
                    Turno = g.Key,
                    Total = g.Count(),
                    Eficiencia = Math.Round((double)g.Count(x => x.Rampa != RampaRefugo) / g.Count() * 100, 1),
                })
                .OrderBy(t => t.Turno == "Manhã" ? 0 : t.Turno == "Tarde" ? 1 : 2)
                .ToList();

            var porDia = producoes
                .GroupBy(p => p.TimestampProducao.AddHours(-3).ToString("yyyy-MM-dd"))
                .Select(g => new DiaStatDTO { Data = g.Key, Total = g.Count() })
                .OrderBy(d => d.Data)
                .ToList();

            var refugos = producoes.Where(p => p.Rampa == RampaRefugo).ToList();
            var erros = new ErrosDTO
            {
                PlasticoComoMetal = refugos.Count(p => p.TipoEsperado == "Plástica" && p.TipoDetectado == "Metálica"),
                MetalComoPlastico = refugos.Count(p => p.TipoEsperado == "Metálica" && p.TipoDetectado == "Plástica"),
                NaoIdentificado = refugos.Count(p => p.TipoDetectado == "Refugo" || string.IsNullOrEmpty(p.TipoDetectado)),
            };

            return new EstatisticasDTO
            {
                Total = total,
                TotalMetalica = metal,
                TotalPlastica = plast,
                TotalRefugo = refugo,
                TaxaRefugo = Math.Round(taxa, 1),
                Eficiencia = Math.Round(100 - taxa, 1),
                PorTurno = porTurno,
                PorDia = porDia,
                Erros = erros,
            };
        }
    }
}
