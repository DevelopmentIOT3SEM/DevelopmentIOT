using System.ComponentModel.DataAnnotations;

namespace PecaMonitoramentoAPI.DTOs
{
    public class ProcessarPecaDTO
    {
        [Required(ErrorMessage = "O tipo de material esperado é obrigatório.")]
        [RegularExpression("^(Metálica|Plástica)$", ErrorMessage = "O tipo de material esperado deve ser 'Metálica' ou 'Plástica'.")]
        public string TipoMaterialEsperado { get; set; } = string.Empty;
    }
}