using Microsoft.AspNetCore.Mvc;
using FrekvensApi.Data;
using FrekvensApi.Models;
using Microsoft.EntityFrameworkCore;
using FrekvensApi.Extensions;

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
        public async Task<ActionResult<Station>> GetStation(Guid id)
        {
            var station = await _context.Stations.FindAsync(id);

            if (station == null)
            {
                return this.SendNotFound($"Station id not found: {id}");
            }

            return station;
        }

        [HttpPost]
        public async Task<ActionResult<Station>> PostStation(Station station)
        {

            var validationResult = this.ValidateModelState();
            if (validationResult != null)
            {
                return validationResult;
            }

            var stationUrlError = await StationUrlError(station.StreamUrl);
            if (stationUrlError != null)
            {
                return stationUrlError;
            }

            var stationWithFrequency = await StationFrequencyUnavailable(station.Frequency);
            if (stationWithFrequency != null)
            {
                return this.SendBadRequest("A station with the same frequency already exists.");
            }

            station.IsAvailable = true;

            _context.Stations.Add(station);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetStation), new { id = station.Id }, station);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutStation(Guid id, Station station)
        {
            station.Id = id;

            _context.Entry(station).State = EntityState.Modified;

            var validationResult = this.ValidateModelState();
            if (validationResult != null)
            {
                return validationResult;
            }

            var stationUrlError = await StationUrlError(station.StreamUrl);
            if (stationUrlError != null)
            {
                return stationUrlError;
            }

            var stationWithFrequency = StationFrequencyUnavailable(station.Frequency);
            if (stationWithFrequency != null)
            {
                return this.SendBadRequest("A station with the same frequency already exists.");
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StationExists(id))
                {
                    return this.SendNotFound($"Station id not found: {id}");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStation(Guid id)
        {
            var station = await _context.Stations.FindAsync(id);
            if (station == null)
            {
                return this.SendNotFound($"Station id not found: {id}");
            }

            _context.Stations.Remove(station);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool StationExists(Guid id)
        {
            return _context.Stations.Any(e => e.Id == id);
        }

        private async Task<ActionResult?> StationUrlError(string streamUrl)
        {
            if (!Uri.TryCreate(streamUrl, UriKind.Absolute, out _))
            {
                return this.SendBadRequest($"The stream URL is not valid.");
            }

            HttpClient client = new();

            try {
                var response = await client.GetAsync(streamUrl);
            } catch (Exception e) {
                return this.SendBadRequest($"The stream URL is not valid: {e.Message}");
            }

            return null;
        }

        private async Task<ActionResult?> StationFrequencyUnavailable(string frequency)
        {
            var matchingStation = await _context.Stations.FirstOrDefaultAsync(s => s.Frequency == frequency);
            if (matchingStation != null)
            {
                return this.SendBadRequest("A station with the same frequency already exists.");
            }
            return null;
        }
    }
}