namespace PecaMonitoramentoAPI.Models
{
    public class Producao
    {
        public int IdProducao { get; set; }
        public int IdPeca { get; set; }
        public int Rampa { get; set; }
        public DateTime TimestampProducao { get; set; }
    }
}