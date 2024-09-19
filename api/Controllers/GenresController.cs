using Microsoft.AspNetCore.Mvc;
using FrekvensApi.Data;
using FrekvensApi.Models;
using Microsoft.EntityFrameworkCore;
using FrekvensApi.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace FrekvensApi.Controllers {
    [Authorize]
    [ApiController]
    [Route("genres")]
    public class GenresController : ControllerBase {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public GenresController(ApplicationDbContext context, UserManager<ApplicationUser> userManager) {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Genre>> GetGenre(Guid id) {
            var user = await _userManager.GetUserAsync(User);
            var genre = await _context.Genres.FindAsync(id);

            if (genre == null) {
                return this.SendNotFound($"Genre id not found: {id}");
            }

            if (genre.CreatedBy.Id != user.Id) {
                return Unauthorized();
            }

            var genreDto = new GenreDto {
                Id = genre.Id,
                Name = genre.Name
            };

            return Ok(genreDto);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<GenreDto>>> GetGenre() {
            var user = await _userManager.GetUserAsync(User);
            var genres = await _context.Genres.Where(g => g.CreatedBy.Id == user.Id).ToListAsync();
            return genres
                .Select(g => new GenreDto {
                    Id = g.Id,
                    Name = g.Name
                }).ToList();
        }

        [HttpPost]
        public async Task<ActionResult<Genre>> PostGenre(Genre genre) {

            var user = await _userManager.GetUserAsync(User);
            if (user == null) {
                return Unauthorized();
            }

            genre.Id = Guid.NewGuid();
            genre.CreatedBy = user;

            _context.Genres.Add(genre);

            var validationResult = this.ValidateModelState();
            if (validationResult != null) {
                return validationResult;
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetGenre), new { id = genre.Id }, genre);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutGenre(Guid id, Genre genre) {

            var user = await _userManager.GetUserAsync(User);

            if (genre.CreatedBy.Id != user.Id) {
                return Unauthorized();
            }

            _context.Entry(genre).State = EntityState.Modified;

            try {
                await _context.SaveChangesAsync();
            } catch (DbUpdateConcurrencyException) {
                if (_context.Genres.Any(e => e.Id == id) == false) {
                    return this.SendNotFound($"Genre id not found: {id}");
                } else {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGenre(Guid id) {
            var user = await _userManager.GetUserAsync(User);
            var genre = await _context.Genres.FindAsync(id);

            if (genre == null) {
                return this.SendNotFound($"Genre id not found: {id}");
            }

            if (genre.CreatedBy.Id != user.Id) {
                return Unauthorized();
            }

            var allGenreIds = await _context.Genres.Select(g => g.Id).ToListAsync();
            var stations = await _context.Stations.Where(s => s.GenreId == id).ToListAsync();

            if (stations.Count > 0) {
                return this.SendBadRequest("Genre is in use by stations.");
            }

            _context.Genres.Remove(genre);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}