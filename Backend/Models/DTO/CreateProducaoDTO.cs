using System.ComponentModel.DataAnnotations;

namespace PecaMonitoramentoAPI.DTOs
{
    public class CreateProducaoDTO
    {
        [Required(ErrorMessage = "O ID da peça é obrigatório.")]
        public int IdPeca { get; set; }

        [Required(ErrorMessage = "A rampa é obrigatória.")]
        [Range(1, int.MaxValue, ErrorMessage = "A rampa deve ser um número positivo.")]
        public int Rampa { get; set; }
    }
}