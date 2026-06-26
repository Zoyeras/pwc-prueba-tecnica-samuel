namespace PwcPruebaTecnica.Dtos;

public class CardResponseDto
{
    public int Id { get; set; }
    public string CardHolderName { get; set; } = string.Empty;
    public string CardNumber { get; set; } = string.Empty;
    public DateTime ExpirationDate { get; set; }
    public string Cvv { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}