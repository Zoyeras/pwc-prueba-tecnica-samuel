using System.ComponentModel.DataAnnotations;

namespace PwcPruebaTecnica.Dtos;

public class CardUpdateDto
{
    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string CardHolderName { get; set; } = string.Empty;

    [Required]
    [StringLength(19, MinimumLength = 13)]
    [RegularExpression(@"^\d+$", ErrorMessage = "CardNumber must contain only digits.")]
    public string CardNumber { get; set; } = string.Empty;

    [Required]
    public DateTime ExpirationDate { get; set; }

    [Required]
    [StringLength(4, MinimumLength = 3)]
    [RegularExpression(@"^\d+$", ErrorMessage = "Cvv must contain only digits.")]
    public string Cvv { get; set; } = string.Empty;
}
