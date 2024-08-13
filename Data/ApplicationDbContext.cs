using Microsoft.EntityFrameworkCore;
using FrekvensApi.Models;

namespace FrekvensApi.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Station> Stations { get; set; }
        public DbSet<Genre> Genres { get; set; }
    }
}