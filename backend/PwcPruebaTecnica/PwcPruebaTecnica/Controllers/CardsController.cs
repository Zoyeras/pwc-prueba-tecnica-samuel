using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PwcPruebaTecnica.Data;
using PwcPruebaTecnica.Dtos;
using PwcPruebaTecnica.Models;

namespace PwcPruebaTecnica.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CardsController : ControllerBase
{
    private readonly ApplicationDbContext _db;

    public CardsController(ApplicationDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CardResponseDto>>> GetAll(CancellationToken ct)
    {
        var cards = await _db.Cards
            .AsNoTracking()
            .Select(c => new CardResponseDto
            {
                Id = c.Id,
                CardHolderName = c.CardHolderName,
                CardNumber = c.CardNumber,
                ExpirationDate = c.ExpirationDate,
                Cvv = c.Cvv,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt
            })
            .ToListAsync(ct);

        return Ok(cards);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<CardResponseDto>> GetById(int id, CancellationToken ct)
    {
        var card = await _db.Cards
            .AsNoTracking()
            .Where(c => c.Id == id)
            .Select(c => new CardResponseDto
            {
                Id = c.Id,
                CardHolderName = c.CardHolderName,
                CardNumber = c.CardNumber,
                ExpirationDate = c.ExpirationDate,
                Cvv = c.Cvv,
                CreatedAt = c.CreatedAt,
                UpdatedAt = c.UpdatedAt
            })
            .FirstOrDefaultAsync(ct);

        if (card is null)
        {
            return NotFound();
        }

        return Ok(card);
    }

    [HttpPost]
    public async Task<ActionResult<CardResponseDto>> Create(CardCreateDto dto, CancellationToken ct)
    {
        var card = new Card
        {
            CardHolderName = dto.CardHolderName,
            CardNumber = dto.CardNumber,
            ExpirationDate = dto.ExpirationDate,
            Cvv = dto.Cvv,
            CreatedAt = DateTime.UtcNow
        };

        _db.Cards.Add(card);
        await _db.SaveChangesAsync(ct);

        var response = new CardResponseDto
        {
            Id = card.Id,
            CardHolderName = card.CardHolderName,
            CardNumber = card.CardNumber,
            ExpirationDate = card.ExpirationDate,
            Cvv = card.Cvv,
            CreatedAt = card.CreatedAt,
            UpdatedAt = card.UpdatedAt
        };

        return CreatedAtAction(nameof(GetById), new { id = card.Id }, response);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<CardResponseDto>> Update(int id, CardUpdateDto dto, CancellationToken ct)
    {
        var card = await _db.Cards.FirstOrDefaultAsync(c => c.Id == id, ct);

        if (card is null)
        {
            return NotFound();
        }

        card.CardHolderName = dto.CardHolderName;
        card.CardNumber = dto.CardNumber;
        card.ExpirationDate = dto.ExpirationDate;
        card.Cvv = dto.Cvv;
        card.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);

        var response = new CardResponseDto
        {
            Id = card.Id,
            CardHolderName = card.CardHolderName,
            CardNumber = card.CardNumber,
            ExpirationDate = card.ExpirationDate,
            Cvv = card.Cvv,
            CreatedAt = card.CreatedAt,
            UpdatedAt = card.UpdatedAt
        };

        return Ok(response);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        var card = await _db.Cards.FirstOrDefaultAsync(c => c.Id == id, ct);

        if (card is null)
        {
            return NotFound();
        }

        _db.Cards.Remove(card);
        await _db.SaveChangesAsync(ct);

        return NoContent();
    }
}
