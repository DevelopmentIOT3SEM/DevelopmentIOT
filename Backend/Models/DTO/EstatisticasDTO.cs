namespace PecaMonitoramentoAPI.DTOs
{
    public class EstatisticasDTO
    {
        public int Total { get; set; }
        public int TotalMetalica { get; set; }
        public int TotalPlastica { get; set; }
        public int TotalRefugo { get; set; }
        public double TaxaRefugo { get; set; }
        public double Eficiencia { get; set; }
        public List<TurnoStatDTO> PorTurno { get; set; } = new();
        public List<DiaStatDTO> PorDia { get; set; } = new();
        public ErrosDTO Erros { get; set; } = new();
    }

    public class TurnoStatDTO
    {
        public string Turno { get; set; } = string.Empty;
        public int Total { get; set; }
        public double Eficiencia { get; set; }
    }

    public class DiaStatDTO
    {
        public string Data { get; set; } = string.Empty;
        public int Total { get; set; }
    }

    public class ErrosDTO
    {
        public int PlasticoComoMetal { get; set; }
        public int MetalComoPlastico { get; set; }
        public int NaoIdentificado { get; set; }
    }
}
