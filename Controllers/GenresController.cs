using Microsoft.AspNetCore.Mvc;
using FrekvensApi.Data;
using FrekvensApi.Models;
using Microsoft.EntityFrameworkCore;

namespace FrekvensApi.Controllers {
    [ApiController]
    [Route("genres")]
    public class GenresController : ControllerBase {
        private readonly ApplicationDbContext _context;

        public GenresController(ApplicationDbContext context) {
            _context = context;
        }

        public async Task<ActionResult<Genre>> GetGenre(int id) {
            var genre = await _context.Genres.FindAsync(id);

            if (genre == null) {
                return NotFound();
            }

            return genre;
        }

        public bool GenreExists(int id) {
            return _context.Genres.Any(e => e.Id == id);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Genre>>> GetGenres() {
            return await _context.Genres.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Genre>> PostGenre(Genre genre) {
            _context.Genres.Add(genre);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetGenre), new { id = genre.Id }, genre);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutGenre(int id, Genre genre) {
            if (id != genre.Id) {
                return BadRequest();
            }

            _context.Entry(genre).State = EntityState.Modified;

            try {
                await _context.SaveChangesAsync();
            } catch (DbUpdateConcurrencyException) {
                if (!GenreExists(id)) {
                    return NotFound();
                } else {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGenre(int id) {
            var genre = await _context.Genres.FindAsync(id);

            if (genre == null) {
                return NotFound();
            }

            _context.Genres.Remove(genre);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}