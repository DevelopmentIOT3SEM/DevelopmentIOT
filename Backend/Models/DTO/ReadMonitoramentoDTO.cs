namespace PecaMonitoramentoAPI.DTOs
{
    public class ReadMonitoramentoDTO
    {
        public int IdMonitoramento { get; set; }
        public int IdSensor { get; set; }
        public string Estado { get; set; } = string.Empty;
        public DateTime TimestampMonitoramento { get; set; }
    }
}