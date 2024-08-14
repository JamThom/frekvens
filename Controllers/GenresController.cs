using Microsoft.AspNetCore.Mvc;
using FrekvensApi.Data;
using FrekvensApi.Models;
using Microsoft.EntityFrameworkCore;
using FrekvensApi.Extensions;

namespace FrekvensApi.Controllers {
    [ApiController]
    [Route("genres")]
    public class GenresController : ControllerBase {
        private readonly ApplicationDbContext _context;

        public GenresController(ApplicationDbContext context) {
            _context = context;
        }

        public async Task<ActionResult<Genre>> GetGenre(Guid id) {
            var genre = await _context.Genres.FindAsync(id);

            if (genre == null) {
                return this.SendNotFound($"Genre id not found: {id}");
            }

            return genre;
        }

        public bool GenreExists(Guid id) {
            return _context.Genres.Any(e => e.Id == id);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Genre>>> GetGenres() {
            return await _context.Genres.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Genre>> PostGenre(Genre genre) {

            genre.Id = Guid.NewGuid();

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

            _context.Entry(genre).State = EntityState.Modified;

            try {
                await _context.SaveChangesAsync();
            } catch (DbUpdateConcurrencyException) {
                if (!GenreExists(id)) {
                    return this.SendNotFound($"Genre id not found: {id}");
                } else {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGenre(Guid id) {
            var genre = await _context.Genres.FindAsync(id);
            var allGenreIds = await _context.Genres.Select(g => g.Id).ToListAsync();
            var stations = await _context.Stations.Where(s => s.GenreId == id).ToListAsync();

            if (genre == null) {
                return this.SendBadRequest($"Genre id not found: {id}");
            }

            if (stations.Count > 0) {
                return this.SendBadRequest("Genre is in use by stations.");
            }

            _context.Genres.Remove(genre);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}