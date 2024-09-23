using Microsoft.AspNetCore.Mvc;
using FrekvensApi.Data;
using FrekvensApi.Models;
using Microsoft.EntityFrameworkCore;
using FrekvensApi.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace FrekvensApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("stations")]
    public class StationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public StationsController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<StationDto>>> GetStations()
        {
            var user = await _userManager.GetUserAsync(User);
            var stations = await _context.Stations.Where(s => s.CreatedBy.Id == user.Id).ToListAsync();
            return stations
                .Select(s => new StationDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Frequency = s.Frequency,
                    StreamUrl = s.StreamUrl,
                    IsAvailable = s.IsAvailable,
                    GenreId = s.GenreId
                }).ToList();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<StationDto>> GetStation(Guid id)
        {
            var user = await _userManager.GetUserAsync(User);
            var station = await _context.Stations.FindAsync(id);

            if (station == null)
            {
                return this.SendNotFound($"Station id not found: {id}");
            }

            if (station.CreatedBy.Id != user.Id)
            {
                return Unauthorized();
            }

            return new StationDto
            {
                Id = station.Id,
                Name = station.Name,
                Frequency = station.Frequency,
                StreamUrl = station.StreamUrl,
                IsAvailable = station.IsAvailable,
                GenreId = station.GenreId
            };
        }

        [HttpPost]
        public async Task<ActionResult<Station>> PostStation(StationDto station)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized();
            }

            var stationUrlError = await StationUrlError(station.StreamUrl);
            if (stationUrlError != null)
            {
                return stationUrlError;
            }

            var stationWithFrequency = await StationFrequencyUnavailable(station);
            if (stationWithFrequency != null)
            {
                return this.SendBadRequest("A station with the same frequency already exists.");
            }

            _context.Stations.Add(new Station
            {
                Id = Guid.NewGuid(),
                Name = station.Name,
                Frequency = station.Frequency,
                StreamUrl = station.StreamUrl,
                IsAvailable = true,
                GenreId = station.GenreId,
                Genre = await _context.Genres.FindAsync(station.GenreId),
                CreatedBy = user
            });
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetStation), new { id = station.Id }, station);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutStation(Guid id, StationDto station)
        {
            var currentStation = await _context.Stations.FindAsync(id);
            var user = await _userManager.GetUserAsync(User);
            if (currentStation.CreatedBy.Id != user.Id)
            {
                return Unauthorized();
            }

            station.Id = id;

            _context.Entry(station).State = EntityState.Modified;

            var validationResult = this.ValidateModelState();
            if (validationResult != null)
            {
                return validationResult;
            }

            var streamUrlChanged = _context.Entry(station).Property(s => s.StreamUrl).IsModified;

            var stationWithFrequency = await StationFrequencyUnavailable(station);
            if (stationWithFrequency != null)
            {
                return this.SendBadRequest("A station with the same frequency already exists.");
            }

            if (station.IsAvailable || streamUrlChanged)
            {

                var stationUrlError = await StationUrlError(station.StreamUrl);
                if (stationUrlError != null)
                {
                    return stationUrlError;
                }
                else
                {
                    station.IsAvailable = true;
                }
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
            var user = await _userManager.GetUserAsync(User);
            var station = await _context.Stations.FindAsync(id);
            if (station == null)
            {
                return this.SendNotFound($"Station id not found: {id}");
            }

            if (station.CreatedBy.Id != user.Id)
            {
                return Unauthorized();
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

            using HttpClient client = new();

            try
            {
                var request = new HttpRequestMessage(HttpMethod.Get, streamUrl);
                var response = await client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead);

                if (!response.IsSuccessStatusCode)
                {
                    return this.SendBadRequest($"The stream URL is not reachable. Status code: {response.StatusCode}");
                }

                if (response.Content.Headers.ContentType == null ||
                    !response.Content.Headers.ContentType.MediaType.StartsWith("audio/"))
                {
                    return this.SendBadRequest($"The stream URL does not point to an audio stream. Content-Type: {response.Content.Headers.ContentType}");
                }
            }
            catch (Exception e)
            {
                return this.SendBadRequest($"The stream URL is not valid: {e.Message}");
            }

            return null;
        }

        private async Task<ActionResult?> StationFrequencyUnavailable(StationDto station)
        {
            var matchingStation = await _context.Stations.FirstOrDefaultAsync(s => s.Frequency == station.Frequency && s.Id != station.Id);
            if (matchingStation != null)
            {
                return this.SendBadRequest("A station with the same frequency already exists.");
            }
            return null;
        }
    }
}