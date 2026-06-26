using System.ComponentModel.DataAnnotations;

namespace PwcPruebaTecnica.Models;

public class Card
{
    public int Id { get; set; }
    
    [Required]
    [StringLength(100, MinimumLength = 2)]
    public required string CardHolderName  { get; set; } = string.Empty;
    
    [Required]
    [StringLength(19, MinimumLength = 13)]
    public required string CardNumber { get; set; } = string.Empty;
    
    [Required]
    public required DateTime ExpirationDate { get; set; }

    [Required]
    [StringLength(4, MinimumLength = 3)]
    public required string Cvv { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime? UpdatedAt { get; set; }
}