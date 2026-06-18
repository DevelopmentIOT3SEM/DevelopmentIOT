namespace PecaMonitoramentoAPI.DTOs
{
    public class ReadProducaoDTO
    {
        public int IdProducao { get; set; }
        public int IdPeca { get; set; }
        public int Rampa { get; set; }
        public string? TipoEsperado { get; set; }
        public string? TipoDetectado { get; set; }
        public DateTime TimestampProducao { get; set; }
    }
}
