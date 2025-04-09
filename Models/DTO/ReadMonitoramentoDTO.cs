namespace PecaMonitoramentoAPI.DTOs
{
    public class ReadMonitoramentoDTO
    {
        public int IdMonitoramento { get; set; }
        public int IdPeca { get; set; }
        public bool EsteiraOnOff { get; set; }
        public bool AtuadorOnOff { get; set; }
        public int QtdeR1 { get; set; }
        public int QtdeR2 { get; set; }
        public int QtdeDescartada { get; set; }
        public DateTime DataHoraMonitoramento { get; set; }
        public int Erros { get; set; }
    }
}
