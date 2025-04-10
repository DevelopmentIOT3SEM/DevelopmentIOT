using System.ComponentModel.DataAnnotations;

namespace PecaMonitoramentoAPI.DTOs
{
    public class CreateMonitoramentoDTO
    {
        [Required(ErrorMessage = "O id da peça é obrigatória.")]
        public int IdPeca { get; set; }
        [Required]
        public bool EsteiraOnOff { get; set; }
        [Required]
        public bool AtuadorOnOff { get; set; }
        [Required]
        public int QtdeR1 { get; set; }
        [Required]
        public int QtdeR2 { get; set; }
        [Required]
        public int QtdeDescartada { get; set; }
        [Required]
        public int Erros { get; set; }
    }
}
