using Microsoft.EntityFrameworkCore;
using FrekvensApi.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace FrekvensApi.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Station> Stations { get; set; }
        public DbSet<Genre> Genres { get; set; }
    }
}