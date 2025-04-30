namespace PecaMonitoramentoAPI.DTOs
{
    public class ReadProducaoDTO
    {
        public int IdProducao { get; set; }
        public int IdPeca { get; set; }
        public int Rampa { get; set; }
        public DateTime TimestampProducao { get; set; }
    }
}