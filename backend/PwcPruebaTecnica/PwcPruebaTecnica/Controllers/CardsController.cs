using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PwcPruebaTecnica.Data;
using PwcPruebaTecnica.Dtos;
using PwcPruebaTecnica.Models;

namespace PwcPruebaTecnica.Controllers
{
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
                    UpdateAt = c.UpdatedAt,
                })
                .ToListAsync(ct);
            return Ok(cards);
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
                UpdateAt = card.UpdatedAt
            };
            return Ok(response);
        }
    }
}
