using System.ComponentModel.DataAnnotations;

namespace PecaMonitoramentoAPI.DTOs
{
    public class CreateMonitoramentoDTO
    {
        [Required(ErrorMessage = "O ID do sensor é obrigatório.")]
        public int IdSensor { get; set; }

        [Required(ErrorMessage = "O estado é obrigatório.")]
        [RegularExpression("^(on|off)$", ErrorMessage = "O estado deve ser 'on' ou 'off'.")]
        public string Estado { get; set; } = string.Empty;
    }
}