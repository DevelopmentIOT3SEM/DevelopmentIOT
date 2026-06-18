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

        // Classificação da peça (preenchido pelo processamento): o que era
        // esperado e o que os sensores detectaram. Permite análise de erros.
        public string? TipoEsperado { get; set; }
        public string? TipoDetectado { get; set; }
    }
}
