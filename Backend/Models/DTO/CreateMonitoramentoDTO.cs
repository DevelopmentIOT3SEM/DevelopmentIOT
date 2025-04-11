using System.ComponentModel.DataAnnotations;

public class CreateMonitoramentoDTO
{
    [Required(ErrorMessage = "O id da peça é obrigatória.")]
    public int IdPeca { get; set; }
    [Required]
    public bool EsteiraOnOff { get; set; }
    [Required]
    public bool Atuador1OnOff { get; set; }
    [Required]
    public bool Atuador2OnOff { get; set; }
    [Required]
    public int QtdeR1 { get; set; }
    [Required]
    public int QtdeR2 { get; set; }
    [Required]
    public int QtdeDescartada { get; set; }
    [Required]
    public int Erros { get; set; }
}
