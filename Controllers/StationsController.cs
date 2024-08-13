using Microsoft.AspNetCore.Mvc;
using FrekvensApi.Data;
using FrekvensApi.Models;
using Microsoft.EntityFrameworkCore;

namespace FrekvensApi.Controllers
{
    [ApiController]
    [Route("stations")]
    public class StationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StationsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Station>>> GetStations()
        {
            return await _context.Stations.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Station>> GetStation(int id)
        {
            var station = await _context.Stations.FindAsync(id);

            if (station == null)
            {
                return NotFound();
            }

            return station;
        }

        [HttpPost]
        public async Task<ActionResult<Station>> PostStation(Station station)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            station.IsAvailable = true;

            _context.Stations.Add(station);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetStation), new { id = station.Id }, station);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutStation(int id, Station station)
        {
            if (id != station.Id)
            {
                return BadRequest();
            }

            _context.Entry(station).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StationExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStation(int id)
        {
            var station = await _context.Stations.FindAsync(id);
            if (station == null)
            {
                return NotFound();
            }

            _context.Stations.Remove(station);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool StationExists(int id)
        {
            return _context.Stations.Any(e => e.Id == id);
        }
    }
}