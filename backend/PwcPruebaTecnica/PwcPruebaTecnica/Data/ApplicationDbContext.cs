using Microsoft.EntityFrameworkCore;
using PwcPruebaTecnica.Models;

namespace PwcPruebaTecnica.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {

    }
    public DbSet<Card> Cards { get; set; }
}