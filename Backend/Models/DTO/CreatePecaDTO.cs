using System.ComponentModel.DataAnnotations;

namespace PecaMonitoramentoAPI.DTOs
{
    public class CreatePecaDTO
    {
        [Required(ErrorMessage = "O tipo da peça é obrigatória.")]
        public string TipoPeca { get; set; } = string.Empty;
    }
}
