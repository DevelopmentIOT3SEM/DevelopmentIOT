namespace PecaMonitoramentoAPI.DTOs
{
    public class ProcessarPecaResponseDTO
    {
        public int IdProducao { get; set; }
        public int IdPeca { get; set; }
        public int Rampa { get; set; }
        public string TipoDetectado { get; set; } = string.Empty;
        public string TipoEsperado { get; set; } = string.Empty;
    }
}