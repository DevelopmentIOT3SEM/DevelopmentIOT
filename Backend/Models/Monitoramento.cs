using PecaMonitoramentoAPI.Models;

namespace PecaMonitoramentoAPI.Models
{
    public class Monitoramento
    {
        public int IdMonitoramento { get; set; }
        public int IdSensor { get; set; }
        public string Estado { get; set; } = string.Empty;
        public DateTime TimestampMonitoramento { get; set; }

        
    }
}